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
		},
		template:'<div style="background-color:rgb(230,230,230);height: 200px;width:200px;top:200px;position:absolute;">'+
		
				'</div>',
		link:function(scope,elem,attrs,ctrl){
			elem.bind('mousedown',function(e){
				scope.downTop=parseInt(elem.children().css('top'));//转化为整型,滑块的当前高
				scope.downPageY=e.pageY;//按下鼠标时的pagey

				//按下时绑定移动事件
				elem.bind('mousemove',function(e){
				 	scope.curTop=e.pageY-scope.downPageY+scope.downTop;
				 	elem.children().css('top',scope.curTop+'px');
				});
			});
			//松开鼠标时解除移动事件
			elem.bind('mouseup',function(e){
				elem.unbind('mousemove');
			});
		}
	};
});


