package main

import (
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strconv" //字符串转换包
)

var messages chan string = make(chan string, 100)

var counter = 0

func PushHandler(w http.ResponseWriter, req *http.Request) {

	Body, err := ioutil.ReadAll(req.Body)

	if err != nil {
		w.WriteHeader(400)
	}
	fmt.Println(string(Body))
	counter += 1
	messages <- strconv.Itoa(counter) //数字转字符串
}

func PollResponse(w http.ResponseWriter, req *http.Request) {

	io.WriteString(w, <-messages)
}

func Indexhandler(w http.ResponseWriter, req *http.Request) {
	t, err := template.ParseFiles("index.html")
	if err != nil {
		fmt.Println(err)
	}
	t.Execute(w, nil)
}

func main() {
	//http.Handle("/", http.FileServer(http.Dir("./")))
	http.HandleFunc("/", Indexhandler)
	http.HandleFunc("/poll", PollResponse) //阻塞长轮询
	http.HandleFunc("/push", PushHandler)
	fmt.Println("监听8005端口")
	err := http.ListenAndServe(":8005", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

}
