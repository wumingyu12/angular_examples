var MyApp=angular.module('myapp', []);
//控制器
MyApp.controller('fatherCtrl', function ($scope) {
	$scope.testValue = 1;
	$scope.add=function(){
		$scope.testValue=$scope.testValue+1;
	};
});

MyApp.controller('childrenCtrl', function ($scope) {
	$scope.add=function(){
		$scope.testValue=$scope.testValue+1;
	};
});

//用对象的方式使父子控制器的值统一
MyApp.controller('fatherCtrlObj', function ($scope) {
	$scope.obj = {testValue:1};
	$scope.add=function(){
		$scope.obj.testValue=$scope.obj.testValue+1;
	};
});

MyApp.controller('childrenCtrlObj', function ($scope) {
	$scope.add=function(){
		$scope.obj.testValue=$scope.obj.testValue+1;
	};
});

//用服务的方式来通信，两个控制器之间没有同步显示
MyApp.factory('instance', function(){
    return {
    	testValue:10,
    	testValue1:11
    };
});
MyApp.controller('Ctrl1', function($scope, instance) {
	$scope.testValue=instance.testValue;
	$scope.testValue1=instance.testValue1;
  	$scope.add = function() {
       instance.testValue = instance.testValue+1;
       $scope.testValue=instance.testValue;
  	};
});
MyApp.controller('Ctrl2', function($scope, instance) {
	$scope.testValue1=instance.testValue1;
	$scope.testValue=instance.testValue;
    $scope.add = function() {
       instance.testValue = instance.testValue+1;
       $scope.testValue=instance.testValue;
    };
});

//用全局变量的方式来通信，有3种全局变量的定义方式
var test2=1;//方法1原生js的var定义变量
MyApp.value('test',{"test":"test222","test1":"test111"});  //方法2 ng value定义全局变量 
MyApp.constant('constanttest', 'this is constanttest');    //方法3 ng constant定义全局变量

MyApp.controller('CtrlGb', ['$scope','test','constanttest',  
  function($scope,test,constanttest) {  
    $scope.test = test;                   //方法2，将全局变量赋值给$scope.test  
    $scope.constanttest = constanttest;   //方法3，赋值  
    $scope.test2 = test2;                 //方法1，赋值  
  }]);  