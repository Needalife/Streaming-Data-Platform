package api

import (
	"encoding/json"
	"net/http"
	"static-data/db"

	"go.mongodb.org/mongo-driver/mongo"
)

func GetTransactions(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		transactions, err := db.FetchTransactions(client, r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(transactions)
	}
}

func GetTransactionByID(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		transaction, err := db.FetchTransactionByID(client, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(transaction)
	}
}

func GetFilterOptions(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		filters := db.GetFilterOptions(client)
		json.NewEncoder(w).Encode(filters)
	}
}

func SearchTransactions(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var body map[string]string
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		keyword := body["keyword"]

		results, err := db.SearchTransactions(client, keyword)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(results)
	}
}

func GetAvailableDates(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dates, err := db.FetchAvailableDates(client)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(dates)
	}
}
