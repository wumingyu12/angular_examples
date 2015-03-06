var ani_app=angular.module('Ani_app', ['ui.router', 'ngAnimate']);
//==================路由配置====================================
ani_app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/state1");
    $stateProvider
        .state('state1', {
            url: "/state1",
            templateUrl: "state1.html",
            controller:'state1'
        })
        .state('state2', {
            url: "/state2",
            templateUrl: "state2.html",//别忘了逗号
            controller:'state2'
        });
});
//====================主控制器===================================
ani_app.controller('mainCtrl', ['$scope','$location','$http', function($scope,$location,$http){
	$scope.normalAnimation = '选择动画';//nomal动画的选项目
	$scope.outAnimation='选择退场动画';
	$scope.inAnimation='选择入场动画';
	//请求json数据
	$http.get('animate.json').success(
		function(data){ 
		$scope.normalAnimations=data.normalAnimations;
		$scope.outAnimations = data.outAnimations;
        $scope.inAnimations = data.inAnimations;
        $scope.toggleText = '开始';//单个动画的按钮提示
	});
	//得到进退场动画
    $scope.getClass = function(){
    	return $scope.inAnimation + ' ' + $scope.outAnimation;
	};
	//单个元素的动画
	$scope.getAnimate = function(){
	    var ary = [];
	    if($scope.toggleText === '结束'){
	        ary.push($scope.normalAnimation);
	        ary.push('animated');
	        ary.push('infinite');//这个类可以让动画不断重复否则就这会在加载时出现一次
	    }
	    return ary;
    }
    //单个元素动画的文字切换
    $scope.toggleAnimate = function(){
        if($scope.normalAnimation === '选择动画'){
            return;
        }
        if($scope.toggleText === '开始'){
            //$scope.infinite = true;
            $scope.toggleText = '结束';
        }else{
            //$scope.infinite = false;
            $scope.toggleText = '开始';
        }
    };
	//web路由状态切换函数
	$scope.toggleState = function(){
		if($scope.inAnimation === '选择入场动画' || $scope.outAnimation === '选择离场动画'){
            return;
        }
        if($location.path() == '/state1'){
            $location.path('/state2');//用$location改变地址
        }else{
            $location.path('/state1');
        }
    };


}]);
//================================其他控制器=========================
ani_app.controller('state1', ['$scope', function($scope){

}]);
ani_app.controller('state2',['$scope',function($scope){ 

}]);
