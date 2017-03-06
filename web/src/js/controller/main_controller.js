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


    $timeout(()=>{
      $scope.checkSession2 = ()=>{
        if(!localStorage.token) {
          // $state.go("main")
          $rootScope.isGuest = true
          return;
        }
        $server.checkSession({}, (err,data)=>{

          $scope.$apply(()=>{
            if(!err) {
              $scope.user = data;
              $rootScope.isGuest = false
              if(!$state.includes('cabinet')) {
                $state.go('cabinet')
              }
            } else {
              delete localStorage.token;
              // $state.go("main");
              $rootScope.isGuest = true
            }
          })
          
        })
      }
      if($state.current.name.indexOf('cabinet')==-1) {
        $scope.checkSession2()
      }
    }, 50)
    
    $scope.logout = ()=>{
      $rootScope.isGuest = true
      $server.logout({}, (err, data)=>{
        $scope.$apply(()=>{
          if(!err) {
            delete localStorage.token;
          } else {
            delete localStorage.token;
          }
        })
      })
      $state.go("main");
    }
    $scope.prevent = $rootScope.prevent = (e)=>{
      e.stopPropagation();
    }
    $scope.nTimes = (n)=>{
      var a = [];
      for(var i=0;i<n;i++) {
        a.push(i)
      }
      return a;
    }
    
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