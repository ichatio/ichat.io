package routes

import (
	"net/http"

	"github.com/ichatio/ichat.io/config"
)

var Config = config.Config

func init() {
	http.HandleFunc("/", Index)

}
