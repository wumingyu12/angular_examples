var MyApp=angular.module('myapp', ['angularTreeview']);
MyApp.controller('treeViewCtrl', function ($scope) {
	$scope.treedata = 
	[
	    { "label" : "User", "id" : "role1", "children" : [
	        { "label" : "subUser1", "id" : "role11", "children" : [] },
	        { "label" : "subUser2", "id" : "role12", "children" : [
	            { "label" : "subUser2-1", "id" : "role121", "children" : [
	                { "label" : "subUser2-1-1", "id" : "role1211", "children" : [] },
	                { "label" : "subUser2-1-2", "id" : "role1212", "children" : [] }
	            ]}
	        ]}
	    ]},
	    { "label" : "Admin", "id" : "role2", "children" : [] },
	    { "label" : "Guest", "id" : "role3", "children" : [] }
	];
	//在console里面打印，$scope."TREE ID".currentNode里面保存里当前的选择
	$scope.$watch( 'abc.currentNode', function( newObj, oldObj ) {
	    if( $scope.abc && angular.isObject($scope.abc.currentNode) ) {
	        console.log( 'Node Selected!!' );
	        console.log( $scope.abc.currentNode );
	    }
	}, false); 
});