var MyApp=angular.module('myapp', []);
//控制器
MyApp.controller('testCtrl', function ($scope) {
	$scope.test = "你是谁";
	$scope.show=function(){
		$scope.test = "你是谁1";
		console.log("ffffffff");
	};
});