package main

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/boltdb/bolt"
)

func getOrSetKey() error {
	db, err := bolt.Open("my.db", 0600, nil)
	if err != nil {
		return errors.New("error opening database")
	}
	defer db.Close()

	// Create the bucket if it doesn't exist
	err = db.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte("MyBucket"))
		if err != nil {
			return errors.New("error creating database bucket")
		}
		return nil
	})
	if err != nil {
		return err
	}

	var apiKey string
	db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("MyBucket"))
		bytes := b.Get([]byte("OPENAI_API_KEY"))
		apiKey = string(bytes)
		return nil
	})

	if apiKey == "" {
		reader := bufio.NewReader(os.Stdin)
		fmt.Print("Enter OpenAI API Key: ")
		input, err := reader.ReadString('\n')
		if err != nil {
			return errors.New("error reading input")
		}
		apiKey = strings.TrimSpace(input)
		err = db.Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte("MyBucket"))
			err = b.Put([]byte("OPENAI_API_KEY"), []byte(apiKey))
			if err != nil {
				return errors.New("error adding key to bucket")
			}
			return nil
		})
		if err != nil {
			return err
		}
	}
	err = os.Setenv("OPENAI_API_KEY", apiKey)
	if err != nil {
		return errors.New("error setting environment variable")
	}

	return nil
}

func deleteKey() error {
	db, err := bolt.Open("my.db", 0600, nil)
	if err != nil {
		return errors.New("error opening database")
	}
	defer db.Close()

	// Delete the key if it exists
	err = db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("MyBucket"))
		if b == nil {
			// Return nil becuase if bucket doesnt exist, key doesnt exist
			return nil
		}
		err := b.Delete([]byte("OPENAI_API_KEY"))
		if err != nil {
			return errors.New("error deleting key")
		}
		return nil
	})
	if err != nil {
		return err
	}

	return nil
}
