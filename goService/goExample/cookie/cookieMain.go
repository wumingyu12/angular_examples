package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

func DrawMenu(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "text/html")
	io.WriteString(w, "<meta charset='utf-8'>"+"\n")
	io.WriteString(w, "<h1>先write再read<h1>"+"\n")
	io.WriteString(w, "<a href='/'>HOME <ba><br/>"+"\n")
	io.WriteString(w, "<a href='/readcookie'>Read Cookie <ba><br/>"+"\n")
	io.WriteString(w, "<a href='/writecookie'>Write Cookie <ba><br/>"+"\n")
	io.WriteString(w, "<a href='/deletecookie'>Delete Cookie <ba><br/>"+"\n")

}

func IndexServer(w http.ResponseWriter, req *http.Request) {
	// draw menu
	DrawMenu(w)
}

//从浏览器的head的地方读回那个cookie
func ReadCookieServer(w http.ResponseWriter, req *http.Request) {

	// draw menu
	DrawMenu(w)

	// read cookie
	var cookie, err = req.Cookie("testcookiename")
	if err == nil {
		var cookievalue = cookie.Value
		io.WriteString(w, "<b>get cookie value is "+cookievalue+"</b>\n")
	}

}

//申请完之后每次请求都会有一个cookie属性在head的地方
func WriteCookieServer(w http.ResponseWriter, req *http.Request) {
	// set cookies.
	expire := time.Now().AddDate(0, 0, 1)
	cookie := http.Cookie{Name: "testcookiename", Value: "testcookievalue", Path: "/", Expires: expire, MaxAge: 86400}
	//expires= Wednesday, 19-OCT-05 23:12:40 GMT 指定cookie 失效的时间。
	//如果没有指定失效时间，这个cookie 就不会被写入计算机的硬盘上，并且只持续到这次会话结束。

	//path=/foo 控制哪些访问能够触发cookie 的发送。如果没有指定path，
	//cookie 会在所有对此站点的HTTP 传送时发送。如果path=/directory，
	//只有访问/directory 下面的网页时，cookie才被发送。在这个例子中，
	//用户在访问目录/foo下的内容时，浏览器将发送此cookie。如果指定了path，
	//但是path与当前访问的url不符，则此cookie将被忽略。

	http.SetCookie(w, &cookie)

	//
	// we can not set cookie after writing something to ResponseWriter
	// if so ,we cannot set cookie succefully.
	//
	// so we have draw menu after set cookie
	DrawMenu(w)

}

func DeleteCookieServer(w http.ResponseWriter, req *http.Request) {

	// set cookies.
	cookie := http.Cookie{Name: "testcookiename", Path: "/", MaxAge: -1}
	http.SetCookie(w, &cookie)

	// ABOUT MaxAge
	// MaxAge=0 means no 'Max-Age' attribute specified.
	// MaxAge<0 means delete cookie now, equivalently 'Max-Age: 0'
	// MaxAge>0 means Max-Age attribute present and given in seconds

	// draw menu
	DrawMenu(w)

}

func main() {

	http.HandleFunc("/", IndexServer)
	http.HandleFunc("/readcookie", ReadCookieServer)
	http.HandleFunc("/writecookie", WriteCookieServer)
	http.HandleFunc("/deletecookie", DeleteCookieServer)

	fmt.Println("listen on 3000")
	err := http.ListenAndServe(":3000", nil)

	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
