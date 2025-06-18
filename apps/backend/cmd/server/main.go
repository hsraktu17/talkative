package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	_ "github.com/lib/pq"
)

var jwtSecret = []byte(getEnv("JWT_SECRET", "secret"))

// In-memory stores for demo purposes
var (
	usersMu sync.Mutex
	users   = map[string]User{}

	chatsMu sync.Mutex
	chats   = map[string]Chat{}

	messagesMu sync.Mutex
	messages   = map[string][]Message{}

	connsMu sync.Mutex
	conns   = map[string]*websocket.Conn{}
)

type User struct {
	ID           string `json:"id"`
	Email        string `json:"email"`
	PasswordHash string `json:"-"`
	DisplayName  string `json:"display_name"`
}

type Chat struct {
	ID      string `json:"id"`
	User1ID string `json:"user1_id"`
	User2ID string `json:"user2_id"`
}

type Message struct {
	ID        string    `json:"id"`
	ChatID    string    `json:"chat_id"`
	SenderID  string    `json:"sender_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/signup", signUpHandler).Methods("POST")
	r.HandleFunc("/login", loginHandler).Methods("POST")

	api := r.PathPrefix("/api").Subrouter()
	api.Use(authMiddleware)
	api.HandleFunc("/chats", listChatsHandler).Methods("GET")
	api.HandleFunc("/chats", createChatHandler).Methods("POST")
	api.HandleFunc("/chats/{id}/messages", listMessagesHandler).Methods("GET")
	api.HandleFunc("/chats/{id}/messages", postMessageHandler).Methods("POST")
	api.HandleFunc("/ws", wsHandler)

	addr := getEnv("ADDR", ":8080")
	log.Printf("Server listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, r))
}

func signUpHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email       string `json:"email"`
		Password    string `json:"password"`
		DisplayName string `json:"display_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	id := randomID()
	usersMu.Lock()
	users[id] = User{ID: id, Email: req.Email, PasswordHash: req.Password, DisplayName: req.DisplayName}
	usersMu.Unlock()
	token, _ := createToken(id)
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	usersMu.Lock()
	defer usersMu.Unlock()
	for id, u := range users {
		if u.Email == req.Email && u.PasswordHash == req.Password {
			token, _ := createToken(id)
			json.NewEncoder(w).Encode(map[string]string{"token": token})
			return
		}
	}
	http.Error(w, "invalid credentials", http.StatusUnauthorized)
}

func listChatsHandler(w http.ResponseWriter, r *http.Request) {
	uid := r.Context().Value("uid").(string)
	chatsMu.Lock()
	defer chatsMu.Unlock()
	var list []Chat
	for _, c := range chats {
		if c.User1ID == uid || c.User2ID == uid {
			list = append(list, c)
		}
	}
	json.NewEncoder(w).Encode(list)
}

func createChatHandler(w http.ResponseWriter, r *http.Request) {
	uid := r.Context().Value("uid").(string)
	var req struct {
		PeerID string `json:"peer_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	id := randomID()
	chat := Chat{ID: id, User1ID: uid, User2ID: req.PeerID}
	chatsMu.Lock()
	chats[id] = chat
	chatsMu.Unlock()
	json.NewEncoder(w).Encode(chat)
}

func listMessagesHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	messagesMu.Lock()
	msgs := messages[id]
	messagesMu.Unlock()
	json.NewEncoder(w).Encode(msgs)
}

func postMessageHandler(w http.ResponseWriter, r *http.Request) {
	uid := r.Context().Value("uid").(string)
	vars := mux.Vars(r)
	chatID := vars["id"]
	var req struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	msg := Message{ID: randomID(), ChatID: chatID, SenderID: uid, Content: req.Content, CreatedAt: time.Now()}
	messagesMu.Lock()
	messages[chatID] = append(messages[chatID], msg)
	messagesMu.Unlock()
	broadcastMessage(msg)
	json.NewEncoder(w).Encode(msg)
}

var upgrader = websocket.Upgrader{}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	uid := r.Context().Value("uid").(string)
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	connsMu.Lock()
	conns[uid] = c
	connsMu.Unlock()
	broadcastPresence(uid, true)
	for {
		if _, _, err := c.NextReader(); err != nil {
			break
		}
	}
	connsMu.Lock()
	delete(conns, uid)
	connsMu.Unlock()
	broadcastPresence(uid, false)
	c.Close()
}

func broadcastMessage(msg Message) {
	data, _ := json.Marshal(struct {
		Type string  `json:"type"`
		Msg  Message `json:"message"`
	}{"message", msg})
	connsMu.Lock()
	defer connsMu.Unlock()
	for _, c := range conns {
		c.WriteMessage(websocket.TextMessage, data)
	}
}

func broadcastPresence(uid string, online bool) {
	data, _ := json.Marshal(struct {
		Type   string `json:"type"`
		UserID string `json:"user_id"`
		Online bool   `json:"online"`
	}{"presence", uid, online})
	connsMu.Lock()
	defer connsMu.Unlock()
	for _, c := range conns {
		c.WriteMessage(websocket.TextMessage, data)
	}
}

func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenStr := r.Header.Get("Authorization")
		if tokenStr == "" {
			http.Error(w, "missing auth", http.StatusUnauthorized)
			return
		}
		tokenStr = tokenStr[len("Bearer "):] // assume Bearer
		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) { return jwtSecret, nil })
		if err != nil || !token.Valid {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "invalid claims", http.StatusUnauthorized)
			return
		}
		uid, ok := claims["uid"].(string)
		if !ok {
			http.Error(w, "invalid claims", http.StatusUnauthorized)
			return
		}
		ctx := r.Context()
		ctx = contextWithUID(ctx, uid)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

type ctxKey string

func contextWithUID(ctx context.Context, uid string) context.Context {
	return context.WithValue(ctx, ctxKey("uid"), uid)
}

func getEnv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

func createToken(uid string) (string, error) {
	claims := jwt.MapClaims{"uid": uid, "exp": time.Now().Add(24 * time.Hour).Unix()}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func randomID() string {
	return strings.ReplaceAll(uuid.New().String(), "-", "")
}
