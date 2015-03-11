var MyApp=angular.module('myapp', []);
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
	$scope.setShow=function(){
		ue.setShow();
		console.log("显示编辑界面");
	};
});