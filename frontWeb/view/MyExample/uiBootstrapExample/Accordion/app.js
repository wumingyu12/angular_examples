var MyApp=angular.module('myapp', ['ui.bootstrap']);
//控制器
MyApp.controller('AccordionDemoCtrl', function ($scope) {
	$scope.oneAtATime = true;

	$scope.groups = [
	    {
	      'title': '项目1',
	      'content': 'Dynamic Group Body - 11'
	    },
	    {
	      'title': '项目2',
	      'content': 'Dynamic Group Body - 22'
	    }
	];

	$scope.items = ['Item 1', 'Item 2', 'Item 3'];

	$scope.addItem = function() {
		var newItemNo = $scope.items.length + 1;
	    $scope.items.push('Item ' + newItemNo);
	};

	$scope.status = {
	    isFirstOpen: true,
	    isFirstDisabled: false
	};
});