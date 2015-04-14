package main

import (
	"./goService/handlers/onlineUser" //控制器关于在线用户的restful
	//"code.google.com/p/go.net/websocket"
	"fmt"
	"html/template"
	"log"
	//"net"
	"net/http"
	//"strings"
	"github.com/gorilla/mux" //路由库
)

//func IndexHandler(w http.ResponseWriter, r *http.Request) {
//获取本地的ip，这个方法需要联网，局域网的方法看笔记
//conn, err := net.Dial("udp", "baidu.com:80") //对百度进行拨号
//if err != nil {
//	fmt.Println("main.go 18行====不能联网得到本机IP", err)
//	fmt.Println(err.Error())
//	return
//}
//Ip := strings.Split(conn.LocalAddr().String(), ":")[0]
//conn.Close() //用完后要关闭要不会卡这
//======获取ip完成========

//对模版字段进行赋值
//fmt.Println("运行了IndexHandler")
//TemDate := make(map[string]string)
//TemDate["ServerIp"] = Ip

//if r.Method == "GET" { //代表第一次打开页面
//	t, _ := template.ParseFiles("frontWeb/index.html") //使用这下面的模版
//	t.Execute(w, nil)
//} else { //如果是其他方法
//请求的是登录数据，那么执行登录的逻辑判断
//r.ParseForm()
//	fmt.Println("method:", r.Method)
//fmt.Println("password:", r.Form["password"])
//}
//fmt.Println("结束了IndexHandler")
//}

//========模版数据=============

//===========================
//===404.html============
//=====================
func NotFoundHandler(w http.ResponseWriter, r *http.Request) { //如果路由规则不符合没有注册的如/2333,/22ww等
	if r.URL.Path == "/" {
		http.Redirect(w, r, "/view/index.html", http.StatusFound) //地址重定向
	}

	t, err := template.ParseFiles("frontWeb/view/static/404/404.html")
	if err != nil {
		fmt.Println(err)
	}
	t.Execute(w, nil)
}

//================================================================

func main() {
	http.Handle("/view/", http.FileServer(http.Dir("frontWeb")))
	//view/xxx/xxx的文件在frontweb里面找
	http.Handle("/frame/", http.FileServer(http.Dir("frontWeb")))
	http.Handle("/my_css/", http.FileServer(http.Dir("frontWeb")))
	http.Handle("/js/", http.FileServer(http.Dir("frontWeb")))
	//这里的handle当一个连接过来的时候都会多开一个wshandler
	//http.Handle("/ws", websocket.Handler(wshandler.WsHandler)) //响应了ws://127.0.0.1/ws的websocket

	//http.HandleFunc("/index", IndexHandler) //不用这个带控制器的路由导致带angular的index无法正常加载
	//http.HandleFunc("/login", login)

	mux_router := mux.NewRouter() //用mux库做路由
	mux_router.HandleFunc("/", NotFoundHandler)
	//仿qq聊天的restful
	onlineUser.SessionManagerInit()                                                                 //初始化Session管理器
	mux_router.HandleFunc("/restful/onlineUsers/{id}", onlineUser.GetOnlineUserById).Methods("GET") //得到在线用户的列表
	//注意/restful/onlineUsers/与/restful/onlineUsers的区别，前一个会响应/restful/onlineUsers/123等请求后面的不会
	mux_router.HandleFunc("/restful/onlineUsers/", onlineUser.AddOnlineUser).Methods("POST")
	mux_router.HandleFunc("/restful/addNewMsg", onlineUser.AddNewMsg).Methods("POST")
	//页面退出时的发送的restful /restful/addNewMsg
	//mux_router.HandleFunc("/restful/onlineUsers/{name}", onlineUser.DeleteOnlineUser).Methods("DELETE")
	http.Handle("/", mux_router) //这一句别忘了 否则前面的mux_router是不作用的
	fmt.Println("正在监听2222端口,main.go")
	//http.HandleFunc("/", NotFoundHandler) //当没有找到路径名字时，后面改为用mux库了
	err1 := http.ListenAndServe(":2222", nil)
	if err1 != nil {
		log.Fatal("ListenAndServe:", err1)
	}
}
