package main

import (
	"fmt"
	"gateway/internal/config"
	"gateway/internal/handlers"
	"gateway/internal/redis"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type application struct {
	appConfig config.AppConfig
	deps      *config.Deps
}

func Application(cfg config.AppConfig) *application {

	redisClient := redis.NewRedisClient()
	fmt.Println("Redis client is ready:", redisClient)

	depsStruct := &config.Deps{
		RedisClient: redisClient,
	}

	return &application{
		appConfig: cfg,
		deps:      depsStruct,
	}
}

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/gateway/v1", func(r chi.Router) {
		r.Get("/health", app.healthCheckHandler)

		// Static-data API endpoints with caching.
		r.HandleFunc("/static/transactions", handlers.ForwardHTTPRequestWithCache(app.deps))
		r.HandleFunc("/static/transactions/filters", handlers.ForwardHTTPRequestWithCache(app.deps))
		r.HandleFunc("/static/transactions/dates", handlers.ForwardHTTPRequestWithCache(app.deps))
		r.HandleFunc("/static/transactions/{id}", handlers.ForwardHTTPRequestWithCache(app.deps))
		r.HandleFunc("/static/transactions/archive", handlers.ForwardHTTPRequestWithCache(app.deps))

		// Static-data API endpoints without caching.
		r.Get("/static/transactions/count", handlers.ForwardHTTPRequestNoCache())

		// Live-data WS connection.
		r.HandleFunc("/live", handlers.ForwardWSConnection)
	})

	return r
}

func (app *application) run(mux http.Handler) error {
	srv := &http.Server{
		Addr:         app.appConfig.Port,
		Handler:      mux,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute,
	}

	fmt.Printf("Server has started at port %s\n", app.appConfig.Port)
	return srv.ListenAndServe()
}
