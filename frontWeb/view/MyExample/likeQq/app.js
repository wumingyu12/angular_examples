var MyApp=angular.module('myapp', ['ngSanitize','ngResource']);//ngSanitize指令ng-blind-html,ngResource提供resetful服务
//restful服务
MyApp.factory('ReOnlineUsers',['$resource',function($resource){ 
	return $resource('/restful/onlineUsers/:userId',//相对地址的不加第一个/
		{userId:"all"}//在query方法下也会请求restful/onlineUsers/all
	);
}]);
//控制器

//左侧好友列表控制器
MyApp.controller('userListCtrl',['$scope','ReOnlineUsers',function ($scope,ReOnlineUsers) {
	//好友列表，get   /restful/onlineUsers/all
	$scope.userList=ReOnlineUsers.get({userId:"all"},function(userList){//成功时的回调函数,还可以跟一个失败时候的回调
		console.log("app.js 46行好友列表获取成功")
		console.log(userList);
	});
}]);


//指令，当div改变时，滚动条到最底部,通过对指令赋值监测此值的变化
MyApp.directive('scrollToBottom', function(){
    return {
        restrict: 'A',
        scope: {
            trigger: '=scrollToBottom'
        },
        link: function postLink(scope, elem) {//elem为jquery对象
            scope.$watch('trigger', function() {
                //elem[0].scrollTop = 0;
                elem[0].scrollTop=elem[0].scrollHeight;
            });
        }
    };
});
//过滤器，可以让ng-blind-html可以绑定带style的html
MyApp.filter('to_trusted', ['$sce', function ($sce) {
	return function (text) {
		return $sce.trustAsHtml(text);
	};
}]);
//控制器
MyApp.controller('ueCtrl', function ($scope) {
	$scope.msgs='<p><span style="color: rgb(141, 179, 226);">方芳芳</span><br/></p>';
	$scope.msgCount=0;//
	$scope.setShow=function(){
		ue.setShow();//引用了外部的全局变量
		console.log("显示编辑界面");
	};

	$scope.sendMsg=function(){
		$scope.msgs=$scope.msgs+'\
		<h5 style="padding:0px;margin:0px 0px 0px 10px;">我：</h5>\
		<div class="well" style="padding:2px;margin:5px 0px 10px 30px;background-color:rgb(200,200,230);\
		    width:auto; display:inline-block !important;">\
        	'+ue.getContent()+'\
        </div>';//引用了外部的全局变量
		//console.log($scope.hasNewDiv);
		$scope.msgCount=$scope.msgCount+1;

		$scope.msgs=$scope.msgs+'\
		<div class="text-right">\
			<h5 style="padding:0px;margin:0px 0px 0px 10px;">机器人：</h5>\
			<div class="well" style="padding:2px;margin:5px 30px 10px 30px;background-color:rgb(100,180,230);\
		        width:auto; display:inline-block !important;">\
        	    '+ue.getContent()+'\
            </div>\
        </div>';//引用了外部的全局变量
	};
});
