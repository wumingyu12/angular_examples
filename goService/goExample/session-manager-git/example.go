package main

import (
	"./seesion"
	"html/template"
	"log"
	"net/http"
	"os"
	"strings"
)

const page = `
<html>
<meta charset="utf-8"/>
<body>
{{if .Value}}.
Hi {{.Value}}.
<form method="post" action="/logout">
<input type="submit" name="method" value="logout" />
</form>
You will logout after 10 seconds. Then try to reload.
{{else}}
<form method="post" action="/login">
<label for="name">Name:</label>
<input type="text" id="name" name="name" value="" />
<input type="submit" name="method" value="login" />
</form>
{{end}}
</body>
</html>
`

var tmpl = template.Must(template.New("x").Parse(page))

func main() {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)
	manager := session.NewSessionManager(logger)
	//定义新建session时的行为
	manager.OnStart(func(session *session.Session) {
		println("started new session")
	})
	//定义超时或者关闭时的行为
	manager.OnEnd(func(session *session.Session) {
		println("abandon")
	})
	//超时事间
	manager.SetTimeout(10)

	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		session := manager.GetSession(w, req) //根据cookie新建或得到一个session
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		tmpl.Execute(w, session)
	}))
	http.Handle("/login", http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		name := strings.Trim(req.FormValue("name"), " ") //从form中得到name的值
		if name != "" {
			logger.Printf("User \"%s\" login", name)

			// XXX: set user own object.
			//这里得到的session和上面的session是一样的因为本质上是同一域名下的同一cookie
			manager.GetSession(w, req).Value = name //value 为interface可以放置任意变量
		}
		http.Redirect(w, req, "/", http.StatusFound) //页面跳转
	}))
	http.Handle("/logout", http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		if manager.GetSession(w, req).Value != nil {
			// XXX: get user own object.
			//Go语言里面有一个语法，可以直接判断是否是该类型的变量： value, ok = element.(T)，
			//这里value就是变量的值，ok是一个bool类型，element是interface变量，T是断言的类型。
			//element里面确实存储了T类型的数值，那么ok返回true，否则返回false。
			name := manager.GetSession(w, req).Value.(string) //value为空接口，string为断言
			logger.Printf("User \"%s\" logout", name)
			manager.GetSession(w, req).Abandon() //getsession 本质是根据cookie
		}
		http.Redirect(w, req, "/", http.StatusFound) //页面跳转
	}))
	logger.Printf("监听6061端口")
	err := http.ListenAndServe(":6061", nil)
	if err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
