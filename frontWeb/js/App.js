var myApp = angular.module('MyApp', ['ui.router','ngAnimate']);//[]里可以注入模块
myApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/state1");
    $stateProvider
        .state('state1', {
            url: "/state1",
            templateUrl: "tpls/state1.html"
        })
        .state('state1.list', {
            url: "/list",
            templateUrl: "tpls/state1.list.html",
            controller: function($scope) {
                $scope.items = ["A", "List", "Of", "Items"];
            }
        })
        .state('state2', {
            url: "/state2",
            templateUrl: "tpls/state2.html"
        })
        .state('state2.list', {
            url: "/list",
            templateUrl: "tpls/state2.list.html",
            controller: function($scope) {
                $scope.things = ["A", "Set", "Of", "Things"];
            }
        })
        .state('state3',{
            url: "/state3",
            templateUrl: "tpls/state3.html"
        })
		.state('state4',{
			url:"/state4",
			templateUrl:"tpls/state4.html"
		});
});

