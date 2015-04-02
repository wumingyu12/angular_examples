var MyApp=angular.module('myapp', ['ngSanitize','ngResource','ui.bootstrap']);//ngSanitize指令ng-blind-html,ngResource提供resetful服务



//restful服务
MyApp.factory('ReOnlineUsers',['$resource',function($resource){ 
	return $resource('/restful/onlineUsers/:userId',//相对地址的不加第一个/
		{userId:"all"}//在query方法下也会请求restful/onlineUsers/all
	);
}]);

//restful服务,http的restful服务
MyApp.factory('httpOnlineUsers',['$http',function($http){ 
	var baseurl='/restful/onlineUsers/';
	return { 
		save:function(user){
			return $http.post(baseurl,user);
		}
	};
}]);


//主控制器，body控制器

MyApp.controller('BodyCtrl',[
	'$scope',
	'$modal',//注入modal
	'$log',
	'$rootScope',
	'httpOnlineUsers',
	function ($scope,$modal,$log,$rootScope,httpOnlineUsers){
		//在rootscope下建立一些全局对象
		$rootScope.gUser={"id":0,"name":"","headImg":""};//创建一个全局对象，用来放置用户的id，昵称，头像

		//处理打开模态框
		$scope.open=function(size){
			var modalInstance = $modal.open({
      			templateUrl: 'myModalContent.html',
      			controller: 'ModalInstanceCtrl',
      			size: size,
      			//backdrop:"static",//点击空白处不会退出modal
      			//keyboard :false, //按键盘esc不会退出modal
      			resolve: {//向模态框发送一些值，通过注入
        			//items: function () {//一个属性或对象可以在modal的控制器里面注入
          			//	return $scope.items;
        			//}
      			}
    		});

			//处理模态框返回的结果，selectedItem从modal中返回
			//回调结束后，then，这里的回调就是出现的modal
    		modalInstance.result.then(function (cachUser) {//cachUser为回调参数
      			$rootScope.gUser = cachUser;//如果返回成功
      			httpOnlineUsers.save(cachUser);
      			//console.log($rootScope.gUser);
    		}, function () {
      			$log.info('Modal dismissed at: ' + new Date());
    		});
    	};
    	$scope.open() ;//让控制器加载时就运行，首次打开页面时
	}
]);

//登录模态框的控制器,这里要注意，这个模态控制器事实上上面的bodyctrl调用的，所以他的
//作用域事实上是bodyctrl，所以一些注入好像$http 等都是不会注入成功的
MyApp.controller('ModalInstanceCtrl',[
	'$scope',
	'$modalInstance',//父控制器的注入，可以提供close与dismiss方法
	//'items',//这个items是父控制器resolve返回并可以注入的
	function ($scope, $modalInstance) {

		//$scope.items = items;
		//$scope.selected = {//会在前端的ngclick中改变
			//item: $scope.items[0]//会产生scope.selected.item的值，赋值默认为items[0]
		//};
		$scope.nametip="请输入你想要的昵称";
		$scope.isNameEmpt=false;//用户名是否为空
		$scope.cachUser={};//创建一个对象
		$scope.cachUser.name="";//记录用户的昵称
		$scope.cachUser.headImg="";//用户的头像
		$scope.login = function () {//按下登录按钮
			//如果输入的昵称为空
			if($scope.cachUser.name==""){
				$scope.nametip="用户名不能为空";
				$scope.isNameEmpt=true;//会让一个class显示出来
				return; 
			}
			//得到当前的轮播对象的img地址
			$scope.cachUser.headImg=slides.filter(function (s) { return s.active; })[0].image;
			//console.log($scope.cachUser);
			//用restful向后台发送post请求更新后台用户
			//httpOnlineUsers.save($scope.cachUser);
			//向调用modal的控制器返回一些东西
			$modalInstance.close($scope.cachUser);//BodyCtrl,回调用的参数
		};

  		//$scope.cancel = function () {
    	//	$modalInstance.dismiss('cancel');
  		//};


  		//图片轮播
  		//$scope.myInterval = 5000;
		var slides = $scope.slides = [];
		$scope.addSlide = function() {
		    //var newWidth = 600 + slides.length + 1;
		    var newWidth =slides.length + 1;
		    slides.push({
		      image:'touxiang/cool-male-avatars-0'+newWidth+'.png',
		    });
		};
		for (var i=0; i<5; i++) {
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
        }, 10000);//1秒执行一次
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
