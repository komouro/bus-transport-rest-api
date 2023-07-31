// Array to store the current results fetched from the backend
var current_results;

// Function to handle the updates after making a request to the backend
function AfterUpdate ($scope) {
  $scope.$apply(function() {
    // Update the information message and loading status
    $scope.Updated = "Information has been updated. Press 'Show' to see the results.";
    $scope.LoadingTime = false;
  });
  console.log("Communication with the back-end was a success.");
}

// Function to send an HTTP request to the backend
function Http_Request (params, $scope) {
  // Set up the URL for the HTTP request
  var url_init = "http://localhost:8765/Mouro/api/NearestStations";
  var url = url_init + "/" + params[0] + "/" + params[1] + "/" + params[2] + "/" + params[3];
  var method = "GET";
  var async_flag = true;
  var xhttp = new XMLHttpRequest();
  console.log(url);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Parse the JSON response from the backend and process the data
      var tmp = JSON.parse(this.responseText);
      var size = tmp.length;
      console.log(size);
      for (var i = 0; i < size; i++){
        // Create an array to store each station's information and add it to the current_results array
        var h = new Array(4);
        h[0] = tmp[i]["Station id"];
        h[1] = tmp[i]["Station name"];
        h[2] = tmp[i]["Station lat"];
        h[3] = tmp[i]["Station lon"];
        current_results.push(h);
      }
      AfterUpdate($scope);
    }
  };
  xhttp.open(method, url, async_flag);
  xhttp.send();
}

// Function to extract parameters from the URL and send the request to the backend
function Get_Parameters_And_Send_Request (our_loc, $scope) {
  var tmp_A = our_loc.split("?");
  var tmp_B = tmp_A[1];
  var tmp_C = tmp_B.split("&");
  var params = new Array();
  for (var j = 0; j < 4; j++){
    var tmp_D = tmp_C[j].split("=");
    params.push(tmp_D[1]);
  }
  console.log(params);
  Http_Request(params, $scope);
}

// AngularJS module and controller for the NearestStationsOutputPage
var app_output = angular.module("NearestStationsOutputPage", []);
app_output.controller('NearestStationsOutputController',  function($scope, $window) {
  // Get the current URL
  const our_loc = $window.location.href;
  // Initialize arrays and flags
  $scope.result = new Array();
  current_results = new Array();
  $scope.hidden_flag = true;
  $scope.LoadingTime = true;
  $scope.Updated = "Please wait. Loading updated information...";
  // Make the initial request on page load
  Get_Parameters_And_Send_Request(our_loc, $scope);
  
  // Navigation functions to redirect to other pages
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
  
  // Function to make a new request
  $scope.MakeTheRequest = function () {
    // Reset arrays and flags for a new request
    $scope.result = new Array();
    current_results = new Array();
    $scope.hidden_flag = true;
    $scope.LoadingTime = true;
    $scope.Updated = "Please wait. Loading updated information...";
    // Send the new request
    Get_Parameters_And_Send_Request(our_loc, $scope);
  }
  
  // Function to show the result table
  $scope.ShowTable = function () {
    $scope.hidden_flag = false;
    $scope.result = current_results;
    $scope.Updated = "";
  }
  
  // Function to hide the result table
  $scope.HideTable = function () {
    $scope.result = new Array();
    $scope.hidden_flag = true;
    $scope.Updated = "Information has been hidden. Press 'Show' to reveal the results.";
  }
});

