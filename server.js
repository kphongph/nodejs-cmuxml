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

app.get('/', function(req, res) {
  // res.render('index');
  res.writeHead(200, {'Content-Type': 'text/html'});  
  res.end(fs.readFileSync(__dirname+'/static/index.html'));
});

app.get('/test', function(req, res) {
  // res.render('index');
  res.writeHead(200, {'Content-Type': 'text/html'});  
  res.end(fs.readFileSync(__dirname+'/static/test.html'));    
});



app.post('/ajax/xml2json', function(req, res) {

    //explicitCharkey: false
    //trim: false
    //normalize: false
    
    //charkey: "_"
    //explicitArray: true
    //ignoreAttrs: false
    //mergeAttrs: false
    //explicitRoot: true
    //validator: null
    var parser = new xml2js.Parser({
        attrkey: "$",
        charkey: "_",
        explicitArray: false,
        explicitCharkey: true,
        mergeAttrs: false,
        explicitRoot: true,
        normalize: false,
    });
    parser.addListener('end', function(result) {
        res.json(result);
    });        
	parser.parseString(req.body.xml, function(err, result) {
        if(err) {                                
            console.log(err);                               
            res.json({status:'error while parsing xml'});
        }        
    });    
});

app.get('/ajax/loadxml', function(req, res) {
    var parser = new xml2js.Parser();
    parser.addListener('end', function(result) {
	res.json(result);
    });
    fs.readFile(__dirname + '/test/foo.xml', function(err, data) {
	parser.parseString(data);
    });
});

var server = app.listen(3000);

//var everyone = require("now").initialize(server,{socketio:{transports:['xhr-polling','jsonp-polling']}});
//var everyone = require("now").initialize(server);

/*
everyone.now.loadXML = function(callback) {
  var parser = new xml2js.Parser();
  parser.addListener('end', function(result) {
    callback(result);
  });
  fs.readFile(__dirname + '/test/foo.xml', function(err, data) {
    parser.parseString(data);
  });
};
*/
