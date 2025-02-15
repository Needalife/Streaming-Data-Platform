package api

import (
	"encoding/json"
	"net/http"
	"static-data/db"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

// Returns transactions with optional filters and pagination.
func GetTransactions(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Ensure we return JSON.
		w.Header().Set("Content-Type", "application/json")
		transactions, err := db.FetchTransactions(client, r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(transactions)
	}
}

// Returns a single transaction; accepts an optional "date" query parameter.
func GetTransactionByID(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		vars := mux.Vars(r)
		id, ok := vars["id"]
		if !ok || id == "" {
			http.Error(w, "ID parameter is missing", http.StatusBadRequest)
			return
		}

		// Read optional "date" query parameter.
		dateParam := r.URL.Query().Get("date")
		transaction, err := db.FetchTransactionByID(client, id, dateParam)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(transaction)
	}
}

// Returns transactions matching the keyword across all collections.
func SearchTransactions(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		keyword := r.URL.Query().Get("keyword")
		if keyword == "" {
			http.Error(w, "Keyword is required", http.StatusBadRequest)
			return
		}
		results, err := db.SearchTransactions(client, keyword)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(results)
	}
}

// Returns available date-based collection names.
func GetAvailableDates(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		dates, err := db.FetchAvailableDates(client)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(dates)
	}
}
