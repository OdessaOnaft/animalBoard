angular.module("animalBoard")
  .controller("mainController", ($scope, $rootScope, $state, $translate, $server, $formatter, $timeout)=>{
    if(!localStorage.lang) {
      localStorage.lang = "ru"
    }
    $rootScope.dateFormat = $scope.dateFormat = $formatter.dateFormat
    $rootScope.lang = localStorage.lang
    $scope.state = $state
    $rootScope.translate = $scope.translate = $translate
    $scope.setLang = (lang)=>{
      $rootScope.lang = lang
      localStorage.lang = lang
    }
    $scope.floor = $rootScope.floor = (v)=>{
      return Math.floor(v*100)/100
    }



    $scope.addPoster = (poster)=>{
      $server.addPoster(poster, (err,data)=>{
        console.log(err,data)
      })
    }
    $scope.getPosters = ()=>{
      $server.getPosters({}, (err,data)=>{
        console.log(err,data)
      })
    }
    $scope.addPoster({type: 'animal', subtype: 'cat', city: 'odessa', district: 'primorskiy', description: 'some description', photo: 'base64-string', session: '__Some_user_session_token_string__'})
    $scope.getPosters()
    
    $scope.removeAllPosters = ()=>{
      $server.removeAllPosters({key: '123'}, (err,data)=>{
        console.log(err,data)
      })
    }
    $scope.removeAllPosters()
  })
  .controller("homeController", ($scope, $rootScope, $state)=>{
    jQuery(document).ready(function($) {
    $("#fullpage").fullpage({
      sectionsColor:['#C63D0F','#1BBC9B','#7E8F7C'],
      anchors:['firstPage','secondPage','3rdPage'],
      menu:'#menu',
      scrollBar:false,
      scrollOverflow:true,
      navigation:true,
      navigationTooltips:['Секция 1','Секция 2','Секция 3'],
      slidesNavigation:true,
      navigationPosition:'left',
      slidesNavPosition:'top',
      loopTop:true,
      loopBottom:true,
      loopHorizontal:false,
      

      afterResize:function(link,index) {
        },
      afterLoad:function(link,index) {
        
        if(index == 3) {
          $("#section2 img").delay(2000).animate({'left':'0%'},2000);
        }
        if(link == '3rdPage') {
          $("#section2 h1").fadeIn(1500,function() {
            $("#section2 p").css({'display':'block'}).animate({'fontSize':'8em'},1000)
          });
        }
        
      }
      
    });
  })
  })