(function () {
    'use strict';
   
    var app = angular.module('app', [])
    app.controller('ViewController', function($scope, $http) {
      $scope.load_data = function() {
        
        $http.get("/api/woba_data")
        .then(function(response) {
          $scope.woba_data = response.data;

        })
        $http.get("/api/fant_data")
        .then(function(response) {
          $scope.fant_data = response.data;

        })
      };
      
      // On load
      $scope.sortType = 'total_woba'
      $scope.sortFantType = 'total_woba'
      $scope.sortReverse  = true
      $scope.search_table = ''
      $scope.search_fant_table = ''
      $scope.load_data();

    
    });
    
})();
    