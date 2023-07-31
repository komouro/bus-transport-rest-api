// Create an AngularJS module named "HomePage"
var app = angular.module("HomePage", []);

// Define the "HomeController" controller within the "HomePage" module
app.controller('HomeController', function ($scope, $window) {
  
  // Function to navigate to the "Home.html" page
  $scope.EnterHomePage = function () {
    $window.location.href = "../AppHome/Home.html";
  }

  // Function to navigate to the "NearestStations.html" page
  $scope.EnterNearestStationsPage = function () {
    $window.location.href = "../NearestStations/NearestStations.html";
  }

  // Function to navigate to the "ConnectionRoutes.html" page
  $scope.EnterCommonPathPage = function () {
    $window.location.href = "../ConnectionRoutes/ConnectionRoutes.html";
  }

  // Function to navigate to the "WeatherConditions.html" page
  $scope.EnterWeatherConditionsPage = function () {
    $window.location.href = "../WeatherConditions/WeatherConditions.html";
  }
});

