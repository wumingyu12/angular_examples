//===============================websockt======================
//代表了在线用户的路由控制器
//=======================================================
package onlineUser

import (
	"fmt"
	"github.com/gorilla/mux" //路由库
	"net/http"
)

//================restful在线用户==========================
//=========================================================
//restful服务，在线用户列表,通过id
func GetOnlineUserById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r) //r为*http.Request
	userId := vars["id"]
	fmt.Println(userId)
	fmt.Fprintf(w, userId) //向浏览器发送json或者字符串，这里是变量
}

//rstful服务，得到所有在线用户
func GetOnlineUsers(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "all")
	fmt.Println("all")
}
