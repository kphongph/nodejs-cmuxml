angular.module('test', ['mongoService','ace']).
    config(function($routeProvider) {
        $routeProvider.
            when('/', {controller:fileCtrl, templateUrl:'/static/filelist.html'}).
             when('/detail/:fileId', {controller:detailCtrl, templateUrl:'/static/detail.html'});
});

function fileCtrl($scope, File) {    
    $scope.list_file = File.query(); 
}     

function detailCtrl($scope, $location,  $routeParams, File){
    var self = this;
    
    File.get({id: $routeParams.fileId}, function(file) {
         self.original = file;
         $scope.file = new File(self.original);
         file.content(function(content) {
             $scope.content=content.content;
         });    
    });
        
    $scope.save = function() {        
        $scope.file.$save_content({content:$scope.content},function(result){
            console.log(result);
        });
    };
    
} 

/*
function fileCtrl($scope, $http) {
    console.log('Loading');
     $http.get('/mongo/list').
       success(function(data, status, headers, config) {
       console.log('Loaded');   
       $scope.list_file = data.file_list;     
   });
}
*/


