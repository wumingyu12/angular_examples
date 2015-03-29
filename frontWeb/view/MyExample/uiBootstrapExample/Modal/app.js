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
      			size: size
    		});
    	} 
	}
]);