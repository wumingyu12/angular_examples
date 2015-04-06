package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	// METHOD 1
	logs := make(chan string)
	//http请求里面写入通道，这个线程里面无限迭代取出
	go logLogs(logs) //每次的请求127.0.0.1/1都会打印出信息通过通道
	handleHello := makeHello(logs)

	// METHOD 2
	passer := &DataPasser{logs: make(chan string)}
	go passer.log()
	fmt.Println("监听9999端口")
	http.HandleFunc("/1", handleHello)
	http.HandleFunc("/2", passer.handleHello)
	http.ListenAndServe(":9999", nil)
}

// METHOD 1
//函数返回，用通道返回一个hander
func makeHello(logger chan string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		logger <- r.URL.Path
		io.WriteString(w, "Hello world!")
	}
}

func logLogs(logger chan string) {
	//在这里用range是没有index，key：=range的方式，原因在于是chan
	for item := range logger { //注意如果没有用close（chan）关闭，那么这个迭代是会一直进行的
		fmt.Println("1. Item", item)
	}
}

// METHOD 2

type DataPasser struct {
	logs chan string
}

func (p *DataPasser) handleHello(w http.ResponseWriter, r *http.Request) {
	p.logs <- r.URL.String()
	io.WriteString(w, "Hello world")
}

func (p *DataPasser) log() {
	for item := range p.logs {
		fmt.Println("2. Item", item)
	}
}
