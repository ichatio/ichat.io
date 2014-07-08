package routes

import (
	"html/template"
	"net/http"

	"github.com/ichatio/ichat.io/config"
)

var Config = config.Config
var templates *template.Template

func init() {

	// Load all templates
	templates = template.Must(template.ParseGlob("views/*.tmpl"))

	//Static
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("assets/images"))))
	http.Handle("/javascripts/", http.StripPrefix("/javascripts/", http.FileServer(http.Dir("assets/javascripts"))))
	http.Handle("/stylesheets/", http.StripPrefix("/stylesheets/", http.FileServer(http.Dir("assets/stylesheets"))))

	//Routes
	http.HandleFunc("/", Index)

}
