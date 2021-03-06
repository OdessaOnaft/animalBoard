angular.module("animalBoard")
  .factory('$server', ($state)=>{
    var api = {}
    var methods = [
      'login',
      'addPoster',
      'getPosters',
      'removeAllPosters',
      'register',
      'getProfile'
    ]
    var addMethod = (methodName)=>{
      api[methodName] = (data, callback)=>{
        var domain = "localhost"
        // domain = "webjudgeapi.westcentralus.cloudapp.azure.com"
        
        data.token = localStorage.token
        var request = $.ajax({
          url: 'http://'+domain+'/call/'+methodName,
          method: 'POST',
          contentType: "application/json;charset=utf-8",
          headers: {
            'sessionidcors': localStorage.token
          },
          data: JSON.stringify(data),
          dataType: 'json'
        })
        request.done((data)=>{
          if(data.err && data.err.message == "Invalid session"){
            delete localStorage.token
            $state.go('main')
          };
          callback(data.err, data.data)
        })

        request.fail((xhr)=>{
          callback(xhr.responseJSON)
        })
      }
    }

    for(var method in methods) {
      addMethod(methods[method])
    }
    return api;
  })
