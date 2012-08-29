var mongo = require('mongodb');
var host = "localhost";
var port = mongo.Connection.DEFAULT_PORT;
var server = new mongo.Server(host,port, {auto_reconnect: false});
var db = new mongo.Db('mydb', server),
assert = require('assert');
var Grid = mongo.Grid;

//var db = new mongo.Db('node-mongo-examples', new mongo.Server(host, port, {}), {});
db.open(function(err,client) {
    client.collection('users', function(err,collection) {
       // doc = {
       //     "name":"MongoDB",
       //     "type" : "database",
       //     "count" : 1,
       //     "info" : { x:203,y:102}
       //     }
            //collection.insert(doc, function (err,docs) {
            //    console.log(docs);
            //    db.close();
            //    });
                var grid = new Grid(client, 'fs');
                var originalData = new Buffer("Hello world");
                console.log(originalData);
                grid.put(originalData, {metadata:{category:'text'}, content_type: 'text'}, function(err, result) {
                // Fetch the content
                    if(!err) {
                            console.log("Finished writing file to Mongo");
                        }
                    grid.get(result._id, function(err, data) {
                        //assert.deepEqual(originalData.toString('base64'), data.toString('base64'));
                       // client.close();
                       console.log("Retrieved data: " + data.toString());
                        //grid.delete(result._id, function(err, result2) {
                        //});
                    });
                });
                
        //collection.insert({username:'Bilbo',firstname:'Shilbo'}, function(err, docs) {
        //    console.log(docs);
        //    db.close();
       // });
    });
});
