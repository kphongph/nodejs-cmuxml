angular.module('mongoService', ['ngResource']).
    factory('File', function($resource){
        var  File  = $resource('/mongo/files/:id', {id:'@_id'}, {
            query: {method:'GET',isArray:true},
            save_content: {method:'POST'}
        });    
        
        File.prototype.content = function(cb) {
            return File.get({id: this._id,content:true}, function(content) {
                cb(content);
            });
        };                     
        return File;
});



