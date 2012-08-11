var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;

var server = new Server('ds033047.mongolab.com', 33047, {auto_reconnect:true});
var db = new Db('cmu', server);

db.open(function(err, client) {
  client.authenticate('test', 'test123', function(err, success) {
    if(err) {
      console.log(err);
      return;
    }
    console.log('Connected');
    db.collection('user').find().toArray(function(err, items) {
      console.log(items);
    });
  });
});
