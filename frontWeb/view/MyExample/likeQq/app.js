var MyApp=angular.module('myapp', ['ngSanitize']);//ngSanitize指令ng-blind-htmld
//控制器
MyApp.controller('testCtrl', function ($scope) {
	$scope.test = "你是谁";
	$scope.show=function(){
		$scope.test = "你是谁1";
		console.log("ffffffff");
	};
});

//控制器
MyApp.controller('ueCtrl', function ($scope) {
	$scope.msg="<h1>w我是谁</h1>";

	$scope.setShow=function(){
		ue.setShow();//引用了外部的全局变量
		console.log("显示编辑界面");
	};

	$scope.sendMsg=function(){
		$scope.msg=ue.getContent();//引用了外部的全局变量
		console.log("显示编辑界面");
	};
});
