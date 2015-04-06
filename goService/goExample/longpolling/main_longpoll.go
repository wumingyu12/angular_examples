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

//
func PushHandler(w http.ResponseWriter, req *http.Request) {

	Body, err := ioutil.ReadAll(req.Body)

	if err != nil {
		w.WriteHeader(400)
	}
	fmt.Println(string(Body)) //hi
	counter += 1
	//for i := 0; i < 4; i++ {
	messages <- strconv.Itoa(counter) //数字转字符串
	//}

}

//func func_name(wParam http.ResponseWriter, rParam *http.Request, chanParam <-chan string) {
//	fmt.Println("请求长poll")
//	io.WriteString(wParam, <-chanParam)
//	fmt.Println("关闭长poll")
//}

func PollResponse(w http.ResponseWriter, req *http.Request) {
	//给每一个请求开启线程
	//go func_name(w, req, messages)
	fmt.Println("请求长poll")
	//开启多个网页时会卡(原因是多个页面push一个数后控制器按打开顺序各一个连接发送了，另一些连接就收不了)
	io.WriteString(w, <-messages)
	fmt.Println("关闭长poll")

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
