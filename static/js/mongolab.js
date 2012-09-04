angular.module('mongoService', ['ngResource']).
     factory('Filel_ist', function($resource) {
        var Filel_ist = $resource('/mongo/list', {}, {
            query: {method:'GET',isArray:true} 
        });
        return Filel_ist;
});
