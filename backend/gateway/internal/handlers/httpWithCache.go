package handlers

import (
	"fmt"
	"gateway/internal/deps"
	myredis "gateway/redis"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const StaticServiceURL = "http://static-data:8080/"

func ForwardHTTPRequestWithCache(d *deps.Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 1. Strip "/gateway/static"
		backendPath := strings.TrimPrefix(r.URL.Path, "/gateway/static")
		if backendPath == r.URL.Path {
			http.Error(w, "Invalid path", http.StatusBadRequest)
			return
		}

		// 2. Build the target URL
		targetURL, err := url.Parse(StaticServiceURL + backendPath)
		if err != nil {
			http.Error(w, "Failed to parse URL", http.StatusInternalServerError)
			return
		}
		targetURL.RawQuery = r.URL.RawQuery

		// 3. Build a cache key
		cacheKey := buildCacheKey(backendPath, r.URL.RawQuery)

		// 4. Check Redis
		cached, err := myredis.GetCache(d.RedisClient, cacheKey)
		if err == nil && cached != "" {
			w.Header().Set("Content-Type", "application/json")
			fmt.Fprint(w, cached)
			log.Println("Cache hit:", cacheKey)
			return
		}
		log.Println("Cache miss:", cacheKey)

		// 5. Forward to static-data
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

		bodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			http.Error(w, "Failed to read response", http.StatusBadGateway)
			return
		}

		w.WriteHeader(resp.StatusCode)
		w.Header().Set("Content-Type", "application/json")
		w.Write(bodyBytes)

		// 6. Cache the response
		myredis.SetCache(d.RedisClient, cacheKey, bodyBytes, 5*time.Minute)
	}
}

func buildCacheKey(path, rawQuery string) string {
	return fmt.Sprintf("gwcache:%s?%s", path, rawQuery)
}
