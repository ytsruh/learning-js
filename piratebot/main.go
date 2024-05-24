package main

import (
	"bufio"
	"context"
	"flag"
	"fmt"
	"os"

	"github.com/henomis/lingoose/llm/openai"
	"github.com/henomis/lingoose/thread"
)

func main() {
	reset := flag.Bool("reset", false, "a bool")
	flag.Parse()
	if *reset {
		err := deleteKey()
		if err != nil {
			fmt.Println(err)
			fmt.Println("Error deleting key")
			os.Exit(1)
		}
		fmt.Println("API Key deleted successfully!")
		os.Exit(0)
	}

	fmt.Println("Welcome to Pirate Bot!")
	fmt.Println("-----------------------------")
	err := getOrSetKey()
	if err != nil {
		os.Exit(1)
	}

	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Enter text: ")
	text, err := reader.ReadString('\n')
	if err != nil {
		panic(err)
	}

	myThread := thread.New().AddMessages(
		thread.NewSystemMessage().AddContent(
			thread.NewTextContent("All replies must be supplied in pirate style speech"),
		),
		thread.NewUserMessage().AddContent(
			thread.NewTextContent(text),
		))

	err = openai.New().Generate(context.Background(), myThread)
	if err != nil {
		fmt.Println(err)
		fmt.Println("Error : Something went wrong. Please check your API key & account.")
		os.Exit(1)
	}

	fmt.Println("Pirate : " + myThread.LastMessage().Contents[0].AsString())
	os.Exit(0)
}
