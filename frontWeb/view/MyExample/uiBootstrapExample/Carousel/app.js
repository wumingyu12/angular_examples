var MyApp=angular.module('myapp', ['ui.bootstrap']);
//控制器
MyApp.controller('CarouselDemoCtrl', function ($scope) {
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
  //添加轮播
  for (var i=0; i<4; i++) {
    $scope.addSlide();
  };
  //得到当前轮播图像
  $scope.getActiveSlide = function () {
    return slides.filter(function (s) { return s.active; })[0].text;
  };
  $scope.get=function(){ 
  	alert($scope.getActiveSlide());
  };

});