var express = require("express");
var xml2js = require('xml2js');
var fs = require('fs');
var app = express();
var passport = require('passport');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

app.configure(function() {
  app.use(express.bodyParser());
  app.use('/static', express.static(__dirname+'/static'));  
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));

  app.set('view engine', 'jade');
  app.set('view options', {layout:false});

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  
});



app.get('/passport', function(req, res) {
  //res.writeHead(200, {'Content-Type': 'text/html'});  
  fs.readFile(__dirname+'/static/index_test.html', 'utf8', function(err, data){
        res.send(data);
    });
    //res.sendfile(__dirname + '/static/index_test.html',{ user: req.user });
});



var server = app.listen(3000);
