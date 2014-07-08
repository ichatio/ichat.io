package routes

import (
	"net/http"
	"strings"
)

type Channel struct {
	Title       string
	Joinchannel string
}

func Index(w http.ResponseWriter, r *http.Request) {
	joinchannel := Config.IRC.Channel

	if strings.Contains(joinchannel, "#") == false {
		joinchannel = "#" + joinchannel[:]
	}

	channel := &Channel{
		Title:       joinchannel + " ichat.io",
		Joinchannel: joinchannel,
	}

	err := templates.ExecuteTemplate(w, "index", channel)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}
