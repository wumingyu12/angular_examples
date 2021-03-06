//===============================websockt======================
//代表了在线用户的路由控制器
//=======================================================
package onlineUser

import (
	"./session"
	"encoding/json"
	"fmt"
	//"github.com/gorilla/mux" //路由库
	"io/ioutil" //用来读取post中的body
	"log"
	"net/http"
	"os"
	//"strconv" //字符串转换
	"time"
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
	UserNum       int //是否是在线用户
	CurrentMsgNum int //标识当前聊天室有多少条消息
	//如果想json可以解释map就要用map[string]，不能用map[int]
	OnlineUsers map[string]*OnlineUser //在线用户的map用OnlineUsers[1]指代
	//MsgBox      map[string]*NewMsg     //公共消息
	MsgList []*NewMsg
}

//在线用户的结构体
type OnlineUser struct {
	SessionId  string
	Name       string
	HeadImg    string //头像图标的地址
	SendMsgNum int    //每个用户发送的消息条数
}

//页面请求加入的消息
type NewMsg struct {
	SessionId string //哪个session发过来的
	Msg       string //发送过来的消息
	Name      string //发送该消息的用户名
	HeadImg   string //该用户的头像
	Time      string //发送消息的时间
}

//实例化一个聊天室
var chatRoom *ChatRoom = &ChatRoom{
	//在线
	UserNum:       0,
	CurrentMsgNum: 0, //一开始是0条消息
	OnlineUsers:   make(map[string]*OnlineUser),
	MsgList:       make([]*NewMsg, 0, 10), //指针数组,长度0，容量10
	//MsgBox:        make(map[string]*NewMsg),//无序的map会导致聊天数据在ng-repeat时错乱
}

var logger = log.New(os.Stdout, "", log.Ldate|log.Ltime)

//实例化一个session管理器
var mySessionManager *session.SessionManager

//session 管理器的初始化,方法要大写
func SessionManagerInit() {
	mySessionManager = session.NewSessionManager(logger)
	logger.Println("session管理器创建成功，onlineUser_main.go")
	mySessionManager.SetTimeout(30) //超时删除时间
	mySessionManager.SetPath("/")   //生效域名
	mySessionManager.OnStart(func(session *session.Session) {
		logger.Println("开始了一个新的session--ID:" + string(session.Id))
	})
	//定义超时或者关闭时的行为,在用户列表中删除session过期的用户
	mySessionManager.OnEnd(func(session *session.Session) {
		delete(chatRoom.OnlineUsers, session.Id)
		if chatRoom.UserNum > 0 {
			chatRoom.UserNum = chatRoom.UserNum - 1 //聊天室内用户数减1
		}
		logger.Println("过期---sessionID：" + string(session.Id))
	})
}

//================restful在线用户==========================
//=========================================================
//restful服务，在线用户列表,通过id,心跳包，用心跳包监测在线用户
func GetOnlineUserById(w http.ResponseWriter, r *http.Request) {
	session := mySessionManager.GetSession(w, r) //根据cookie新建或得到一个session
	logger.Println("发送心跳包--Id：" + string(session.Id))
	//虚拟的用户
	//user1 := &OnlineUser{
	//	Name: "伍明煜",
	//	Id:   1,
	//}
	//user2 := &OnlineUser{
	//	Name: "伍明",
	//	Id:   2,
	//}
	//给聊天室添加成员
	//chatRoom.OnlineUsers["1"] = user1
	//chatRoom.OnlineUsers["2"] = user2

	//vars := mux.Vars(r) //r为*http.Request
	//userId := vars["id"]
	//fmt.Println(userId)
	//fmt.Println(r.Host + r.RequestURI + "请求GetOnlineUserById")
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

//添加用户，解释发回的用户json,登录确定后发回的包
func AddOnlineUser(w http.ResponseWriter, r *http.Request) {
	session := mySessionManager.GetSession(w, r) //根据cookie新建或得到一个session
	//解释json为结构体
	jsonResult, _ := ioutil.ReadAll(r.Body)
	r.Body.Close()
	//fmt.Printf("%s\n", jsonResult)
	newUser := &OnlineUser{}
	//将json转化为struct，但json里面只有Name，和HeadImg属性，其他没有的属性值为0
	json.Unmarshal([]byte(jsonResult), newUser) //注意json字段要大写
	newUser.SessionId = session.Id
	session.Value = *newUser //将session保存的值设置为新加入的用户
	//在聊天室里面添加新成员，以用户输入的session为key
	chatRoom.OnlineUsers[newUser.SessionId] = newUser
	chatRoom.UserNum = chatRoom.UserNum + 1 //聊天室内用户数加1
}

//页面退出或刷新时的函数，在聊天室中删除对应name的用户
//func DeleteOnlineUser(w http.ResponseWriter, r *http.Request) {
//	vars := mux.Vars(r)  //r为*http.Request
//	name := vars["name"] //从url获取要删除的name
//	fmt.Println(r.Host + r.RequestURI + "请求DeleteOnlineUser删除用户")
//	delete(chatRoom.OnlineUsers, name)
//}

//添加新信息的请求
func AddNewMsg(w http.ResponseWriter, r *http.Request) {
	session := mySessionManager.GetSession(w, r)     //根据cookie新建或得到一个session
	chatRoom.OnlineUsers[session.Id].SendMsgNum += 1 //发送消息的用户自身消息数加1

	jsonResult, _ := ioutil.ReadAll(r.Body)
	r.Body.Close()
	newmsg := &NewMsg{}
	json.Unmarshal([]byte(jsonResult), newmsg) //注意json字段要大写
	//从session中取出值放到返回的msg中再放回聊天室中
	sessionValue, ok := session.Value.(OnlineUser) //ok代表接口内是否有这个类型
	if !ok {                                       //如果没有这个类型
		fmt.Println("onlineUser_main.go 169行错误接口转换。")
		return
	}
	newmsg.Name = sessionValue.Name
	newmsg.HeadImg = sessionValue.HeadImg
	//const layout = "Jan 2, 2006 at 3:04pm (MST)"
	const layout = "2006-01-02 15:04:05"
	newmsg.Time = time.Now().Format(layout) //奇葩的格式化方式
	//-----------------------
	chatRoom.CurrentMsgNum = chatRoom.CurrentMsgNum + 1 //聊天室消息数加1
	//msgNumStr := strconv.Itoa(chatRoom.CurrentMsgNum)   //int 转string
	//chatRoom.MsgBox[msgNumStr] = newmsg                 //给聊天室最新一条信息保存
	chatRoom.MsgList = append(chatRoom.MsgList, newmsg)
}
