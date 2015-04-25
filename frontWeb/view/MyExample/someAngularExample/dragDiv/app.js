var MyApp=angular.module('myapp', []);
//控制器
MyApp.directive('sr',function(){ 
	return{
		restrict:'EA',
		template:'<div style="background-color:rgb(230,230,230);height: 200px;width:200px;top:200px;position:absolute;">'+
		
				'</div>',
		link:function(scope,elem,attrs,ctrl){
			alert("111111");
			console.log(elem.css("background-color"));
			elem.bind('click',function(){
				console.log("11111111");
				elem.css('background-color', 'white');
				var curTop=elem.css('top');
				console.log(elem.css('top'));
				curTop=curTop-10;
				elem.css('top',curTop);
			});
		}
	};
});


