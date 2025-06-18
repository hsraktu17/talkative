package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/rs/xid"

	"github.com/example/backend/internal/models"
)

func (s *Server) routes() {
	s.Router.HandleFunc("/api/signup", s.handleSignup).Methods("POST")
	s.Router.HandleFunc("/api/login", s.handleLogin).Methods("POST")

	auth := s.Router.NewRoute().Subrouter()
	auth.Use(s.authMiddleware)
	auth.HandleFunc("/api/profile", s.handleProfile).Methods("GET")
	auth.HandleFunc("/api/chats", s.handleGetChats).Methods("GET")
	auth.HandleFunc("/api/chats", s.handleCreateChat).Methods("POST")
	auth.HandleFunc("/api/chats/{id}/messages", s.handleGetMessages).Methods("GET")
	auth.HandleFunc("/api/chats/{id}/messages", s.handleSendMessage).Methods("POST")
	auth.HandleFunc("/ws", s.handleWS)
}

func (s *Server) handleSignup(w http.ResponseWriter, r *http.Request) {
	var u models.User
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if u.ID == "" {
		u.ID = xid.New().String()
	}
	u.LastSeen = time.Now()
	if err := s.DB.Create(&u).Error; err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"sub": u.ID})
	t, _ := token.SignedString(s.JWTSecret)
	json.NewEncoder(w).Encode(map[string]string{"token": t})
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	var creds models.User
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	var u models.User
	if err := s.DB.Where("email = ? AND password = ?", creds.Email, creds.Password).First(&u).Error; err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"sub": u.ID})
	t, _ := token.SignedString(s.JWTSecret)
	json.NewEncoder(w).Encode(map[string]string{"token": t})
}

func (s *Server) authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" {
			http.Error(w, "missing token", http.StatusUnauthorized)
			return
		}
		tokenStr := auth[len("Bearer "):]
		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			return s.JWTSecret, nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}
		claims := token.Claims.(jwt.MapClaims)
		r.Header.Set("X-User", claims["sub"].(string))
		next.ServeHTTP(w, r)
	})
}

func (s *Server) handleProfile(w http.ResponseWriter, r *http.Request) {
	id := r.Header.Get("X-User")
	var u models.User
	if err := s.DB.First(&u, "id = ?", id).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(u)
}

func (s *Server) handleGetChats(w http.ResponseWriter, r *http.Request) {
	id := r.Header.Get("X-User")
	var chats []models.Chat
	if err := s.DB.Where("user1_id = ? OR user2_id = ?", id, id).Find(&chats).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(chats)
}

func (s *Server) handleCreateChat(w http.ResponseWriter, r *http.Request) {
	id := r.Header.Get("X-User")
	var payload struct {
		PeerID string `json:"peer_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	c := models.Chat{ID: xid.New().String(), User1ID: id, User2ID: payload.PeerID, UpdatedAt: time.Now()}
	if err := s.DB.Create(&c).Error; err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(c)
}

func (s *Server) handleGetMessages(w http.ResponseWriter, r *http.Request) {
	chatID := mux.Vars(r)["id"]
	var msgs []models.Message
	if err := s.DB.Where("chat_id = ?", chatID).Order("created_at").Find(&msgs).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(msgs)
}

func (s *Server) handleSendMessage(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User")
	chatID := mux.Vars(r)["id"]
	var payload struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	m := models.Message{ID: xid.New().String(), ChatID: chatID, SenderID: userID, Content: payload.Content, Status: models.StatusSent, CreatedAt: time.Now()}
	if err := s.DB.Create(&m).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(m)
	for uid, conn := range s.Clients {
		if uid == userID {
			continue
		}
		conn.WriteJSON(m)
	}
}

func (s *Server) handleWS(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User")
	conn, err := s.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	s.Clients[userID] = conn
	defer func() {
		conn.Close()
		delete(s.Clients, userID)
	}()
	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			break
		}
	}
}
