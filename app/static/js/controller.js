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
      $scope.debug = function() {
         console.log($scope.sortType)

      };
      
      // On load
      $scope.batter_pos_hide = false
      $scope.batter_team_hide = false
      $scope.game_time_hide = false
      $scope.batter_hide = false
      $scope.lineup_confirmed_hide = false
      $scope.b_tot_woba_hide = true
      $scope.b_hand_hide = false
      $scope.batter_venue_hide = false
      $scope.batter_venue_woba_hide = true
      $scope.batter_salary_hide = false
      $scope.bwaph_hide = false
      $scope.p_tot_woba_hide = true
      $scope.pitcher_hide = false
      $scope.p_hand_hide = false
      $scope.pwabh_hide = false
      $scope.pitcher_salary_hide = false
      $scope.salary_over_k_hide = false
      $scope.total_woba_hide = false
      $scope.object = {fant_missing_data: null, woba_fant_data: null};
      $scope.sortType = 'total_woba';
      $scope.sortProbType = 'prob_fant_abov_avg';
      $scope.sortReverse  = true;
      $scope.search_table = '';
      $scope.search_fant_table = '';
      $scope.load_data();
      $scope.last_updates();

    
    });
    
})();
    