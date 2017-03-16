module.exports = (db)=>{
  return (method,data,callback)=>{
    var postersCollection = db.collection('posters');
    var usersCollection = db.collection('users');
    generateToken = ()=>{
      var str=""
      var alp="qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789"
      for(var i=0;i<20;i++){
        c= alp[Math.floor(Math.random()*alp.length)]
        str+=c
      }
      return str;
    }
    api = {
      login: (data, callback)=>{
        user = usersCollection.findOne({
          email: data.email
          // password: data.password
        }, (err,data2)=>{
          console.log(err,data2);
          if(!data2) {
            callback({err: "user not exist(email)"}, null)
          } else {
            // callback(null, {message: "login ok!"})
            usersCollection.findOne({
              email: data.email,
              password: data.password
            }, (err,data3)=>{
              if(!data3){
                callback({err: "invalid password"}, null)
              } else {
                callback(null, {message: "login ok",token:data3.token})
              }
            })
          }
        })

      },
      getProfile: (data,callback)=> {
        if(!data.token) {
          callback({err: 'no token'}, null);
          return;
        }
        usersCollection.findOne({
          token: data.token
        }, (err,data2)=>{
          if(!data2) {
            callback({err:"invalid token"},null)
          } else {
            callback(null,{email:data2.email})
          }
        })
      },
      register: (data,callback)=> {
        if(data) {
          usersCollection.findOne({
            email: data.email
          }, (err,data2)=>{
            if(data2) {
              callback({err: 'user already exist'}, null)
            } else {
              data.token = generateToken();
              usersCollection.insert(data);
              callback(null, {message: "register ok", token: data.token});
            }
          })
        }
      },
      addPoster: (data,callback)=>{
        if(data) {
          postersCollection.insert(data, callback);
          // callback(null, 'ok, saved!');
        } else {
          callback({err: 'no data'});
        }
      },
      getPosters: (data,callback)=>{
        var posters = postersCollection.find((err,docs)=>{
          console.log(err,docs)
          callback(err,docs)
        })
      },
      removeAllPosters: (data, callback)=>{
        if(data && data.key=='123') {
          postersCollection.remove()
          callback(null, 'ok removed!')
        } else {
          callback({err: 'invalid key!'})
        }
      }
    }
    if(!api[method]) {
      
      callback({err: "Method not exist"})
      
    } else {
      api[method](data, callback)
    }
    
  }
}