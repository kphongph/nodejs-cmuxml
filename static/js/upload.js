var mongo = require('mongodb');

module.exports = Upload;


function Upload(connection) {
  mongo.connect(connection);
}

Upload.prototype = {
    addUpload: function(req,res) {
        res.redirect('/');
  },
  insertData: function(err, collection) {
        collection.insert({name: "Kristiono Setyadi"});
        collection.insert({name: "Meghan Gill"});
        collection.insert({name: "Spiderman"});
    }
}
