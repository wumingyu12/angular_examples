var MyApp=angular.module('myapp', ['ngSanitize']);//ngSanitize指令ng-blind-htmld
//控制器
MyApp.controller('testCtrl', function ($scope) {
	$scope.test = "你是谁";
	$scope.show=function(){
		$scope.test = "你是谁1";
		console.log("ffffffff");
	};
});
//指令，当div改变时，滚动条到最底部,通过对指令赋值监测此值的变化
MyApp.directive('scrollToBottom', function(){
    return {
        restrict: 'A',
        scope: {
            trigger: '=scrollToBottom'
        },
        link: function postLink(scope, elem) {
            scope.$watch('trigger', function() {
                //elem[0].scrollTop = 0;
                elem[0].scrollTop=elem[0].scrollHeight;
            });
        }
    };
});
//过滤器，可以让ng-blind-html可以绑定带style的html
MyApp.filter('to_trusted', ['$sce', function ($sce) {
	return function (text) {
		return $sce.trustAsHtml(text);
	};
}]);
//控制器
MyApp.controller('ueCtrl', function ($scope) {
	$scope.msgs='<p><span style="color: rgb(141, 179, 226);">方芳芳</span><br/></p>';
	$scope.msgCount=0;//
	$scope.setShow=function(){
		ue.setShow();//引用了外部的全局变量
		console.log("显示编辑界面");
	};

	$scope.sendMsg=function(){
		$scope.msgs=$scope.msgs+'\
		<h5 style="padding:0px;margin:0px 0px 0px 10px;">我：</h5>\
		<div class="well" style="padding:2px;margin:5px 0px 10px 30px;background-color:rgb(200,200,230);\
		    width:auto; display:inline-block !important;">\
        	'+ue.getContent()+'\
        </div>';//引用了外部的全局变量
		//console.log($scope.hasNewDiv);
		$scope.msgCount=$scope.msgCount+1;

		$scope.msgs=$scope.msgs+'\
		<div class="text-right">\
			<h5 style="padding:0px;margin:0px 0px 0px 10px;">机器人：</h5>\
			<div class="well" style="padding:2px;margin:5px 30px 10px 30px;background-color:rgb(100,180,230);\
		        width:auto; display:inline-block !important;">\
        	    '+ue.getContent()+'\
            </div>\
        </div>';//引用了外部的全局变量
	};
});
