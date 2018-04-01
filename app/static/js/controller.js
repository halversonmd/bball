(function () {
    'use strict';
   
    var app = angular.module('app', [])
    app.controller('ViewController', function($scope, $http) {
      $scope.load_data = function() {
        
        $http.get("/api/woba_data", {headers:{'Cache-Control': 'no-cache'}})
        .then(function(response) {

          if (response.data == 'data_not_updated'){
            $scope.woba_missing_data = "Data still processing for today";
          };
          $scope.woba_data = response.data;
          $scope.woba_missing_data = null;

        })
        $http.get("/api/fant_data", {headers:{'Cache-Control': 'no-cache'}})
        .then(function(response) {
          if (response.data == 'data_not_updated'){
            $scope.fant_missing_data = "Data still processing for today";
          };
          $scope.woba_fant_data = response.data;
          $scope.fant_missing_data = null;

        })
      };
      
      // On load
      $scope.woba_fant_data = null;
      $scope.fant_missing_data = null;
      $scope.sortType = 'total_woba';
      $scope.sortFantType = 'total_woba';
      $scope.sortReverse  = true;
      $scope.search_table = '';
      $scope.search_fant_table = '';
      $scope.load_data();

    
    });
    
})();
    