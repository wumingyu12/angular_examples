var ani_app=angular.module('Ani_app', ['ui.router', 'ngAnimate']);
//路由配置
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
//主控制器
ani_app.controller('mainCtrl', ['$scope','$location', function($scope,$location){
	$scope.toggleState = function(){
        if($location.path() == '/state1'){
            $location.path('/state2');//用$location改变地址
        }else{
            $location.path('/state1');
        }
    };
}]);
//控制器
ani_app.controller('state1', ['$scope', function($scope){

}]);
ani_app.controller('state2',['$scope',function($scope){ 

}]);
