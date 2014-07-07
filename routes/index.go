package routes

import (
	"html/template"
	"net/http"
	"strings"
)

func Index(w http.ResponseWriter, r *http.Request) {
	joinchannel := Config.IRC.Channel

	if strings.Contains(joinchannel, "#") == false {
		joinchannel = "#" + joinchannel[:]
	}

	tmpl := template.New("views/index.jade")
	err := tmpl.ExecuteTemplate(w, "views/index.jade", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
