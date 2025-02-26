package handlers

import (
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// ForwardHTTPRequestNoCache forwards the request to the static-data service
// without using any caching.
func ForwardHTTPRequestNoCache() http.HandlerFunc {
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

		// 3. Forward the request to the static-data service.
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

		// 4. Read the response body.
		bodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			http.Error(w, "Failed to read response", http.StatusBadGateway)
			return
		}

		// 5. Propagate the Snapshot-Time header.
		snapshotHeader := resp.Header.Get("Snapshot-Time")
		if snapshotHeader != "" {
			w.Header().Set("Snapshot-Time", snapshotHeader)
		} else if r.URL.Query().Get("snapshotTime") != "" {
			w.Header().Set("Snapshot-Time", r.URL.Query().Get("snapshotTime"))
		} else {
			snapshotTime := time.Now().Format("2006-01-02T15:04:05Z07:00")
			w.Header().Set("Snapshot-Time", snapshotTime)
		}

		// 6. Write the response back to the client.
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(resp.StatusCode)
		w.Write(bodyBytes)
	}
}
