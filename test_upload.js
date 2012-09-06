var express = require("express");
var xml2js = require('xml2js');
var fs = require('fs');
var app = express();

var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

var CSVMongo = require('./csv/csv_mongo.js').CSVMongo;

var csv_mongo = new CSVMongo({db:'mydb', server:{name:'localhost', port:27017}});

app.configure(function() {
  app.use(express.bodyParser());
  app.use('/static', express.static(__dirname+'/static'));  
  app.set('view engine', 'jade');
  app.set('view options', {layout:false});
  //app.use(express.bodyParser({uploadDir:'./uploads'}));
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/static/form.html');
});

app.post('/file-upload', function(req, res, next) {
    //console.log(req.body);
    //console.log(req.files);
    // get the temporary location of the file
    var tmp_path = req.files.thumbnail.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = __dirname + '/repository/' + req.files.thumbnail.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
	    res.redirect('back');
        });
    });
});

app.post('/csv/file-upload', csv_mongo.save_file.bind(csv_mongo));

var server = app.listen(3000);
