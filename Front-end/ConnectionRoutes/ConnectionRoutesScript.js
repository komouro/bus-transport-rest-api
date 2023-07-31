// Create an AngularJS module named "ConnectionRoutesPage"
var app = angular.module("ConnectionRoutesPage", []);

// Define the "ConnectionRoutesController" controller within the "ConnectionRoutesPage" module
app.controller('ConnectionRoutesController', function ($scope, $window) {
  
  // Initialize variables to store user input
  $scope.lat_src = null;
  $scope.lon_src = null;
  $scope.lat_dst = null;
  $scope.lon_dst = null;
  $scope.num = null;
  $scope.service = null;

  // Options for the "Service type" select input
  $scope.service_options = ["local", "web"];

  // Function to navigate to the "Home.html" page
  $scope.EnterHomePage = function () {
    $window.location.href = "../AppHome/Home.html";
  }

  // Function to navigate to the "NearestStations.html" page
  $scope.EnterNearestStationsPage = function () {
    $window.location.href = "../NearestStations/NearestStations.html";
  }

  // Function to navigate to the "ConnectionRoutes.html" page (current page)
  $scope.EnterCommonPathPage = function () {
    $window.location.href = "../ConnectionRoutes/ConnectionRoutes.html";
  }

  // Function to navigate to the "WeatherConditions.html" page
  $scope.EnterWeatherConditionsPage = function () {
    $window.location.href = "../WeatherConditions/WeatherConditions.html";
  }

  // Function to make the request based on user input
  $scope.MakeTheRequest = function () {
    const x1 = $scope.lat_src;
    const y1 = $scope.lon_src;
    const x2 = $scope.lat_dst;
    const y2 = $scope.lon_dst;
    const c = $scope.num;
    const s = $scope.service;

    // Check if all parameters are provided
    if (x1 == null || x2 == null || y1 == null || y2 == null || c == null || s == null) {
      console.log("All parameters are required.");
    } else {
      // Build the query string with user input and redirect to the output page
      var params = "?x1=" + x1.toString() + "&y1=" + y1.toString() + "&x2=" + x2.toString() + "&y2=" + y2.toString() + "&c=" + c.toString() + "&s=" + s;
      $window.location.href = "../ConnectionRoutesOutput/ConnectionRoutesOutput.html" + params;
    }
  }

  // Function to clear all input slots
  $scope.ClearSlots = function () {
    $scope.lat_src = null;
    $scope.lon_src = null;
    $scope.lat_dst = null;
    $scope.lon_dst = null;
    $scope.num = null;
    $scope.service = null;
  }
});

