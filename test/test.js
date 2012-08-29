var express = require('express');
var mongo = require('mongoskin');
 
var app = express.createServer(express.logger());
 
 
app.get('/', function(request, response) {
	var conn = mongo.db('mongodb://localhost:27017/yourdbname');
	conn.collection('users').find().toArray(function(err, items) {
		if (err) throw err;
 
		response.send(JSON.stringify(items));
	});  
});
 
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});
