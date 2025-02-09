package handlers

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

const StaticServiceURL = "http://static-data:8080/" // Replace with your static-data service URL

func ForwardHTTPRequest(w http.ResponseWriter, r *http.Request) {
	// Strip "/gateway/static" from the path
	backendPath := strings.TrimPrefix(r.URL.Path, "/gateway/static")
	if backendPath == r.URL.Path {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}

	targetURL, err := url.Parse(StaticServiceURL + backendPath)
	if err != nil {
		http.Error(w, "Failed to parse URL", http.StatusInternalServerError)
		return
	}
	targetURL.RawQuery = r.URL.RawQuery 

	fmt.Printf("Forwarding request to: %s\n", targetURL.String())

	req, err := http.NewRequest(r.Method, targetURL.String(), r.Body)
	if err != nil {
		http.Error(w, "Failed to create request", http.StatusInternalServerError)
		return
	}
	req.Header = r.Header 

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		http.Error(w, "Failed to forward request", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}