package config

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type Configuration struct {
	Server struct {
		Host   string
		Port   int
		Views  string
		Static string
	}
	IRC struct {
		Server  string
		Port    int
		Channel string
	}
}

var Config Configuration

func init() {
	fmt.Println("Config.Init()")

	file, err := ioutil.ReadFile("config/config.json")
	if err != nil {
		fmt.Printf("File error: %v\n", err)
		os.Exit(1)
	}

	json.Unmarshal(file, &Config)
}
