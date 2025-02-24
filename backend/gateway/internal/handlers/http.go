package handlers

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"gateway/internal/deps"
	myredis "gateway/internal/redis"
)

const StaticServiceURL = "http://static-data:8080/"

func buildCacheKey(path, rawQuery string) string {
	return fmt.Sprintf("gwcache:%s?%s", path, rawQuery)
}

func ForwardHTTPRequestWithCache(d *deps.Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 1. Remove the "/gateway/v1/static" prefix.
		backendPath := strings.TrimPrefix(r.URL.Path, "/gateway/v1/static")
		if backendPath == r.URL.Path {
			http.Error(w, "Invalid path", http.StatusBadRequest)
			return
		}

		// 2. Build the target URL for the static-data service.
		targetURL, err := url.Parse(StaticServiceURL + backendPath)
		if err != nil {
			http.Error(w, "Failed to parse URL", http.StatusInternalServerError)
			return
		}
		targetURL.RawQuery = r.URL.RawQuery

		// 3. Build a unique cache key.
		cacheKey := buildCacheKey(backendPath, r.URL.RawQuery)

		// 4. Check Redis for a cached response.
		cached, err := myredis.GetCache(d.RedisClient, cacheKey)
		if err == nil && cached != "" {
			w.Header().Set("Content-Type", "application/json")
			// On a cache hit, set Snapshot-Time based on the request query or current time.
			if r.URL.Query().Get("snapshotTime") == "" {
				snapshotTime := time.Now().Format("2006-01-02T15:04:05Z07:00")
				w.Header().Set("Snapshot-Time", snapshotTime)
			} else {
				w.Header().Set("Snapshot-Time", r.URL.Query().Get("snapshotTime"))
			}
			fmt.Fprint(w, cached)
			log.Println("Cache hit:", cacheKey)
			return
		}
		log.Println("Cache miss:", cacheKey)

		// 5. Forward the request to the static-data service.
		req, err := http.NewRequest(r.Method, targetURL.String(), r.Body)
		if err != nil {
			http.Error(w, "Failed to create request", http.StatusInternalServerError)
			return
		}
		req.Header = r.Header.Clone()

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			http.Error(w, "Failed to forward request", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		// 6. Read the response body.
		bodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			http.Error(w, "Failed to read response", http.StatusBadGateway)
			return
		}

		// 7. Propagate the Snapshot-Time header from static-data if present,
		// otherwise, compute it based on the query or current time.
		snapshotHeader := resp.Header.Get("Snapshot-Time")
		if snapshotHeader != "" {
			w.Header().Set("Snapshot-Time", snapshotHeader)
		} else if r.URL.Query().Get("snapshotTime") != "" {
			w.Header().Set("Snapshot-Time", r.URL.Query().Get("snapshotTime"))
		} else {
			snapshotTime := time.Now().Format("2006-01-02T15:04:05Z07:00")
			w.Header().Set("Snapshot-Time", snapshotTime)
		}

		// 8. Write the response headers and body back to the client.
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(resp.StatusCode)
		w.Write(bodyBytes)

		// 9. Cache the response in Redis for 5 minutes.
		if err := myredis.SetCache(d.RedisClient, cacheKey, bodyBytes, 5*time.Minute); err != nil {
			log.Printf("Failed to set cache for key %s: %v", cacheKey, err)
		}
	}
}
