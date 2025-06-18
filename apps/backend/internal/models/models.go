package models

import "time"

// MessageStatus represents message state.
type MessageStatus string

const (
	StatusSent MessageStatus = "sent"
	StatusRead MessageStatus = "read"
)

type User struct {
	ID          string    `gorm:"primaryKey" json:"id"`
	DisplayName string    `json:"display_name"`
	Email       string    `gorm:"unique" json:"email"`
	Password    string    `json:"password,omitempty"`
	AvatarURL   string    `json:"avatar_url"`
	LastSeen    time.Time `json:"last_seen"`
}

type Chat struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	User1ID   string    `json:"user1_id"`
	User2ID   string    `json:"user2_id"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Message struct {
	ID        string        `gorm:"primaryKey" json:"id"`
	ChatID    string        `json:"chat_id"`
	SenderID  string        `json:"sender_id"`
	Content   string        `json:"content"`
	Status    MessageStatus `gorm:"type:text" json:"status"`
	CreatedAt time.Time     `json:"created_at"`
}
