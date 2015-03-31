var MyApp=angular.module('myapp', ['ngSanitize','ngResource','ui.bootstrap']);//ngSanitize指令ng-blind-html,ngResource提供resetful服务

//restful服务
MyApp.factory('ReOnlineUsers',['$resource',function($resource){ 
	return $resource('/restful/onlineUsers/:userId',//相对地址的不加第一个/
		{userId:"all"}//在query方法下也会请求restful/onlineUsers/all
	);
}]);
//主控制器，body控制器

MyApp.controller('BodyCtrl',[
	'$scope',
	'$modal',//注入modal
	'$log',
	function ($scope,$modal,$log){
		$scope.items = ['item1', 'item2', 'item3'];
		$scope.open=function(size){
			var modalInstance = $modal.open({
      			templateUrl: 'myModalContent.html',
      			controller: 'ModalInstanceCtrl',
      			size: size,
      			//backdrop:"static",//点击空白处不会退出modal
      			//keyboard :false, //按键盘esc不会退出modal
      			resolve: {//向模态框发送一些值，通过注入
        			items: function () {//一个属性或对象可以在modal的控制器里面注入
          				return $scope.items;
        			}
      			}
    		});

			//处理模态框返回的结果，selectedItem从modal中返回
			//回调结束后，then，这里的回调就是出现的modal
    		modalInstance.result.then(function (selectedItem) {
      			$scope.selected = selectedItem;//如果返回成功
    		}, function () {
      			$log.info('Modal dismissed at: ' + new Date());
    		});
    	};
    	$scope.open() ;//让控制器加载时就运行，首次打开页面时
	}
]);

//登录模态框的控制器
MyApp.controller('ModalInstanceCtrl',[
	'$scope',
	'$modalInstance',//父控制器的注入，可以提供close与dismiss方法
	'items',//这个items是父控制器resolve返回并可以注入的
	function ($scope, $modalInstance, items) {

		$scope.items = items;
		$scope.selected = {//会在前端的ngclick中改变
			item: $scope.items[0]//会产生scope.selected.item的值，赋值默认为items[0]
		};

		$scope.login = function () {
			//向调用modal的控制器返回一些东西
			$modalInstance.close($scope.selected.item);
		};

  		$scope.cancel = function () {
    		$modalInstance.dismiss('cancel');
  		};
  		//图片轮播
  		$scope.myInterval = 5000;
		var slides = $scope.slides = [];
		$scope.addSlide = function() {
		    //var newWidth = 600 + slides.length + 1;
		    var newWidth =slides.length + 1;
		    slides.push({
		      //image: 'http://placekitten.com/' + newWidth + '/300',
		      image:'touxiang/cool-male-avatars-0'+newWidth+'.png',
		      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
		        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
		    });
		};
		for (var i=0; i<4; i++) {
		    $scope.addSlide();
		};
	}
]);


//左侧好友列表控制器
MyApp.controller('userListCtrl',[
	'$scope',
	'ReOnlineUsers',
	'$timeout',//timeout实现长轮询
	function ($scope,ReOnlineUsers,$timeout) {
	//好友列表，get   /restful/onlineUsers/all
	var longPoll = function() {
        $timeout(function() {
        	//定时执行的函数，为一个get json
            $scope.userList=ReOnlineUsers.get({userId:"all"},function(userList){//成功时的回调函数,还可以跟一个失败时候的回调
				console.log("app.js 46行好友列表获取成功")
				console.log(userList);
			});
            longPoll();//最后记得回调
        }, 1000);//1秒执行一次
    }; 
	longPoll();//记得一开始要启动定时
}]);


//指令，当div改变时，滚动条到最底部,通过对指令赋值监测此值的变化
MyApp.directive('scrollToBottom', function(){
    return {
        restrict: 'A',
        scope: {
            trigger: '=scrollToBottom'
        },
        link: function postLink(scope, elem) {//elem为jquery对象
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
		window.ue.setShow();//引用了外部的全局变量
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
