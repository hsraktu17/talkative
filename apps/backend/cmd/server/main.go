package main

import (
	"os"

	"github.com/example/backend/internal/api"
	"github.com/example/backend/internal/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	if len(jwtSecret) == 0 {
		jwtSecret = []byte("secret")
	}
	db, err := gorm.Open(sqlite.Open("chat.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&models.User{}, &models.Chat{}, &models.Message{})

	srv := api.New(db, jwtSecret)
	if err := srv.Listen(":8080"); err != nil {
		panic(err)
	}
}
