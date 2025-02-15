package main

import (
	"fmt"
	"gateway/internal/config"
	"gateway/internal/handlers"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type application struct {
	appConfig config.AppConfig
}

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/gateway", func(r chi.Router) {
		r.Get("/health", app.healthCheckHandler)

		//static-data api
		r.HandleFunc("/static/transactions", handlers.ForwardHTTPRequest)
		r.HandleFunc("/static/transactions/filters", handlers.ForwardHTTPRequest)
		r.HandleFunc("/static/transactions/dates", handlers.ForwardHTTPRequest)
		r.HandleFunc("/static/transactions/{id}", handlers.ForwardHTTPRequest)

		//live-data ws connection
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

	fmt.Printf("Server has started at port%s \n", app.appConfig.Port)

	return srv.ListenAndServe()
}
