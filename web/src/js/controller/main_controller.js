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
  .controller("homeController", ($scope, $rootScope, $state, $translate,  $window,  $server, $formatter, $timeout)=>{
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
//map configure/////////////////////////////////////////////////
    $scope.data = []
    $scope.obj = {}
    $scope.markers = []
    $window.s = $scope
    $scope.search = ()=>{
        $http({
          method: 'GET',
          url: "http://nominatim.openstreetmap.org/search/?city="+$scope.obj.country+"&format=json&addressdetails=1&limit="+limit
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available

            console.log(response)
            $scope.data = response.data
            if(!$scope.data.length) return;
            _.each($scope.markers, v=>{
                map.removeLayer(v)
            })
            map.panTo(new L.LatLng($scope.data[0].lat, $scope.data[0].lon));
            _.each($scope.data, v=>{
                console.log(Math.floor(Math.random()*235234234))
                $scope.markers.push(L.marker([v.lat, v.lon]).addTo(map)
                    .bindPopup(v.display_name)
                    .openPopup()
                )
            })
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
    }
    var limit = 1
    var map = L.map('map-demo', {
      minZoom: 11,
      maxBounds: [
        [46.27132645, 30.88025818],[46.63326473,30.58387756],
        [46.4846583, 30.88025818],[46.63326473,30.86746216]
        ]
    }).setView([46.4846583, 30.732564], 10);
    L.rectangle([
        [46.27132645, 30.88025818],[46.63326473,30.58387756],
        [46.4846583, 30.88025818],[46.63326473,30.86746216]
         ], {color: "#ff7800", weight: 1}).addTo(map);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        
    }).addTo(map);
  })
