function XMLView(xml_mongo) {
  this.xml_mongo = xml_mongo;
  //this.basepath = '/node';
};

XMLView.prototype = {
    listItems: function(req,res) {
        this.xml_mongo.findAll(function (err, docs) {
            if(err) {
                console.log(err);                
                client.close();  
            } else {
                var file_list = [];
                docs.forEach(function(entry) {
                    file_list.push(entry);
                });
                
                res.json(file_list);
                console.log('Return');
                this.db.close();     
            }
        });
    },
    
}

exports.XMLView = XMLView;
