// config = {db:'mydb', server:{name:'localhost', port:27017}
// var cvs_mongo = new CVSMongo({db:'mydb', server:{name:'localhost', port:27017});
var mongo = require('mongodb');
var Db = mongo.Db;
var Server = mongo.Server;
var ObjectID = mongo.ObjectID;
var GridStore = mongo.GridStore;

function CSVMongo(config) {        
    this.db = new Db(config.db, new Server(config.server.name, config.server.port,
        {auto_reconnect: false, poolSize: 1}), {native_parser: false});
}

CSVMongo.prototype.save_file = function(req, res) {
    var tmp_path = req.files.thumbnail.path;
    console.log('tmp_path - > '+tmp_path);    
    var fileId = new ObjectID();        
    this.db.open(function(err,client) {
        if(!err) {                
            var gridStore = new GridStore(client, fileId, 'w', {root:'csv'});
            //console.log(data);
            gridStore.open(function(err, gridStore) {
                gridStore.writeFile(tmp_path, function(err, doc) {                
                    if(!err) {
                        res.json(doc);                                                                
                    }
                    client.close();
                });
            });
        }
    });
};


exports.CSVMongo = CSVMongo;
