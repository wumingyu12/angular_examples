//===============================websockt======================
//代表了在线用户的路由控制器
//=======================================================
package onlineUser

import (
	"./session"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux" //路由库
	"io/ioutil"              //用来读取post中的body
	"log"
	"net/http"
	"os"
)

//================json=================

//type ColorGroup struct { //字段名要大写要不会给json解释到
//	ID     int
//	Name   string
//	Colors []string
//}

//var group *ColorGroup = &ColorGroup{
//	ID:     1,
//	Name:   "Reds",
//	Colors: []string{"Crimson", "Red", "Ruby", "Maroon"},
//}

//一个聊天室结构体
type ChatRoom struct {
	IfOnline int //是否是在线聊天室
	//如果想json可以解释map就要用map[string]，不能用map[int]
	OnlineUsers map[string]*OnlineUser //在线用户的map用OnlineUsers[1]指代
}

//在线用户的结构体
type OnlineUser struct {
	Name    string
	Id      int
	HeadImg string //头像图标的地址
}

//实例化一个聊天室
var chatRoom *ChatRoom = &ChatRoom{
	//在线
	IfOnline:    1,
	OnlineUsers: make(map[string]*OnlineUser),
}

var logger = log.New(os.Stdout, "", log.Ldate|log.Ltime)

//实例化一个session管理器
var mySessionManager *session.SessionManager

//session 管理器的初始化,方法要大写
func SessionManagerInit() {
	mySessionManager = session.NewSessionManager(logger)
	logger.Println("session管理器创建成功，onlineUser_main.go")
}

//================restful在线用户==========================
//=========================================================
//restful服务，在线用户列表,通过id,心跳包，用心跳包监测在线用户
func GetOnlineUserById(w http.ResponseWriter, r *http.Request) {
	//虚拟的用户
	user1 := &OnlineUser{
		Name: "伍明煜",
		Id:   1,
	}
	user2 := &OnlineUser{
		Name: "伍明",
		Id:   2,
	}
	//给聊天室添加成员
	chatRoom.OnlineUsers["1"] = user1
	chatRoom.OnlineUsers["2"] = user2

	//vars := mux.Vars(r) //r为*http.Request
	//userId := vars["id"]
	//fmt.Println(userId)
	fmt.Println(r.Host + r.RequestURI + "请求GetOnlineUserById")
	//fmt.Fprintf(w, userId) //向浏览器发送json或者字符串，这里是变量

	//json
	b, err := json.Marshal(chatRoom) //用这个函数时一定要确保字段名首位大写
	if err != nil {
		fmt.Println("onlineUser_main.go 69行 error:", err)
	}
	//给浏览器发送json
	fmt.Fprintf(w, string(b)) //必须要string,确保没发送其他了否则解释不了为json在angular
	//fmt.Println(string(b))
}

//添加用户，解释发回的用户json
func AddOnlineUser(w http.ResponseWriter, r *http.Request) {
	//解释json为结构体
	jsonResult, _ := ioutil.ReadAll(r.Body)
	r.Body.Close()
	//fmt.Printf("%s\n", jsonResult)
	newUser := &OnlineUser{}
	json.Unmarshal([]byte(jsonResult), newUser) //注意json字段要大写
	//fmt.Printf(user.HeadImg)
	//在聊天室里面添加新成员，以用户输入的name为key
	chatRoom.OnlineUsers[newUser.Name] = newUser
}

//页面退出或刷新时的函数，在聊天室中删除对应name的用户
func DeleteOnlineUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)  //r为*http.Request
	name := vars["name"] //从url获取要删除的name
	fmt.Println(r.Host + r.RequestURI + "请求DeleteOnlineUser删除用户")
	delete(chatRoom.OnlineUsers, name)
}
