// Variables to store the current results and result flags
var current_results;
var current_result_flags;

// Function to be executed after the update from the back-end
function AfterUpdate ($scope) {
  $scope.$apply(function() {
    $scope.Updated = "Information has been updated. Press 'Show' to see the results.";
    $scope.LoadingTime = false;
  });
  console.log("Communication with the back-end was successful.");
}

// Function to prepare the results for output based on the back-end response
function PrepareResultsForOutput(tmp, stationtype, $scope){
  // Extract source and destination arrays from the response
  var source_array = tmp[0]["Source"];
  var destination_array = tmp[0]["Destination"];
  const source_size = source_array.length;
  const destination_size = destination_array.length;
  var error_key = "Error Message";
  if (error_key in source_array[0]){
    console.log("Back-end sent back an error message about the station type.")
  }
  else{
    // Process the response based on the selected station type
    console.log("Back-end sent a positive response.")
    if (stationtype == "source"){
      // For source type, check if there are no stations available
      if (source_size == 0){
        var msg = "All stations are under raining conditions. No bus lines can be used.";
        current_results = new Array();
        current_result_flags = new Array();
        empty_array = new Array();
        current_results.push(msg);
        current_results.push(empty_array);
        current_results.push(empty_array);
        current_result_flags.push(false);
        current_result_flags.push(true);
        current_result_flags.push(true);
      }
      else{
        // Process the source stations data and set result flags
        var tmp_A = new Array();
        for (var i = 0; i < source_size; i++){
          var h = new Array(5);
          h[0] = source_array[i]["origin_id"];
          h[1] = source_array[i]["origin_name"];
          h[2] = source_array[i]["origin_coords"];
          var how_many_bus_lines = source_array[i]["bus_lines"].length;
          var bus_lines = "";
          var bus_lines_array = source_array[i]["bus_lines"]
          for (var w = 0; w < how_many_bus_lines-1; w++){
            bus_lines = bus_lines + bus_lines_array[w] + ", ";
          }
          bus_lines = bus_lines + bus_lines_array[how_many_bus_lines-1];
          h[3] = bus_lines;
          h[4] = source_array[i]["Explanation"];
          tmp_A.push(h);
        }
        var msg = "There are " + source_size.toString() + " stations where it is not raining.";
        current_results = new Array();
        current_result_flags = new Array();
        empty_array = new Array();
        current_results.push(msg);
        current_results.push(tmp_A);
        current_results.push(empty_array);
        current_result_flags.push(false);
        current_result_flags.push(false);
        current_result_flags.push(true);
      }
    }
    else if (stationtype == "destination"){
      // For destination type, check if there are no reachable stations
      if (destination_size == 0){
        var msg = "There are no reachable stations from points where it is not raining.";
        current_results = new Array();
        current_result_flags = new Array();
        empty_array = new Array();
        current_results.push(msg);
        current_results.push(empty_array);
        current_results.push(empty_array);
        current_result_flags.push(false);
        current_result_flags.push(true);
        current_result_flags.push(true);
      }
      else{
        // Process the destination stations data and set result flags
        var tmp_B = new Array();
        for (var j = 0; j < destination_size; j++){
          var h = new Array(5);
          h[0] = destination_array[j]["destination_id"];
          h[1] = destination_array[j]["destination_name"];
          h[2] = destination_array[j]["destination_coords"];
          var how_many_bus_lines = destination_array[j]["bus_lines"].length;
          var bus_lines = "";
          var bus_lines_array = destination_array[j]["bus_lines"]
          for (var w = 0; w < how_many_bus_lines-1; w++){
            bus_lines = bus_lines + bus_lines_array[w] + ", ";
          }
          bus_lines = bus_lines + bus_lines_array[how_many_bus_lines-1];
          h[3] = bus_lines;
          h[4] = destination_array[j]["Explanation"];
          tmp_B.push(h);
        }
        var msg = "There are " + destination_size.toString() + " reachable stations from points where it is not raining.";
        current_results = new Array();
        current_result_flags = new Array();
        empty_array = new Array();
        current_results.push(msg);
        current_results.push(empty_array);
        current_results.push(tmp_B);
        current_result_flags.push(false);
        current_result_flags.push(true);
        current_result_flags.push(false);
      }
    }
    else{
      // For both station type, check if there are no source stations
      if (source_size == 0){
        var msg = "All stations are under raining conditions. No bus lines can be used.";
        current_results = new Array();
        current_result_flags = new Array();
        empty_array = new Array();
        current_results.push(msg);
        current_results.push(empty_array);
        current_results.push(empty_array);
        current_result_flags.push(false);
        current_result_flags.push(true);
        current_result_flags.push(true);
      }
      else{
        // Process both source and destination stations data and set result flags
        var tmp_A = new Array();
        for (var i = 0; i < source_size; i++){
          var h = new Array(5);
          h[0] = source_array[i]["origin_id"];
          h[1] = source_array[i]["origin_name"];
          h[2] = source_array[i]["origin_coords"];
          var how_many_bus_lines = source_array[i]["bus_lines"].length;
          var bus_lines = "";
          var bus_lines_array = source_array[i]["bus_lines"]
          for (var w = 0; w < how_many_bus_lines-1; w++){
            bus_lines = bus_lines + bus_lines_array[w] + ", ";
          }
          bus_lines = bus_lines + bus_lines_array[how_many_bus_lines-1];
          h[3] = bus_lines;
          h[4] = source_array[i]["Explanation"];
          tmp_A.push(h);
        }
        var msg_A = "There are " + source_size.toString() + " stations where it is not raining.";
        if (destination_size == 0){
          var msg_B = "There are no reachable stations from points where it is not raining.";
          var tmp_B = new Array();
          var check_flag_for_dst = true;
        }
        else{
          var tmp_B = new Array();
          for (var i = 0; i < destination_size; i++){
            var h = new Array(5);
            h[0] = destination_array[i]["destination_id"];
            h[1] = destination_array[i]["destination_name"];
            h[2] = destination_array[i]["destination_coords"];
            var how_many_bus_lines = destination_array[i]["bus_lines"].length;
            var bus_lines = "";
            var bus_lines_array = destination_array[i]["bus_lines"]
            for (var u = 0; u < how_many_bus_lines-1; u++){
              bus_lines = bus_lines + bus_lines_array[u] + ", ";
            }
            bus_lines = bus_lines + bus_lines_array[how_many_bus_lines-1];
            h[3] = bus_lines;
            h[4] = destination_array[i]["Explanation"];
            tmp_B.push(h);
          }
          var msg_B = "There are " + destination_size.toString() + " reachable stations from points where it is not raining.";
          var check_flag_for_dst = false;
        }
        var msg = msg_A + " " + msg_B;
        current_results = new Array();
        current_result_flags = new Array();
        current_results.push(msg);
        current_results.push(tmp_A);
        current_results.push(tmp_B);
        current_result_flags.push(false);
        current_result_flags.push(false);
        current_result_flags.push(check_flag_for_dst);
      }
    }
  }
  // Call the function to update the scope after processing the results
  AfterUpdate($scope);
}

// Function to make the HTTP request to the back-end
function Http_Request (params, $scope) {
  var url_init = "http://localhost:8765/Mouro/api/WeatherConditions";
  var url = url_init + "/" + params[0] + "/" + params[1];
  const stationtype = params[0];
  method = "GET";
  async_flag = true;
  var xhttp = new XMLHttpRequest();
  console.log(url);
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var tmp = JSON.parse(this.responseText);
        // Call the function to prepare the results for output
        PrepareResultsForOutput(tmp, stationtype, $scope);
     }
  };
  xhttp.open(method, url, async_flag);
  xhttp.send();
}

// Function to extract parameters and send the HTTP request
function Get_Parameters_And_Send_Request (our_loc, $scope) {
  var tmp_A = our_loc.split("?");
  var tmp_B = tmp_A[1];
  var tmp_C = tmp_B.split("&");
  var params = new Array();
  for (var j = 0; j < 2; j++){
    var tmp_D = tmp_C[j].split("=");
    params.push(tmp_D[1]);
  }
  console.log(params);
  // Call the function to make the HTTP request
  Http_Request(params, $scope);
}

// AngularJS module and controller for the WeatherConditionsOutputPage
var app_output = angular.module("WeatherConditionsOutputPage", []);
app_output.controller('WeatherConditionsOutputController',  function($scope, $window) {
  const our_loc = $window.location.href;
  $scope.result = new Array();
  current_results = new Array();
  current_result_flags = new Array();
  $scope.hidden_flag_msg = true;
  $scope.hidden_flag_src = true;
  $scope.hidden_flag_dst = true;
  $scope.LoadingTime = true;
  $scope.Updated = "Please wait. Loading updated information...";
  // Call the function to get parameters and send the HTTP request
  Get_Parameters_And_Send_Request(our_loc, $scope);
  $scope.EnterHomePage = function () {
    $window.location.href = "../AppHome/Home.html";
  }
  $scope.EnterNearestStationsPage = function () {
    $window.location.href = "../NearestStations/NearestStations.html";
  }
  $scope.EnterCommonPathPage = function () {
    $window.location.href = "../ConnectionRoutes/ConnectionRoutes.html";
  }
  $scope.EnterWeatherConditionsPage = function () {
    $window.location.href = "../WeatherConditions/WeatherConditions.html";
  }
  $scope.MakeTheRequest = function () {
    $scope.result = new Array();
    current_results = new Array();
    current_result_flags = new Array();
    $scope.hidden_flag_msg = true;
    $scope.hidden_flag_src = true;
    $scope.hidden_flag_dst = true;
    $scope.LoadingTime = true;
    $scope.Updated = "Please wait. Loading updated information...";
    // Call the function to get parameters and send the HTTP request
    Get_Parameters_And_Send_Request(our_loc, $scope);
  }
  $scope.ShowTable = function () {
    // Show the table with results based on result flags
    $scope.Result_msg = current_results[0];
    $scope.result_src = current_results[1];
    $scope.result_dst = current_results[2];
    $scope.hidden_flag_msg = current_result_flags[0];
    $scope.hidden_flag_src = current_result_flags[1];
    $scope.hidden_flag_dst = current_result_flags[2];
    $scope.Updated = "";
  }
  $scope.HideTable = function () {
    // Hide the table with results
    $scope.result = new Array();
    $scope.hidden_flag_msg = true;
    $scope.hidden_flag_src = true;
    $scope.hidden_flag_dst = true;
    $scope.Updated = "Information has been hidden. Press 'Show' to reveal the results.";
  }
});

