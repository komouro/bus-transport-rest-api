// Importing required modules.
const http = require('http');
const https = require('https');
const fs = require('fs');
const util = require('util');

var rawData; // Global variable to store the raw data obtained from files or web service.
var results; // Global variable to store the final result of the nearest stations.


// Function to send the results back as a response to the client.
function StageThree_Return_Result(res){
  res.send(results);
}


// Function to find the nearest stations based on the given coordinates (x, y).
function StageTwo_Find_Nearest_Stations(num, coord_x, coord_y, res){
  var tmp = new Array(); // Temporary array to store the nearest station information.
  var devices_array = rawData[0]; // Array containing device information.
  var total_devices = devices_array.length; // Total number of devices.
  var n = Number(num); // Number of nearest stations required.
  var x = Number(coord_x); // X-coordinate of the given location.
  var y = Number(coord_y); // Y-coordinate of the given location.
  var EarthRadius = 6371; // Radius of the Earth in kilometers.
  var pi = Math.PI; // The mathematical constant pi.
  var dist = new Array(); // Array to store distances from the given location to each station.

  // Calculate the distances from the given location to each station and store in the 'dist' array.
  for (var i = 0; i < total_devices; i++) {
    var h1 = Number(devices_array[i].lat);
    var h2 = Number(devices_array[i].lon);
    var a = x - h1;
    var b = y - h2;
    var dist_a = (a*pi*EarthRadius)/180;
    var dist_b = (b*pi*EarthRadius)/180;
    var c = Math.pow(dist_a, 2) + Math.pow(dist_b, 2);
    c = Math.sqrt(c);
    var g = {pos: i.toString(), dist: c.toString()};
    dist.push(g);
  }

  // Sort the 'dist' array based on distance in ascending order.
  dist.sort(function(a, b) {
    var keyA = new Number(a.dist);
    var keyB = new Number(b.dist);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  // Get the nearest 'n' stations and store their information in the 'tmp' array.
  const upper_limit = Math.min(dist.length, n);
  for (var j = 0; j < upper_limit; j++){
    var k = dist[j].pos;
    var id = devices_array[k].device_id;
    var name = devices_array[k].device_Name;
    var lan = devices_array[k].lat;
    var lon = devices_array[k].lon;
    var g = {"Station id": id, "Station name": name, "Station lat": lan, "Station lon": lon};
    tmp[j] = g;
  }

  // Store the nearest station results in the 'results' variable.
  results = tmp;

  // Proceed to send the results back as a response to the client.
  StageThree_Return_Result(res);
}


// Function to read data from files and initiate the process of finding nearest stations.
function StageOne_Read_Files(file_name, n, x, y, res){
  const readFile = util.promisify(fs.readFile);

  function getStuff() {
    return readFile(file_name, 'utf8');
  }

  getStuff().then(data => {
    let j = JSON.parse(data)
    rawData.push(j);
    // Proceed to find nearest stations with the obtained raw data.
    StageTwo_Find_Nearest_Stations(n, x, y, res);
  })
}


// Function to perform HTTP request and obtain data from web service.
function StageOne_Http_Request(url, n, x, y, res){
  http.get(url, resp => {
    let data = "";
    resp.on('data', chunk => {
      data += chunk;
    });
    resp.on('end', () => {
      let str = JSON.parse(data);
      rawData.push(str);
      // Proceed to find nearest stations with the obtained raw data.
      StageTwo_Find_Nearest_Stations(n, x, y, res);
    });
  })
  .on("error", err => {
    console.log("Error: " + err.message);
  });
}


// Function to handle data retrieval from local files.
function DataByFileSystem(n, x, y, res){
  var file_name = "../Dataset/Devices.txt";
  // Start reading files and initiate the process of finding nearest stations.
  StageOne_Read_Files(file_name, n, x, y, res);
}


// Function to handle data retrieval from web service.
function DataByWebService(n, x, y, res){
  var url = "http://feed.opendata.imet.gr:23577/itravel/devices.json";
  // Start HTTP request to obtain data and initiate the process of finding nearest stations.
  StageOne_Http_Request(url, n, x, y, res);
}


// Function to handle the case where dataset retrieval method is unspecified.
function DatasetUnspecifiedError(res){
  var error_msg = "Dataset Unspecified: Information can be accessed via local files or web service."
  res.send(error_msg);
}


// Main function to find the nearest stations based on the given coordinates (x, y).
function NearestStations(x, y, n, w, res){
  rawData = new Array(); // Initialize raw data array.
  results = new Array(); // Initialize results array.

  res.setHeader("Access-Control-Allow-Origin", "*"); // Set the response header for CORS.

  // Usage of web services is disabled temporarily
  var service = w;
  if (service == "web"){
    service = "local";
  }

  // Check the dataset retrieval method specified and proceed accordingly.
  if (service == "local"){
    DataByFileSystem(n, x, y, res); // Retrieve data from local files.
  }
  else if (service == "web"){
    DataByWebService(n, x, y, res); // Retrieve data from web service.
  }
  else{
    DatasetUnspecifiedError(res); // Handle the case where dataset retrieval method is unspecified.
  }
}

// Export the NearestStations function to be used as a module.
module.exports = NearestStations;

