// AngularJS module and controller for the WeatherConditionsPage
var app = angular.module("WeatherConditionsPage", []);
app.controller('WeatherConditionsController',  function($scope, $window) {
  // Initialize variables for station type and service type
  $scope.stationtype = null;
  $scope.service = null;
  
  // Options for service type dropdown menu
  $scope.service_options = ["local", "web"];
  
  // Options for station type dropdown menu
  $scope.station_options = ["source", "destination", "both"];
  
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
  
  // Function to make the HTTP request
  $scope.MakeTheRequest = function () {
    const t = $scope.stationtype;
    const s = $scope.service;
    if (t == null || s == null) {
      console.log("All parameters are required.");
    }
    else {
      // Create the URL parameters based on the selected options
      var params = "?t=" + t + "&s=" + s;
      console.log(params);
      var new_window = "../WeatherConditionsOutput/WeatherConditionsOutput.html" + params;
      console.log(new_window);
      // Redirect to the WeatherConditionsOutput page with the selected parameters
      $window.location.href = "../WeatherConditionsOutput/WeatherConditionsOutput.html" + params;
    }
  }
  
  // Function to clear the selected options in the dropdown menus
  $scope.ClearSlots = function () {
    $scope.stationtype = null;
    $scope.service = null;
  }
});

