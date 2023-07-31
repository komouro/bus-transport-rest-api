// Creating an AngularJS module named "NearestStationsPage"
var app = angular.module("NearestStationsPage", []);

// Defining the NearestStationsController
app.controller('NearestStationsController',  function($scope, $window) {
  // Initialize variables for input fields
  $scope.lat = null;
  $scope.lon = null;
  $scope.num = null;
  $scope.service = null;
  
  // Options for the service type dropdown
  $scope.service_options = ["local", "web"]
  
  // Function to navigate to the Home page
  $scope.EnterHomePage = function () {
    $window.location.href = "../AppHome/Home.html";
  }
  
  // Function to navigate to the Nearest Stations page
  $scope.EnterNearestStationsPage = function () {
    $window.location.href = "../NearestStations/NearestStations.html";
  }
  
  // Function to navigate to the Connection Routes page
  $scope.EnterCommonPathPage = function () {
    $window.location.href = "../ConnectionRoutes/ConnectionRoutes.html";
  }
  
  // Function to navigate to the Weather Conditions page
  $scope.EnterWeatherConditionsPage = function () {
    $window.location.href = "../WeatherConditions/WeatherConditions.html";
  }
  
  // Function to handle the submission of data
  $scope.SubmissionReady = function () {
    const x = $scope.lat;
    const y = $scope.lon;
    const c = $scope.num;
    const s = $scope.service;
    
    // Check if all parameters are provided
    if (x == null || y == null || c == null || s == null) {
      console.log("All parameters are required.");
    }
    else {
      // Create a query string with the input data
      var params = "?x=" + x.toString() + "&y=" + y.toString() + "&c=" + c.toString() + "&s=" + s;
      // Redirect to the Nearest Stations Output page with the query string
      $window.location.href = "../NearestStationsOutput/NearestStationsOutput.html" + params;
    }
  }
  
  // Function to clear the input fields
  $scope.ClearSlots = function () {
    $scope.lat = null;
    $scope.lon = null;
    $scope.num = null;
    $scope.service = null;
  }
});

