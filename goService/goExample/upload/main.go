// fileUpload project main.go
package main

import (
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
)

var buf []byte

func upload(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	if r.Method == "GET" {
		t, err := template.ParseFiles("index.html")
		checkErr(err)
		t.Execute(w, nil)
	} else {
		//f1, _ := os.Create("widuu_2.go")
		//defer f1.Close()
		file, handle, err := r.FormFile("file")
		checkErr(err)
		//注意了下面的创建函数不会递归创建的如没有test文件夹他不会创建
		f, err := os.OpenFile("./test/"+handle.Filename, os.O_WRONLY|os.O_CREATE, 0666)
		io.Copy(f, file)
		checkErr(err)
		defer f.Close()
		defer file.Close()
		fmt.Println("upload success")
	}
}

func checkErr(err error) {
	if err != nil {
		err.Error()
	}
}

func main() {
	http.HandleFunc("/upload", upload)
	err := http.ListenAndServe(":8888", nil)
	if err != nil {
		log.Fatal("listenAndServe: ", err)
	}
}
