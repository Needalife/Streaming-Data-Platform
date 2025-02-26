package db

import (
	"context"
	"log"
	"sort"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ManageData(client *mongo.Client) {
	// Use a single context for all operations.
	ctx := context.Background()
	database := client.Database("static_data")

	// Fetch all collection names.
	collections, err := database.ListCollectionNames(ctx, bson.D{})
	if err != nil {
		log.Printf("Error fetching collections: %v", err)
		return
	}

	// Sort collections by name (assuming the name encodes date information).
	sort.Strings(collections)

	// Count total documents concurrently across all collections.
	var totalDocs int64
	collectionCounts := make(map[string]int64)
	var wg sync.WaitGroup
	var mu sync.Mutex

	for _, coll := range collections {
		wg.Add(1)
		go func(coll string) {
			defer wg.Done()
			count, err := database.Collection(coll).CountDocuments(ctx, bson.D{})
			if err != nil {
				log.Printf("Error counting documents in %s: %v", coll, err)
				return
			}
			mu.Lock()
			collectionCounts[coll] = count
			totalDocs += count
			mu.Unlock()
		}(coll)
	}
	wg.Wait()

	log.Printf("Total Documents: %d", totalDocs)

	// Determine if there is an excess over the 50,000 limit.
	excess := totalDocs - 50000
	if excess > 0 {
		log.Printf("Excess documents: %d", excess)
		removeExcessDocuments(ctx, database, collections, collectionCounts, excess)
	} else {
		log.Printf("No excess documents. No deletion needed.")
	}
}

// removeExcessDocuments deletes documents to reduce the total count,
// and archives every deletion event (partial or full) into "collection_archive".
func removeExcessDocuments(ctx context.Context, database *mongo.Database, collections []string, collectionCounts map[string]int64, excess int64) {
	archiveColl := database.Collection("collection_archive")

	for _, coll := range collections {
		if excess <= 0 {
			break
		}

		count := collectionCounts[coll]
		if count == 0 {
			continue
		}

		collRef := database.Collection(coll)
		if count <= excess {
			// Full deletion: archive the entire collection's count.
			archiveDoc := bson.M{
				"collectionName": coll,
				"docCount":       count,
				"deletedType":    "full",
				"lastUpdated":    time.Now().UTC().Format(time.RFC3339),
			}
			// Upsert the archive document.
			_, err := archiveColl.UpdateOne(ctx,
				bson.M{"collectionName": coll},
				bson.M{"$set": archiveDoc},
				options.Update().SetUpsert(true))
			if err != nil {
				log.Printf("Error archiving collection %s: %v", coll, err)
			} else {
				log.Printf("Archived full deletion for collection %s", coll)
			}

			// Drop the entire collection.
			log.Printf("Dropping collection: %s", coll)
			if err := collRef.Drop(ctx); err != nil {
				log.Printf("Error dropping collection %s: %v", coll, err)
			}
			excess -= count
		} else {
			// Partial deletion: delete only as many documents as needed.
			log.Printf("Deleting %d documents from %s", excess, coll)
			findOpts := options.Find().
				SetSort(bson.D{{Key: "createdAt", Value: 1}}). // oldest first
				SetLimit(excess)
			cursor, err := collRef.Find(ctx, bson.D{}, findOpts)
			if err != nil {
				log.Printf("Error finding documents in %s: %v", coll, err)
				continue
			}

			var docs []bson.M
			if err := cursor.All(ctx, &docs); err != nil {
				cursor.Close(ctx)
				log.Printf("Error reading documents from collection %s: %v", coll, err)
				continue
			}
			cursor.Close(ctx)

			// Gather the _id values.
			var ids []interface{}
			for _, doc := range docs {
				if id, ok := doc["_id"]; ok {
					ids = append(ids, id)
				}
			}

			if len(ids) > 0 {
				delRes, err := collRef.DeleteMany(ctx, bson.M{"_id": bson.M{"$in": ids}})
				if err != nil {
					log.Printf("Error deleting documents in %s: %v", coll, err)
				} else {
					// Archive the partial deletion event.
					deletedCount := delRes.DeletedCount
					// Attempt to find an existing archive record.
					var archiveDoc bson.M
					err = archiveColl.FindOne(ctx, bson.M{"collectionName": coll}).Decode(&archiveDoc)
					var currentDeleted int64 = 0
					if err == nil {
						if val, ok := archiveDoc["docCount"].(int64); ok {
							currentDeleted = val
						} else if val, ok := archiveDoc["docCount"].(float64); ok {
							currentDeleted = int64(val)
						}
					}
					newDeletedCount := currentDeleted + deletedCount
					update := bson.M{
						"collectionName": coll,
						"docCount":       newDeletedCount,
						"deletedType":    "partial",
						"lastUpdated":    time.Now().UTC().Format(time.RFC3339),
					}
					_, err = archiveColl.UpdateOne(ctx,
						bson.M{"collectionName": coll},
						bson.M{"$set": update},
						options.Update().SetUpsert(true))
					if err != nil {
						log.Printf("Error updating archive for collection %s: %v", coll, err)
					} else {
						log.Printf("Archived partial deletion for collection %s, deleted %d documents (total deleted: %d)", coll, deletedCount, newDeletedCount)
					}
				}
			}
			excess = 0 // Assume partial deletion fulfills the required excess.
		}
	}
}
