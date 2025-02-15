package db

import (
	"context"
	"log"
	"sort"
	"sync"

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

	// Determine if there is an excess over the 20,000 limit.
	excess := totalDocs - 20000
	if excess > 0 {
		log.Printf("Excess documents: %d", excess)
		removeExcessDocuments(ctx, database, collections, collectionCounts, excess)
	} else {
		log.Printf("No excess documents. No deletion needed.")
	}
}

func removeExcessDocuments(ctx context.Context, database *mongo.Database, collections []string, collectionCounts map[string]int64, excess int64) {
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
			// Drop the entire collection if its document count is less than or equal to the excess.
			log.Printf("Dropping collection: %s", coll)
			if err := collRef.Drop(ctx); err != nil {
				log.Printf("Error dropping collection %s: %v", coll, err)
			}
			excess -= count
		} else {
			// Delete only the required number of documents.
			// Sorting by the createdAt field ensures that the oldest documents are deleted.
			log.Printf("Deleting %d documents from %s", excess, coll)

			findOpts := options.Find().
				SetSort(bson.D{{Key: "createdAt", Value: 1}}). // Oldest first.
				SetLimit(excess)
			cursor, err := collRef.Find(ctx, bson.D{}, findOpts)
			if err != nil {
				log.Printf("Error finding documents in %s: %v", coll, err)
				continue
			}

			var docs []bson.M
			if err := cursor.All(ctx, &docs); err != nil {
				log.Printf("Error reading documents from cursor in %s: %v", coll, err)
				continue
			}

			// Gather _id values of the documents to delete.
			var ids []interface{}
			for _, doc := range docs {
				if id, ok := doc["_id"]; ok {
					ids = append(ids, id)
				}
			}

			if len(ids) > 0 {
				_, err = collRef.DeleteMany(ctx, bson.M{"_id": bson.M{"$in": ids}})
				if err != nil {
					log.Printf("Error deleting documents in %s: %v", coll, err)
				}
			}
			excess = 0
		}
	}
}
