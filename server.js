var express = require("express");
var xml2js = require('xml2js');
var fs = require('fs');
var app = express.createServer();

app.configure(function() {
  app.use('/static/js', express.static(__dirname+'/static/js'));
  app.set('view engine', 'jade');
  app.set('view options', {layout:false});
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/xml', function(req, res) {
    var parser = new xml2js.Parser();
    parser.addListener('end', function(result) {
	res.json(result);
	console.log('Done.');
    });
    fs.readFile(__dirname + '/test/foo.xml', function(err, data) {
	parser.parseString(data);
    });
});

var server = app.listen(3000);
var everyone = require("now").initialize(server,{socketio:{transports:['xhr-polling','jsonp-polling']}});
//var everyone = require("now").initialize(server);

everyone.now.loadXML = function(callback) {
  var parser = new xml2js.Parser();
  parser.addListener('end', function(result) {
    callback(result);
    console.log('Done.');
  });
  fs.readFile(__dirname + '/test/foo.xml', function(err, data) {
    parser.parseString(data);
  });
};
