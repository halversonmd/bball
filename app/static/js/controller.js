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
            $scope.filtered_data = []
            $scope.filtered_team_data = []
            for (var i = 0; i < $scope.woba_fant_data.length; i++){
              if ($scope.filtered_data.indexOf($scope.woba_fant_data[i]['batter_pos']) === -1){
                $scope.filtered_data.push($scope.woba_fant_data[i]['batter_pos'])
              };
              if ($scope.filtered_team_data.indexOf($scope.woba_fant_data[i]['batter_team']) === -1){
                $scope.filtered_team_data.push($scope.woba_fant_data[i]['batter_team'])
              }
            }
            // $scope.debug()
            $scope.object.fant_missing_data = null;
            $scope.last_updates();
          };

        })
      };

      $scope.checkAll = function(e, col) {
        console.log(col)
        if (col === 'pos'){
          var dropdown = $('.pos_col')
          var all_checkbox = $('#pos_all')
          var filt_arr = $scope.filtered_data
        } else if (col == 'team'){
          var dropdown = $('.team_col')
          var all_checkbox = $('#team_all')
          var filt_arr = $scope.filtered_team_data
        }
        // console.log(all_checkbox[0].checked)
        if (all_checkbox[0].checked){
          angular.forEach(dropdown, function(item){
            var id = $(item).attr('id')
            var idx = filt_arr.indexOf(id);
          // Is currently selected
          if (idx === -1) {
            filt_arr.push(id);
          }
          });
          dropdown.prop("checked", true);
        } else {
          angular.forEach(dropdown, function(item){
            var id = $(item).attr('id')
            var idx = filt_arr.indexOf(id);
            // Is currently selected
            if (idx > -1) {
              filt_arr.splice(idx, 1);
            }
          });
          dropdown.prop("checked", false);
          }
        };
        
      $scope.last_updates = function() {
         $http.get("/api/last_update", {headers:{'Cache-Control': 'no-cache'}})
         .then(function(response) {
          
          $scope.object.last_update_prob = response.data['last_update_prob']
          $scope.object.last_update_woba = response.data['last_update_woba']
         });

      };
      $scope.debug = function() {
         console.log($scope.filtered_data)

      };

      $scope.table_filter = function(val){
        return 
      }


      $scope.toggleSelection = function toggleSelection(value, col) {
        if (col === 'pos'){
          var filt_arr = $scope.filtered_data
        } else if (col == 'team'){
          var filt_arr = $scope.filtered_team_data
        }
        var idx = filt_arr.indexOf(value);
        // Is currently selected
        if (idx > -1) {
          filt_arr.splice(idx, 1);
        }
        // Is newly selected
        else {
          filt_arr.push(value);
        }
      };
      $scope.filterByCol = function(row) {
        return ($scope.woba_fant_data[row.index]['batter_team']);
      };
      $scope.dropdownClicks = function(e) {
        var parent_dropdown = e.target.parentElement
        $(parent_dropdown).toggleClass("open");
      };
      $scope.close_dropdowns = function(e) {
        var target = $(e.target)
        if (!target.parents('.dropdown').length){
          $('.dropdown').removeClass('open')
        };
      }
      
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
      
      $scope.load_data();
      $scope.last_updates();

    
    });
    app.filter('custom_filter', function($filter) {
       // we will return a function which will take in a collection
       // and a keyname
       return function(input, scope) {
        
        var output = [];
        
        angular.forEach(input, function(item) {
            // we check to see whether our object exists
            var key = item['batter_pos'];
            // if it's not already part of our keys array
            if(scope.filtered_data.indexOf(key) > -1) {
                // push this item to our final output array
                output.push(item);
              }
          });
        return output;
        }
    });
    app.filter('team_filter', function($filter) {
       // we will return a function which will take in a collection
       // and a keyname
       return function(input, scope) {
        
        var output = [];
        
        angular.forEach(input, function(item) {
            // we check to see whether our object exists
            var key = item['batter_team'];
            // if it's not already part of our keys array
            if(scope.filtered_team_data.indexOf(key) > -1) {
                // push this item to our final output array
                output.push(item);
              }
          });
        return output;
        }
    });
    app.filter('unique', function() {
       // we will return a function which will take in a collection
       // and a keyname
       return function(collection, keyname) {
          // we define our output and keys array;
          var output = [], 
              keys = [];
          
          // we utilize angular's foreach function
          // this takes in our original collection and an iterator function
          angular.forEach(collection, function(item) {
              // we check to see whether our object exists
              var key = item[keyname];
              // if it's not already part of our keys array
              if(keys.indexOf(key) === -1) {
                  // add it to our keys array
                  keys.push(key); 
                  // push this item to our final output array
                  output.push(item);
              }
          });
          // return our array which should be devoid of
          // any duplicates
          return output;
       };
    });



    
})();
    