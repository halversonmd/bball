(function () {
    'use strict';
   
    var app = angular.module('app', [])
    app.controller('ViewController', function($scope, $http) {
      $scope.load_data = function() {
        
        $http.get("/api/woba_data", {headers:{'Cache-Control': 'no-cache'}})
        .then(function(response) {

          if (response.data == 'data_not_updated'){
            $scope.object.woba_missing_data = "Data still processing for today";
          }else{
            $scope.woba_data = response.data;
            $scope.object.woba_missing_data = null;
            $scope.last_updates();
          };

        })
        $http.get("/api/fant_data", {headers:{'Cache-Control': 'no-cache'}})
        .then(function(response) {
          if (response.data == 'data_not_updated'){
            $scope.object.fant_missing_data = "Data still processing for today";
          }else{
            $scope.woba_fant_data = response.data;
            $scope.object.fant_missing_data = null;
            $scope.last_updates();
          };

        })
      };

      $scope.last_updates = function() {
         $http.get("/api/last_update", {headers:{'Cache-Control': 'no-cache'}})
         .then(function(response) {
          
          $scope.object.last_update_prob = response.data['last_update_prob']
          $scope.object.last_update_woba = response.data['last_update_woba']
         });

      };
      
      // On load
      $scope.object = {fant_missing_data: null, woba_fant_data: null};
      $scope.sortType = 'total_woba';
      $scope.sortFantType = 'total_woba';
      $scope.sortReverse  = true;
      $scope.search_table = '';
      $scope.search_fant_table = '';
      $scope.load_data();
      $scope.last_updates();

    
    });
    
})();
    