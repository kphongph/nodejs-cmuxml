var express = require("express");
var xml2js = require('xml2js');
var fs = require('fs');
var app = express();


var mongo = require('mongodb');
var host = "localhost";
var port = mongo.Connection.DEFAULT_PORT;
var server = new mongo.Server(host,port, {auto_reconnect: false});
var db = new mongo.Db('mydb', server),
var Grid = mongo.Grid;


//var taskList = new TaskList('mongodb://Your_MongoDB_VM_name.cloudapp.net/tasks');

var Upload = require('upload');
var upload = new Upload(mydb);
//var upload = new Upload('mongodb://mongodbserver/tasks');


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

app.post('/ajax/readfile', function(req, res) {
    var data = fs.readFileSync(__dirname+'/repository/'+req.body.file,"utf8");    
    res.json({'content':data});    
});

app.post('/ajax/savefile', function(req, res) {        
    fs.writeFile(__dirname+'/repository/'+req.body.file,req.body.content, encoding="utf8", function(err) {
        if (err) res.json({'status':'error - '+err});
        res.json({'status':'ok'});
    });
});

app.get('/upload', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});  
    res.end(fs.readFileSync(__dirname+'/static/upload.html'));  
  //db.collection("users",function(err,collection){
  //      console.log(req.params.id);
   //     collection.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
   //         if( err || !saved ) console.log("User not saved");
   //         else console.log("User saved");
    //    });
//});
});
//app.get('/upload', upload.addUpload.bind(upload));


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
