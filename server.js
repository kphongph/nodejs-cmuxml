var express = require("express");
var xml2js = require('xml2js');
var fs = require('fs');
var app = express();

var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy
//var OpenIDStrategy = require('passport-openid').Strategy;


var mongo = require('mongodb');
var host = "localhost";
var port = mongo.Connection.DEFAULT_PORT;
var server = new mongo.Server(host,port, {auto_reconnect: false});
var db = new mongo.Db('mydb', server);
var Grid = mongo.Grid;
var GridStore = mongo.GridStore;
var ObjectID =  mongo.ObjectID;


//var taskList = new TaskList('mongodb://Your_MongoDB_VM_name.cloudapp.net/tasks');

//var Upload = require('upload');
//var upload = new Upload(mydb);
//var upload = new Upload('mongodb://mongodbserver/tasks');

app.configure(function() {
  app.use(express.bodyParser());
  app.use('/static', express.static(__dirname+'/static'));  
  app.set('view engine', 'jade');
  app.set('view options', {layout:false});
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

//app.post('/login', 
//    passport.authenticate('local'),
//        function(req, res) {
            // If this function gets called, authentication was successful.
            // `req.user` property contains the authenticated user.
 //             res.writeHead(200, {'Content-Type': 'text/html'});  
 //             res.end(fs.readFileSync(__dirname+'/login.html'));
 //   });
 
 // Use the passport strategy.
passport.use(new LocalStrategy(
    function(username, password, done) {

    // Use this as you normally would in Passport.js
  }
});
 
app.router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.post('/mongo/create', function(req, res) {
    db.open(function(err,client) {
        if(!err) {                
            var gridStore = new GridStore(client, req.body.file, 'w');
            console.log(req.body.file);
            gridStore.open(function(err, gridStore) {
                gridStore.write(req.body.content,'', function(err, gridStore) {                    
                    if(!err) {
                        console.log(req.body.content);
                        gridStore.close(function(err, result) {                        
                            if(!err) {
                                //res.json(result);
                                res.json({'status':'ok'});
                                client.close();
                            }
                        });
                    }
                });
            });
        }
    });
});

app.get('/mongo/create', function(req, res) {
    db.open(function(err,client) {
        if(!err) {                
            var gridStore = new GridStore(client, req.query.file, 'w');
            gridStore.open(function(err, gridStore) {
                gridStore.write('', function(err, gridStore) {                    
                    if(!err) {
                        gridStore.close(function(err, result) {                        
                            if(!err) {
                                res.json(result);
                                client.close();
                            }
                        });
                    }
                });
            });
        }
    });
});

app.get('/mongo/files/:id', function(req, res) {                
    db.open(function(err,client) {
        if(!err) {                                             
            if(req.query.content) {
                var gridStore = new GridStore(client, db.bson_serializer.ObjectID.createFromHexString(req.params.id), 'r');
                gridStore.open(function(err, gridStore) {
                    gridStore.seek(0, function() {                                
                        gridStore.read(function(err, data) { 
                            if(data) {                    
                                //res.setEncoding(encoding='utf8');        
                                console.log(data.toString() + ' UTF8 = '+             data.toString("utf8"));
                                res.json({'content':data.toString("utf8")}); 
                                
                            } else {
                                res.json({'content': ''}); 
                            }
                            client.close();
                        });
                    });
                });
            } else {
                client.collection("fs.files", function(err, collection) {            
                    if(!err) {
                        collection.findOne({'_id':db.bson_serializer.ObjectID.createFromHexString(req.params.id)}, function(err, result) {
                            if(!err) {
                                console.log(result);
                                res.json(result);                            
                            } 
                            client.close();                                  
                        });                                                                              
                    } else {
                        console.log(err);                
                        client.close();          
                    }                
                });         
            }                           
        }
    });
});


app.post('/mongo/files/:id', function(req, res) {    
    db.open(function(err,client) {
        if(!err) {                
            var fileId = db.bson_serializer.ObjectID.createFromHexString(req.params.id);
            GridStore.exist(db, fileId, function(err, exist) {                
                if(exist) {
                    var gridStore = new GridStore(client, fileId, 'w');
                    gridStore.open(function(err, gridStore) {
                        gridStore.contentType = req.query.contentType;
                        console.log(req.query.content);
                        gridStore.write(new Buffer(req.query.content, "utf8"), req.query.contentType,function(err, gridStore) {                    
                            if(!err) {
                                gridStore.close(function(err, result) {                        
                                    if(!err) {
                                        res.json(result);
                                        client.close();
                                    }
                                });
                            }
                        }); 
                    });
                } else {
                    res.json({'status':'Error', 'message': 'File Does Not Exists'});
                    client.close();
                }
            });
        }
    });
});

app.get('/mongo/files', function(req, res) {    
    console.log('mongo list');
    db.open(function(err,client) {
        if(!err) {                            
            var file_list = [];
            client.collection("fs.files", function(err, collection) {            
                if(!err) {
                    collection.find().toArray(function(err, items) {
                        items.forEach(function(entry) {
                            file_list.push(entry);
                        });
                        res.json(file_list);
                        console.log('Return');
                        client.close();          
                    });                                                                              
                } else {
                    console.log(err);                
                    client.close();          
                }                
            });                                    
        }
    });
});


app.get('/mongo/:id/delete', function(req, res) {    
    db.open(function(err,client) {
        if(!err) {                
            var fileId = db.bson_serializer.ObjectID.createFromHexString(req.params.id);
            GridStore.exist(db, fileId, function(err, exist) {   
                if(exist) {
                    var gridStore = new GridStore(client, fileId, 'r');
                    gridStore.open(function(err, gridStore) {                
                        gridStore.unlink(function(err, result) { 
                            if(!err) {                              
                                res.json({'delete':req.params.id}); 
                                client.close();                                        
                            } else {
                                console.log(err);
                            }
                        });
                    });
                } else {
                    res.json({'status':'Error', 'message': 'File Does Not Exists'});
                    client.close();
                }
            });
        }
    });
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
