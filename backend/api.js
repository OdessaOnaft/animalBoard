module.exports = (db)=>{
  return (method,data,callback)=>{
    var postersCollection = db.collection('posters')
    api = {
      login: (data, callback)=>{
        callback(null, 'ok');
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
    api[method](data, callback)
  }
}