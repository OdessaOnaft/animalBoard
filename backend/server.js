var conf = {};
var _ = require('underscore'),
  http = require('http'),
  https = require('https'),
  express = require('express'),
  compress = require('compression'),
  domain = require('domain'),
  mongojs = require('mongojs'),
  cors = require('cors'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  request = require('request'),
  fs = require('fs');

var app = express();
app.use(compress());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({limit: '1gb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(err, req, res, next) {
    //console.error(err.stack);
    if(err){
        res.end(JSON.stringify({
                err: {
                    message: 'Unknown error'
                }
            })+'\n');
    } else {
        res.end(JSON.stringify({
                err: null
            })+'\n');
    }
});

function getHandler(currApi){
    return function(req, res){
        var requestDomain = domain.create();
        requestDomain.on('error', function(err){
            console.log(err.stack);
            res.status(500).json({
                err: {
                    message: 'Internal server error'
                }
            });
        });
        requestDomain.run(function(){
            var methodName = req.url.split('/')[2];
            
            if (!req.body.cookies){
                req.body.cookies = {}
            }
            if (!req.body.cookies.sessionId)
                req.body.cookies.sessionId = null;
            if(!_.isObject(req.body)){
                res.status(400).json({
                        err: {
                            message: 'Invalid package format'
                        }
                    });
                return;
            }
            currApi.call(methodName, req.body, function(err, data, warning){
                if(err)
                    console.log(err, err.stack);
                res.status(err?400:200).json({
                    err: err,
                    data: data,
                    warning: warning
                });
            });
        });
    }
}

var mongoConnectionSettings = {
  host: 'localhost',
  port:27017,
  db: 'board'
}

mongoConnectionSettings = {
  host: 'animalBoard:1q2w3e4r5t@ds153765.mlab.com',
  port:53765,
  db: 'board'
}
var db = mongojs("mongodb://"+mongoConnectionSettings.host+":"+mongoConnectionSettings.port+"/"+mongoConnectionSettings.db, ['board']);


scopeAPI = {
  call: function(method, data, callback){
    api = require('./api.js');
    api(db)(method, data,callback);
  }
}
app.post('/call/*', cors(), getHandler(scopeAPI));
http.createServer(app).listen('80');



