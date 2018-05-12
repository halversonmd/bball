(function () {
    'use strict';
   
    var app = angular.module('app', [])
    app.controller('ViewController', function($scope, $http) {
      $scope.load_data = function(date='') {
        $http.get("/api/fant_data"+date, {headers:{'Cache-Control': 'no-cache'}})
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
        if (col === 'pos'){
          var dropdown = $('.pos_col')
          var all_checkbox = $('#pos_all')
          var filt_arr = $scope.filtered_data
        } else if (col == 'team'){
          var dropdown = $('.team_col')
          var all_checkbox = $('#team_all')
          var filt_arr = $scope.filtered_team_data
        }
        if (all_checkbox[0].checked){
          angular.forEach(dropdown, function(item){
            var id = $(item).attr('id')
            var idx = filt_arr.indexOf(id);
          if (idx === -1) {
            filt_arr.push(id);
          }
          });
          dropdown.prop("checked", true);
        } else {
          angular.forEach(dropdown, function(item){
            var id = $(item).attr('id')
            var idx = filt_arr.indexOf(id);
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

      $scope.init_datepicker = function(){
        $( "#date_input" ).datepicker({
          format: "yyyy-mm-dd",
          autoclose: true
        }).on('changeDate', function(ev){
           var date = $("#date_input")
           var date_str = date.datepicker('getDate').toISOString().substring(0, 10);
           var date_query = "?date="+date_str
           $scope.load_data(date=date_query)
        });
      };


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

      $scope.object = {fant_missing_data: null, woba_fant_data: null};
      $scope.sortType = 'total_woba';
      $scope.sortProbType = 'prob_fant_abov_avg';
      $scope.sortReverse  = true;
      $scope.search_table = '';
      
      $scope.load_data();
      $scope.last_updates();
      $scope.init_datepicker();

    
    });
    app.filter('custom_filter', function($filter) {

       return function(input, scope) {

        var output = [];

        angular.forEach(input, function(item) {

            var key = item['batter_pos'];

            if(scope.filtered_data.indexOf(key) > -1) {

                output.push(item);
              }
          });
        return output;
        }
    });
    app.filter('team_filter', function($filter) {


       return function(input, scope) {

        var output = [];

        angular.forEach(input, function(item) {

            var key = item['batter_team'];

            if(scope.filtered_team_data.indexOf(key) > -1) {

                output.push(item);
              }
          });
        return output;
        }
    });
    app.filter('unique', function() {

       return function(collection, keyname) {

          var output = [], 
              keys = [];

          angular.forEach(collection, function(item) {

              var key = item[keyname];

              if(keys.indexOf(key) === -1) {

                  keys.push(key); 

                  output.push(item);
              }
          });
          return output;
       };
    });

})();
