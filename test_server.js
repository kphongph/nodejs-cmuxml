var express = require("express");
var xml2js = require('xml2js');
var fs = require('fs');
var app = express();


app.configure(function() {
  app.use(express.bodyParser());
  app.use('/static', express.static(__dirname+'/static'));  
  app.set('view engine', 'jade');
  app.set('view options', {layout:false});

});


var XMLMongo = require('./xml-transform/xml_mongo').XMLMongo;
var XMLView = require('./xml-transform/xml_view').XMLView;
var xml_view = new XMLView(new XMLMongo({db:'mydb', server:{name:'localhost', port:27017}}));



app.get('/', function (req, res) {
    res.sendfile(__dirname + '/static/index.html');
});

app.post('/mongo/files', xml_view.listItems.bind(xml_view));

var server = app.listen(3000);
