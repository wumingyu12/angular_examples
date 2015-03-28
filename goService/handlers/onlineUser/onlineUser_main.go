//===============================websockt======================
//代表了在线用户的路由控制器
//=======================================================
package onlineUser

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux" //路由库
	"net/http"
)

//================json=================

type ColorGroup struct { //字段名要大写要不会给json解释到
	ID     int
	Name   string
	Colors []string
}

var group *ColorGroup = &ColorGroup{
	ID:     1,
	Name:   "Reds",
	Colors: []string{"Crimson", "Red", "Ruby", "Maroon"},
}

//================restful在线用户==========================
//=========================================================
//restful服务，在线用户列表,通过id
func GetOnlineUserById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r) //r为*http.Request
	userId := vars["id"]
	fmt.Println(userId)
	//fmt.Fprintf(w, userId) //向浏览器发送json或者字符串，这里是变量

	//json
	b, err := json.Marshal(group)
	if err != nil {
		fmt.Println("error:", err)
	}
	fmt.Fprintf(w, string(b)) //必须要string,确保没发送其他了否则解释不了为json在angular
	fmt.Println(string(b))
}
