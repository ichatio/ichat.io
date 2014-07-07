package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/ichatio/ichat.io/config"
	_ "github.com/ichatio/ichat.io/routes"
)

var Logger = log.New(os.Stdout, "", log.Ldate|log.Ltime)

func main() {
	addr := fmt.Sprintf("%s:%d", config.Config.Server.Host, config.Config.Server.Port)

	Logger.Printf("ichat.io server is listening on %s", addr)
	err := http.ListenAndServe(addr, nil)

	if err != nil {
		Logger.Print(err)
	}

}
