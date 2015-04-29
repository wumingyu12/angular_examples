var MyApp=angular.module('myapp', []);
//控制器
/*
楼主可以搜一下关于js拖动的代码，思路大体上就是： 
1.鼠标按下时（mousedown），将当前的滑块位置（css中top的值）和鼠标位置(在屏幕上的纵坐标位置pageY)记录下来，同时给滑块绑定鼠标移动事件函数； 
2.鼠标移动时（mousemove），随着移动事件的发生，绑定的移动函数会不断的执行（每次具体执行过程为：计算当前pageY和之前记录下的pageY的差值，然后将“差值+之前记录的top值”得到当前滑块应该在的top值，最后将top值写到滑块的样式中。），滑块因为top不断变化，上下位置也就会不断变化。 
3.鼠标松开时（mouseup），取鼠标消移动函数的绑定。
*/
MyApp.directive('sr',function(){ 
	return{
		restrict:'EA',
		scope:{
			//按下鼠标时记录的top值
			//按下鼠标时的pagey值
			slwidth:'@',
		},
		template:'<div style="background-color:rgb(230,230,230);height: 50%;width:100%;">'+
					
				'</div>'+
				'<div style="background-color:rgb(230,230,23,0.4);height: 50%;width:100%;position:relative;">'+
					'<!-- 滑动条 --><div style="background-color:rgb(230,23,213);height: 25%;width:100%;top:50%;position:absolute;border-radius:10px;">'+
					'</div>'+
					'<!-- 滑动块 --><div class="block" style="left:0px;background-color:rgba(20,230,10,0.6);height: 35%;width:10%;top:45%;position:absolute;border-radius:10px;">'+
					'</div>'+
				'</div>',
		link:function(scope,elem,attrs,ctrl){
			var scoll=elem.find("div").eq(3);//eq(3)要根据上面的html变化而变化，指滑动块
			var scollline=elem.find("div").eq(2);//eq(2)要根据上面的html变化而变化，指滑动背景条
			var hasbind=false;//变量用了避免异步处理中还没unbind又bind了
			var curLeft;
			scoll.bind('mousedown',function(e){
				console.log("down");
				var downLeft=parseInt(scoll.css('left'));//转化为整型,滑块的当前高
				var downPageX=e.pageX;//按下鼠标时的pagey
				//按下时绑定移动事件
				if (!hasbind) {//只有当前没有绑定才绑定，避免了多次绑定
					console.log("bind");
					elem.bind('mousemove',function(e){//注意这里不用滑块的div而是用控件的整体div是避免鼠标移出滑块区却没响应
					 	hasbind=true;
					 	curLeft=e.pageX-downPageX+downLeft;
					 	console.log(e.pageX);
					 	//console.log(scollline[0].clientWidth);//用js获取宽度
					 	if (curLeft < scollline[0].clientWidth-scoll[0].clientWidth && curLeft > 0) {//限制滑块移动范围
					 		console.log(curLeft);
					 		scoll.css('left',curLeft+'px');	 
					 	};	
					});
				};
			});
			//松开鼠标时解除移动事件
			elem.bind('mouseup',function(e){
				hasbind=false;
				elem.unbind('mousemove');
				console.log("unbind");
			});
			//鼠标离开时也时解除移动事件

		}
	};
});


