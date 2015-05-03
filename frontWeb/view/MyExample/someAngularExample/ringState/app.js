var MyApp=angular.module('myapp', []);
//控制器
/*
CSS3圆环倒计时效果 百度
http://www.yangqq.com/web/css3demo/index.html
1用"border-radius"实现圆形
2用"clip:rect"遮罩为半圆
3 父级增加一层DIV
4把父级DIV用"clip:rect"遮罩为一半
5用"transform:rotate"连续改变扇形旋转角度
6同理复制左半边扇形旋转
7，0到180度右半圆转入左半边，左半圆不动
	180度到360度，右半圆完全转入左半边的情况下完全不动，左半圆转入右半边
	360度后回到第一步

使用示范
<ringstate stvalue='stvalue' 
		min-stvalue='10' 
		max-stvalue='80' 
		iconclass='icon-wendu'
		type='温度'
		unit='℃'
		></ringstate>

*/
MyApp.directive('ringstate',function(){ 
	return{
		restrict:'EA',
		scope:{
			stvalue:'=stvalue',//状态条要显示的值
			minStvalue:'@',//状态条的最小值和最大值可以确定stvalue当前的百分比
			maxStvalue:'@',
			iconclass:'@',//图标的class，需要导入iconmoon的css
			type:'@',//类型，text显示的名字,如温度，湿度
			unit:'@',//如ppm ℃等
		},
		template:
			//为了半圆裁剪，加position:relative,底圆，这里的颜色将会percent比,颜色由init函数根据百分比确定
			'<div style="height: 100%;width:100%;'+
						'border-radius:50%;position:relative;'+
						'box-shadow: 0px 0px 20px 0px black;'+//底圆加10px模糊的阴影，水平偏移，垂直偏移，阴影模糊，阴影突出，颜色
						'">'+  
				//用来遮挡旋转进入左边的半圆部分
				'<div style="height:100%;width:100%;position:absolute;clip:rect(0px,{{widthpx}}px,{{widthpx}}px,{{halfwidthpx}}px);">'+
					//可旋转的右半圆,这里的颜色将会是显示剩下percent值
					'<div id="rightcir" style="height: 100%;width:100%;background-color:rgb(255,255,255);'+
								'border-radius:50%;'+
								'position:absolute;top:0;left:0;clip:rect(0px,{{widthpx}}px,{{widthpx}}px,{{halfwidthpx}}px);'+//遮挡左边
								'transform:rotate({{rightCirDeg}});'+//半圆裁剪，一定要position:absolute或fixed	
								'-o-transform:rotate({{rightCirDeg}});'+
								'-webkit-transform:rotate({{rightCirDeg}});'+
								'-moz-transform:rotate({{rightCirDeg}});'+
								'">'+
					'</div>'+
				'</div>'+
				//用来遮挡旋转进入右边的半圆部分（左半圆部分）
				'<div style="height:100%;width:100%;position:absolute;clip:rect(0px,{{halfwidthpx}}px,{{widthpx}}px,0px);">'+
					//可旋转的左半圆，颜色显示剩下percent
					'<div id="leftcir" style="height: 100%;width:100%;background-color:rgb(255,255,255);'+
								'border-radius:50%;'+
								'position:absolute;top:0;left:0;clip:rect(0px,{{halfwidthpx}}px,{{widthpx}}px,0px);'+//遮挡左边
								'transform:rotate({{leftCirDeg}});'+//半圆裁剪，一定要position:absolute或fixed	
								'-o-transform:rotate({{leftCirDeg}});'+
								'-webkit-transform:rotate({{leftCirDeg}});'+
								'-moz-transform:rotate({{leftCirDeg}});'+
								'">'+
					'</div>'+
				'</div>'+
				//覆盖在正中心的圆，形成圆环，颜色是中间部分的颜色
				'<div style="height:80%;width:80%;background-color:rgb(255,255,255);'+
							'top:10%;left:10%;position:absolute;'+//计算与80%有关
							'border-radius:50%;'+
							'box-shadow: 0px 0px 10px 0px black inset;'+//内圆加10px模糊的内阴影
							'text-align:center;'+
							'">'+
					//字体有阴影
					//显示优
					'<span style="font-size:{{fontsize1}}px;display:block;text-shadow:0px 0px 3px black;">优</span>'+
					//显示34℃
					'<span style="font-size:{{fontsize2}}px;display:block;">{{stvalue}}℃</span>'+
					//显示图标+温度
					'<span class="{{iconclass}}" style="font-size:{{iconsize}}px;display:block;">{{type}}</span>'+//图标需要先引入了字体css
				'</div>'+
			'</div>',
		link:function(scope,elem,attrs,ctrl){
			var background=elem.find("div").eq(0);//背景底圆，也是占百分比的颜色条
			var leftcir=elem.find("div").eq(4);//左半圆
			var rightcir=elem.find("div").eq(2);//右半圆
			var statetext=elem.find("span").eq(0);//显示优差良的文字
			//=============初始化一些dom的值==============
			var init=function(){ 
				scope.widthpx=background[0].clientWidth;
				scope.halfwidthpx=scope.widthpx/2;//自适应掩膜
				//自适应字体
				scope.fontsize1=(35/200*scope.widthpx+1).toFixed(0);//优字的大小，以200px下35px为标准
				scope.iconsize=(30/200*scope.widthpx+1).toFixed(0);//
				scope.fontsize2=(30/200*scope.widthpx+1).toFixed(0);
			}();//在最后加个括号可以让其马上运行,这样可以不加scope.apply()更新template
			//===========初始化结束===================

			//========监测value 的值改变css的一些显示====
			function updateDom(){
				var percent=(parseFloat(scope.stvalue)-parseFloat(scope.minStvalue))/(parseFloat(scope.maxStvalue)-parseFloat(scope.minStvalue));
				var percentInt=(percent*100).toFixed(0);//取整
				if (percentInt<=50 && percentInt>0) {//如果显示值小于50%，让右半园转动，左半圆不动
					scope.rightCirDeg=percentInt/100*360+'deg';
					scope.leftCirDeg='0deg';
					//根据百分比确定颜色,从百分0到百分百，绿色到红色渐变
					//小于50%时绿固定，红色慢慢增加，50%时红色和绿色都达到最大为橙色
					var percentcolred=(percentInt/100*255*2).toFixed(0);//百分比越多越红
					var percentcolgreed=255;
					background.css('background-color','rgb('+percentcolred+','+percentcolgreed+',0)');	
				}else if(percentInt<=100 && percentInt>50){
					scope.rightCirDeg='180deg';//右半圆旋转进不可见区，
					scope.leftCirDeg=(percentInt-50)/100*360+'deg';
					//大于百分50时红色最大维持不变，绿色慢慢减少，最后为纯红
					var percentcolred=255;//红色不变
					var percentcolgreed=((100-percentInt)/100*255*2).toFixed(0);
					background.css('background-color','rgb('+percentcolred+','+percentcolgreed+',0)');
				}else{
					alert("输入超出范围，见控制台");
					console.log("stvalue超出maxStvalue和minStvalue之间")
				};
				//优差良的文字显示，和对应颜色
				statetext.css('color',background.css('background-color'));
				if(percentInt<33){
					statetext.html("优");//小于百分33为优
				}else if(percentInt<66){
					statetext.html("良");
				}else{
					statetext.html("差"); 
				}
			}//();//在最后加个括号可以让其马上运行,这样可以不加scope.apply()更新template
			scope.$watch('stvalue',updateDom);
			//=====updatedom结束=======================
		}
	};
});

MyApp.controller('test',function($scope){
	$scope.stvalue="30";
});

