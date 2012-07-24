var express = require("express");
var xml2js = require('xml2js');
var fs = require('fs');
var app = express.createServer();

app.get('/', function(req, res) {
    
    var parser = new xml2js.Parser();
    parser.addListener('end', function(result) {
	res.json(result);
	console.log('Done.');
    });
    
    fs.readFile(__dirname + '/foo.xml', function(err, data) {
	parser.parseString(data);
    });
    
    
});

app.listen(3000);
