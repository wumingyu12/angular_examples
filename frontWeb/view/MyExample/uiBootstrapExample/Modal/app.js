var MyApp=angular.module('myapp', ['ui.bootstrap']);
//控制器
MyApp.controller('ModalDemoCtrl',[
	'$scope',
	'$modal',//注入modal
	function ($scope,$modal){
		$scope.open=function(size){
			var modalInstance = $modal.open({
      			templateUrl: 'myModalContent.html',
      			//controller: 'ModalInstanceCtrl',
      			size: size,
      			backdrop:"static",//点击空白处不会退出modal
      			keyboard :false //按键盘esc不会退出modal
    		});
    	} 
	}
]);