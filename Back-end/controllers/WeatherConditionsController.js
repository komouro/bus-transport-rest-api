// Importing required modules.
const http = require('http');
const https = require('https');
const fs = require('fs');
const util = require('util');

// Constants for the program.
const upper_limit_device_id = 1000; // Upper limit for device IDs.
const total_http_req = 230; // Total number of HTTP requests for weather data.
const rain_conditions = ["Rain", "Thunderstorm"]; // Array of rain conditions to check.
var rawData_helper; // Helper array to store raw data from weather HTTP requests.
var rawData; // Array to store all the raw data (devices, paths, and weather).
var results; // Array to store the final result of weather conditions.
var station_info; // Array to store information about each station.
var num_stations; // Number of total stations.
var neighborhood; // Array to represent the neighborhood connections of stations.
var num_paths; // Number of total paths.
var edges; // Array to represent the edges connecting paths.
var good_stations_no_rain; // Array to store stations where it is not raining and have direct paths.
var reachable_stations; // Array to store stations where it is not raining and can be reached indirectly.
var marked_stations_origin; // Array to mark stations as origin points for paths.
var marked_stations_destination; // Array to mark stations as destination points for paths.


// Function to send the results back as a response to the client.
function StageFive_Return_Result(res){
  res.send(results);
}


// Function to process the results and fix the response for source, destination, or both.
function StageFour_Fix_Result(t, res){
  var source_res = new Array();
  var destination_res = new Array();

  // Handle the case where the result is for source stations.
  if (t == "source"){
    destination_res.push({});
    for (var i = 0; i < upper_limit_device_id; i++){
      if (marked_stations_origin[i] == true){
        var a = (i + 1).toString();
        var b = station_info[i].name;
        var c = station_info[i].coords;
        var d = good_stations_no_rain[i];
        var e = "We can use " + good_stations_no_rain[i].length + " bus line(s) from the station " + b + " where it is not raining.";
        var tmp = {origin_id: a, origin_name: b, origin_coords: c, bus_lines: d, Explanation: e};
        source_res.push(tmp);
      }
    }
  }

  // Handle the case where the result is for destination stations.
  else if (t == "destination"){
    source_res.push({});
    for (var j = 0; j < upper_limit_device_id; j++){
      if (marked_stations_destination[j] == true){
        var a = (j + 1).toString();
        var b = station_info[j].name;
        var c = station_info[j].coords;
        var d = reachable_stations[j];
        var e = "We can use " + reachable_stations[j].length + " bus line(s) to get to station " + b + " by another station where it is not raining.";
        var tmp = {destination_id: a, destination_name: b, destination_coords: c, bus_lines: d, Explanation: e};
        destination_res.push(tmp);
      }
    }
  }

  // Handle the case where the result is for both source and destination stations.
  else if (t == "both"){
    for (var k = 0; k < upper_limit_device_id; k++){
      if (marked_stations_origin[k] == true){
        var a = (k + 1).toString();
        var b = station_info[k].name;
        var c = station_info[k].coords;
        var d = good_stations_no_rain[k];
        var e = "We can use " + good_stations_no_rain[k].length + " bus line(s) from the station " + b + " where it is not raining.";
        var tmp = {origin_id: a, origin_name: b, origin_coords: c, bus_lines: d, Explanation: e};
        source_res.push(tmp);
      }
    }
    for (var u = 0; u < upper_limit_device_id; u++){
      if (marked_stations_destination[u] == true){
        var a = (u + 1).toString();
        var b = station_info[u].name;
        var c = station_info[u].coords;
        var d = reachable_stations[u];
        var e = "We can use " + reachable_stations[u].length + " bus line(s) to get to station " + b + " by another station where it is not raining.";
        var tmp = {destination_id: a, destination_name: b, destination_coords: c, bus_lines: d, Explanation: e};
        destination_res.push(tmp);
      }
    }
  }

  // Handle the case where the type of station is not specified correctly.
  else{
    error_msg = {"Error Message":"Bad type of station (source, destination, both). Please check the parameters of the query."};
    source_res.push(error_msg);
    destination_res.push(error_msg);
  }

  var final_res = {"Source": source_res, "Destination": destination_res};
  results.push(final_res);
  StageFive_Return_Result(res);
}


// Function to process the weather data and find stations where it is not raining and the reachable stations.
function StageThree_no_rain_stations_and_paths(t, res){
  var weather_array = rawData[2];
  var size = weather_array.length;

  // Check if the size of the weather data is correct.
  if (size != num_paths) {
    res.send("Something is wrong with the data. Please try again later.");
    return 0;
  }

  // Initialize arrays to store information about stations.
  good_stations_no_rain = new Array();
  reachable_stations = new Array();
  marked_stations_origin = new Array();
  marked_stations_destination = new Array();
  for (var k = 0; k < upper_limit_device_id; k++){
    good_stations_no_rain.push([]);
    reachable_stations.push([]);
  }

  // Process weather data to find stations where it is not raining and reachable stations.
  for (var i = 0; i < size; i++){
    var tmp = weather_array[i].weather;
    var condition = tmp[0].main;
    var check = rain_conditions.includes(condition);

    // If the condition is not rain, update the information about the stations.
    if (check == false){
      var s = edges[i].origin;
      var d = edges[i].destination;
      good_stations_no_rain[s - 1].push((i + 1).toString());
      reachable_stations[d - 1].push((i + 1).toString());
      marked_stations_origin[s - 1] = true;
      marked_stations_destination[d - 1] = true;
    }
  }

  // Proceed to fix the result and send the response.
  StageFour_Fix_Result(t, res);
}


// Function to prepare the arrays for data processing.
function StageTwo_Prepare_Data_Arrays(t, res, flag){
  if (flag == 0){
    station_info = new Array(upper_limit_device_id);
    var device_array = rawData[0];
    const total_devices = device_array.length;
    num_stations = total_devices;

    // Populate the station_info array with information about each station.
    for (var i = 0; i < total_devices; i++){
      var name = device_array[i].device_Name;
      var id = Number(device_array[i].device_id);
      var lat = device_array[i].lat;
      var lon = device_array[i].lon;
      var coords = "( " + lat + " , " + lon + " )";
      var station = {name: name, coords: coords};
      station_info[id - 1] = station;
    }

    // Proceed to prepare the next set of arrays.
    StageTwo_Prepare_Data_Arrays(t, res, 1);
  }
  else{
    for (var j = 0; j < upper_limit_device_id; j++){
      neighborhood.push([]);
    }
    var paths_array = rawData[1];
    const total_paths = paths_array.length;
    num_paths = total_paths;

    // Populate the neighborhood and edges arrays with path information.
    edges = new Array(num_paths);
    for (var k = 0; k < total_paths; k++){
      var s = Number(paths_array[k].Path_origin_device_id);
      var d = Number(paths_array[k].Path_destination_device_id);
      var c = paths_array[k].Path_id;
      var geitonas = {id: c, neighbor: d};
      neighborhood[s - 1].push(geitonas);
      edges[k] = {origin: s, destination: d};
    }

    // Proceed to find stations with no rain and reachable stations.
    StageThree_no_rain_stations_and_paths(t, res);
  }
}


// Function to read data from files and proceed with data preparation.
function StageOne_Read_Files(file_name, t, res, flag){
  const readFile = util.promisify(fs.readFile);
  function getStuff() {
    return readFile(file_name, 'utf8');
  }

  // Read the data from the file and process it accordingly.
  getStuff().then(data => {
    let j = JSON.parse(data)
    rawData.push(j);

    // If flag is 0, prepare data from another file.
    if (flag == 0){
      var fn = "../Dataset/Paths.txt";
      StageOne_Read_Files(fn, t, res, 1);
    }
    // If flag is 1, prepare data from the weather file.
    else if (flag == 1){
      var fn = "../Dataset/Weather.txt";
      StageOne_Read_Files(fn, t, res, 2);
    }
    // If flag is 2, proceed with data preparation.
    else{
      StageTwo_Prepare_Data_Arrays(t, res, 0);
    }
  })
}


// Function to prepare data after all HTTP requests for weather data are completed.
function StageOne_Prepare_data_after_http_requests(t, res){
  rawData = new Array(3);
  rawData[0] = rawData_helper[0];
  rawData[1] = rawData_helper[1];
  rawData[2] = new Array();

  // Combine weather data from multiple HTTP requests into a single array.
  for (var i = 2; i < total_http_req; i++){
    var tmp = rawData_helper[i];
    rawData[2].push(tmp);
  }

  // Proceed to prepare data arrays.
  StageTwo_Prepare_Data_Arrays(t, res, 0);
}


// Function to make HTTP requests for weather data.
function StageOne_Http_Request(url_array, t, res, flag){
  var url = url_array[flag];
  console.log(url);

  // Make an HTTP request to fetch weather data.
  http.get(url, resp => {
    let data = "";
    resp.on('data', chunk => {
      data += chunk;
    });
    resp.on('end', () => {
      let str = JSON.parse(data);
      rawData_helper.push(str);

      // Check if all weather requests are done, then proceed with data preparation.
      if (flag == total_http_req-1){
        console.log("All weather requests are done.");
        StageOne_Prepare_data_after_http_requests(t, res);
      }
      else{
        var new_flag = flag + 1;
        StageOne_Http_Request(url_array, t, res, new_flag);
      }
    });
  })
  .on("error", err => {
    console.log("Error: " + err.message);
  });
}


// Function to handle data retrieval from local files.
function DataByFileSystem(t, res){
  var file_name = "../Dataset/Devices.txt";
  StageOne_Read_Files(file_name, t, res, 0);
}


// Function to handle data retrieval from web services.
function DataByWebService(t, res){
  var ip = "147.102.16.156";
  var port = "1880";
  var pathing = "/getCurrentTemperatureStartingPoint/";
  var url_for_req = new Array(total_http_req);
  url_for_req[0] = "http://feed.opendata.imet.gr:23577/itravel/devices.json";
  url_for_req[1] = "http://feed.opendata.imet.gr:23577/itravel/paths.json";

  // Prepare URLs for HTTP requests for weather data.
  for (var i = 2; i < total_http_req; i++){
    url_for_req[i] = "http://" + ip + ":" + port + pathing + (i-1).toString();
  }

  // Start making HTTP requests for weather data.
  StageOne_Http_Request(url_for_req, t, res, 0);
}


// Function to handle the case when dataset retrieval method is unspecified.
function DatasetUnspecifiedError(res){
  var error_msg = "Dataset Unspecified: Information can be accessed via local files or web service."
  res.send(error_msg);
}


// Main function to retrieve weather conditions based on the dataset retrieval method.
function WeatherConditions(t, w, res){
  rawData_helper = new Array();
  rawData = new Array();
  results = new Array();
  station_info = new Array();
  neighborhood = new Array();
  edges = new Array();
  good_stations_no_rain = new Array();
  reachable_stations = new Array();

  res.setHeader("Access-Control-Allow-Origin", "*");

  // Usage of web services is disabled temporarily
  var service = w;
  if (service == "web"){
    service = "local";
  }

  // Check the dataset retrieval method specified and proceed accordingly.
  if (service == "local"){
    DataByFileSystem(t, res); // Retrieve data from local files.
  }
  else if (service == "web"){
    DataByWebService(t, res); // Retrieve data from web service.
  }
  else{
    DatasetUnspecifiedError(res); // Handle the case where dataset retrieval method is unspecified.
  }
}

// Export the WeatherConditions function to be used as a module.
module.exports = WeatherConditions;

