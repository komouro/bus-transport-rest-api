// Global variables to store current results and result flags
var current_results;
var current_result_flags;

// Function to be executed after data update
function AfterUpdate($scope) {
  $scope.$apply(function () {
    // Update the message to inform the user about the update
    $scope.Updated = "Information has been updated. Press 'Show' to see the results.";
    // Set the loading time flag to false after the update is completed
    $scope.LoadingTime = false;
  });
  // Log the successful communication with the back-end
  console.log("Communication with back-end was a success.");
}

// Function to prepare the results for output
function PrepareResultsForOutput(tmp, $scope) {
  // Extract necessary data from the response
  const best_route_length = tmp[0]["Best route length"];
  const source = tmp[0]["Nearest Station (Src)"];
  const destination = tmp[0]["Nearest Station (Dst)"];

  // Check if there are no routes found
  if (best_route_length == "0") {
    // Prepare message for no routes found case
    var msg = "Source and Destination are too close to each other and to station " + tmp[0]["Path by name"] + " with ID " + source;
    msg = msg + ". You are advised not to use any bus lines.";
    empty_array = new Array();
    current_results = new Array();
    current_result_flags = new Array();
    current_results.push(msg);
    current_results.push(empty_array);
    current_results.push(empty_array);
    current_result_flags.push(false);
    current_result_flags.push(true);
    current_result_flags.push(true);
  }
  // Check if there are no connections between source and destination
  else if (best_route_length == "-") {
    // Prepare message for no connections found case
    var msg = "No routes found. Source is close to station with ID " + source;
    msg = msg + ". Destination is close to station with ID " + destination;
    msg = msg + ". You are advised not to use any bus lines.";
    empty_array = new Array();
    current_results = new Array();
    current_result_flags = new Array();
    current_results.push(msg);
    current_results.push(empty_array);
    current_results.push(empty_array);
    current_result_flags.push(false);
    current_result_flags.push(true);
    current_result_flags.push(true);
  } else {
    // Prepare data for routes with connections case
    var best_route = new Array();
    best_route.push(best_route_length);
    best_route.push(tmp[0]["Path by station id"]);
    best_route.push(tmp[0]["Path by name"]);
    best_route.push(tmp[0]["Path by coordinates"]);

    const total_alternative_routes = tmp[1]["Number of routes"];
    var alternative_routes = tmp[1]["Routes"];
    const size = Number(total_alternative_routes);
    var alter_res = new Array();
    for (var i = 0; i < size; i++) {
      var h = new Array(3);
      h[0] = alternative_routes[i]["Path by station id"];
      h[1] = alternative_routes[i]["Path by name"];
      h[2] = alternative_routes[i]["Path by coordinates"];
      alter_res.push(h);
    }

    // Prepare the success message and data for display
    var msg = "Between the source (station ID " + source + ") and the destination (station ID " + destination + ") " + total_alternative_routes + " routes were found.";
    msg = msg + " The route with the minimum number of intermediate stopping points is also provided.";
    current_results = new Array();
    current_result_flags = new Array();
    current_results.push(msg);
    current_results.push(best_route);
    current_results.push(alter_res);
    current_result_flags.push(false);
    current_result_flags.push(false);
    current_result_flags.push(false);
  }

  // Execute the AfterUpdate function to update the UI
  AfterUpdate($scope);
}

// Function to make an HTTP request to the back-end
function Http_Request(params, $scope) {
  var url_init = "http://localhost:8765/Mouro/api/ConnectionRoutes";
  var url = url_init + "/" + params[0] + "/" + params[1] + "/" + params[2] + "/" + params[3] + "/" + params[4] + "/" + params[5];
  method = "GET";
  async_flag = true;
  var xhttp = new XMLHttpRequest();
  console.log(url);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var tmp = JSON.parse(this.responseText);
      // Call the function to prepare results for output
      PrepareResultsForOutput(tmp, $scope);
    }
  };
  xhttp.open(method, url, async_flag);
  xhttp.send();
}

// Function to extract parameters from the URL and send an HTTP request
function Get_Parameters_And_Send_Request(our_loc, $scope) {
  var tmp_A = our_loc.split("?");
  var tmp_B = tmp_A[1];
  var tmp_C = tmp_B.split("&");
  var params = new Array();
  for (var j = 0; j < 6; j++) {
    var tmp_D = tmp_C[j].split("=");
    params.push(tmp_D[1]);
  }
  console.log(params);
  // Call the HTTP request function with the extracted parameters
  Http_Request(params, $scope);
}

// AngularJS app and controller definition
var app_output = angular.module("ConnectionRoutesOutputPage", []);
app_output.controller('ConnectionRoutesOutputController', function ($scope, $window) {
  // Get the current location (URL)
  const our_loc = $window.location.href;
  // Initialize variables and flags
  $scope.result = new Array();
  current_results = new Array();
  current_result_flags = new Array();
  $scope.hidden_flag_msg = true;
  $scope.hidden_flag_best = true;
  $scope.hidden_flag_alternative = true;
  $scope.LoadingTime = true;
  $scope.Updated = "Please wait. Loading updated information...";
  // Call the function to get parameters and send the HTTP request
  Get_Parameters_And_Send_Request(our_loc, $scope);

  // Navigation functions for different pages
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

  // Function to make the request again
  $scope.MakeTheRequest = function () {
    $scope.result = new Array();
    current_results = new Array();
    current_result_flags = new Array();
    $scope.hidden_flag_msg = true;
    $scope.hidden_flag_best = true;
    $scope.hidden_flag_alternative = true;
    $scope.LoadingTime = true;
    $scope.Updated = "Please wait. Loading updated information...";
    // Call the function to get parameters and send the HTTP request
    Get_Parameters_And_Send_Request(our_loc, $scope);
  }

  // Function to show the table
  $scope.ShowTable = function () {
    // Assign the current results to the scope variables for display
    $scope.Result_msg = current_results[0];
    $scope.result_best = current_results[1];
    $scope.result_alternative = current_results[2];
    $scope.hidden_flag_msg = current_result_flags[0];
    $scope.hidden_flag_best = current_result_flags[1];
    $scope.hidden_flag_alternative = current_result_flags[2];
    $scope.Updated = "";
  }

  // Function to hide the table
  $scope.HideTable = function () {
    $scope.result = new Array();
    $scope.hidden_flag_msg = true;
    $scope.hidden_flag_best = true;
    $scope.hidden_flag_alternative = true;
    $scope.Updated = "Information has been hidden. Press 'Show' to reveal the results.";
  }
});

