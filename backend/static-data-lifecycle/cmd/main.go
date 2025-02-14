package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"os"
	"static-data-lifecycle/db"
	"time"
)

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found")
	}

	mongoURI := os.Getenv("MONGO_URI")
	interval := 10 * time.Minute

	client := db.ConnectMongo(mongoURI)
	defer client.Disconnect(nil)

	fmt.Println("Starting data lifecycle management...")

	// Run every interval
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		db.ManageData(client)
		<-ticker.C
	}
}
