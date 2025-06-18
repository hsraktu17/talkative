package api

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

// Server wraps application dependencies and handlers.
type Server struct {
	DB        *gorm.DB
	Router    *mux.Router
	Upgrader  websocket.Upgrader
	Clients   map[string]*websocket.Conn
	JWTSecret []byte
}

// New creates server with routes configured.
func New(db *gorm.DB, jwtSecret []byte) *Server {
	s := &Server{
		DB:        db,
		Router:    mux.NewRouter(),
		Upgrader:  websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }},
		Clients:   make(map[string]*websocket.Conn),
		JWTSecret: jwtSecret,
	}

	s.routes()
	return s
}

// Listen starts the HTTP server.
func (s *Server) Listen(addr string) error {
	log.Printf("backend listening on %s", addr)
	return http.ListenAndServe(addr, s.Router)
}
