var mongo = require('mongodb');
var Db = mongo.Db;
var Server = mongo.Server;
var ObjectID = mongo.ObjectID;
var GridStore = mongo.GridStore;

//var collection_name = 'test_collection';
var collection_name = 'fs.files';

function XMLMongo(config) {        
    this.db = new Db(config.db, new Server(config.server.name, config.server.port,
        {auto_reconnect: false, poolSize: 1}), {native_parser: false});
}

XMLMongo.prototype.getCollection = function(callback) {
    var self = this;
    this.db.open(function(err,client) { 
        client.collection(collection_name, function(err, xml_collection) {
            if(err) { 
                callback(err);
            } else {
                callback(null, xml_collection);
                client.close();
            }
        })
    });
};

XMLMongo.prototype.findAll = function(callback){
    this.getCollection(function(err, xml_collection){
        if (err) callback(err)
        else {
            xml_collection.find().toArray(function(err, results) {
                if (err) callback(err)
                else callback(null, results)
            });
        }
    });
};

exports.XMLMongo = XMLMongo;
