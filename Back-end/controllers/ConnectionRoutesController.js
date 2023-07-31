// Import required modules and classes.
const http = require('http');
const https = require('https');
const fs = require('fs');
const util = require('util');
const Stack = require('./../useful_Classes_Algorithms/Stack.js');
const Dijkstra = require('./../useful_Classes_Algorithms/Dijkstra.js');

// Constants and variables initialization.
const upper_limit_device_id = 1000;  // Maximum number of devices (stations)
const upper_limit_stack_checks = 1000000; // Maximum number of checks for the stack in BFS
var total_devices; // Total number of devices in the dataset
var rawData; // Array to store the raw data fetched from the data source
var station_A; // Nearest station to the source coordinates
var station_B; // Nearest station to the destination coordinates
var station_info; // Information about each station (device) such as name and coordinates
var neighborhood; // Adjacency list representing the neighborhood relationships between stations
var tmp_results; // Temporary storage for intermediate results during path finding
var results; // Array to store alternative routes between source and destination
var best_route_results; // Information about the best route found
var final_results; // Array to store the final results to be sent to the client
var counter; // Counter to limit the number of paths to find

// Function to send the final results to the client.
function StageEight_Return_Results(res){
  res.send(final_results);
}

// Function to prepare data results after finding paths.
function StageSeven_Prepare_Data_Results(best_dist, road, res){
  // Check if valid routes are found.
  if (road.length != 1 || station_A == station_B){
    // Process the found paths and prepare results.
    var total_paths_found = tmp_results.length;
    for (var i = 0; i < total_paths_found; i++){
      var r = tmp_results[i].path;
      var total_nodes = r.length;
      var r_ids = tmp_results[i].path_ids;
      var routing_by_name = "";
      var routing_by_coords = "";
      var routing_by_ids = "";
      for (var j = 0; j < total_nodes-1; j++){
        var dev_id = r[j];
        var info = station_info[dev_id - 1];
        var name = info.name;
        var coords = info.coords;
        routing_by_name = routing_by_name + name + " -> ";
        routing_by_coords = routing_by_coords + coords + " -> ";
        routing_by_ids = routing_by_ids + dev_id + " -> ";
      }
      var dev_id = r[total_nodes-1];
      var info = station_info[dev_id - 1];
      var name = info.name;
      var coords = info.coords;
      routing_by_name = routing_by_name + name;
      routing_by_coords = routing_by_coords + coords;
      routing_by_ids = routing_by_ids + dev_id;
      var routing = {"Route number": (i+1).toString(), "Nearest Station (Src)": station_A.toString(), "Nearest Station (Dst)": station_B.toString(), "Path by station id": routing_by_ids, "Path by name": routing_by_name, "Path by coordinates": routing_by_coords};
      results.push(routing);
    }
    var best_route_dist = best_dist + 1;
    var routing_by_name = "";
    var routing_by_coords = "";
    var routing_by_ids = "";
    for (var w = 0; w < best_route_dist-1; w++){
      var node = road[w];
      var tmp_name = station_info[node - 1].name;
      var tmp_coords = station_info[node - 1].coords;
      routing_by_name = routing_by_name + tmp_name + " -> ";
      routing_by_coords = routing_by_coords + tmp_coords + " -> ";
      routing_by_ids = routing_by_ids + node + " -> ";
    }
    var node = road[best_route_dist - 1];
    var tmp_name = station_info[node - 1].name;
    var tmp_coords = station_info[node - 1].coords;
    routing_by_name = routing_by_name + tmp_name;
    routing_by_coords = routing_by_coords + tmp_coords;
    routing_by_ids = routing_by_ids + node;
    best_route_results = {"Title": "BEST ROUTE (WITH MINIMUM NUMBER OF INTERMEDIATE STOPPING POINTS)", "Best route length": best_dist.toString(), "Nearest Station (Src)": station_A.toString(), "Nearest Station (Dst)": station_B.toString(), "Path by station id": routing_by_ids, "Path by name": routing_by_name, "Path by coordinates": routing_by_coords};

    var total_alternative_routes = results.length;
    final_results.push(best_route_results);
    final_results.push({"Title": "COLLECTION OF ALTERNATIVE ROUTES", "Station-origin": station_A.toString(), "Station-destination": station_B.toString(), "Number of routes": total_alternative_routes.toString(), "Routes": results});
  }
  else{
    // Handle the case when no valid route is found.
    var empty_list = new Array();
    best_route_results = {"Title": "BEST ROUTE (WITH MINIMUM NUMBER OF INTERMEDIATE STOPPING POINTS)", "Best route length": "-", "Nearest Station (Src)": station_A.toString(), "Nearest Station (Dst)": station_B.toString(), "Path by station id": empty_list, "Path by name": empty_list, "Path by coordinates": empty_list};
    var total_alternative_routes = results.length;
    final_results.push(best_route_results);
    final_results.push({"Title": "COLLECTION OF ALTERNATIVE ROUTES", "Station-origin": station_A.toString(), "Station-destination": station_B.toString(), "Number of routes": total_alternative_routes.toString(), "Routes": empty_list});
  }

  // Proceed to the next stage to return results.
  StageEight_Return_Results(res);
}

// Function to find paths using Breadth-First Search (BFS).
function StageSix_Find_Paths_BFS(best_dist, road, res){
  if (road.length != 1 || station_A == station_B){
    var s = station_A;
    var d = station_B;
    var deck = new Stack();
    deck.push({node: s, path_stations: [], path_ids: []});
    var i = counter;
    var j = upper_limit_stack_checks;
    while (deck.isEmpty() == false && i > 0 && j > 0){
      var next_element = deck.pop();
      var u = next_element.node;
      if (u == d){
        var new_path_stations = [...next_element.path_stations];
        var new_path_ids = [...next_element.path_ids];
        new_path_stations.push(u);
        var tmp = {path: new_path_stations, path_ids: new_path_ids};
        tmp_results.push(tmp);
        i -= 1;
      }
      else{
        var neighbor_list = neighborhood[u - 1];
        var total_neighbors = neighbor_list.length;
        for (var k = total_neighbors-1; k >= 0; k--){
          var n = neighbor_list[k].neighbor;
          var c = neighbor_list[k].id;
          var new_path_stations = [...next_element.path_stations];
          var check = new_path_stations.includes(n);
          if (check == false){
            var new_path_ids = [...next_element.path_ids];
            new_path_stations.push(u);
            new_path_ids.push(c);
            deck.push({node: n, path_stations: new_path_stations, path_ids: new_path_ids});
          }
        }
      }
      j -= 1;
    }
  }
  StageSeven_Prepare_Data_Results(best_dist, road, res);
}

// Function to find the best route using Dijkstra's algorithm.
function StageFive_Find_Best_Route_Dijkstra(res){
  var s = station_A;
  var d = station_B;
  var road_network = new Array();
  for (var i = 0; i < upper_limit_device_id; i++){
    var local_neighbors = neighborhood[i].length;
    for (var j = 0; j < local_neighbors; j++){
      var u = neighborhood[i][j].neighbor;
      var tmp = new Array(3);
      tmp[0] = (i + 1);
      tmp[1] = u;
      tmp[2] = 1;
      road_network.push(tmp);
    }
  }
  var source = s;
  var destination = d;
  var dij = new Dijkstra(source, destination, road_network);
  var best_dist = dij.getCost();
  var path = dij.getShortestPath();
  StageSix_Find_Paths_BFS(best_dist, path, res);
}

// Function to create neighborhood information for each station.
function StageFour_Create_Neighborhood(res){
  for (var k = 0; k < upper_limit_device_id; k++){
    neighborhood.push([]);
  }
  var paths_array = rawData[1];
  var total_paths = paths_array.length;
  for (var i = 0; i < total_paths; i++){
    var s = Number(paths_array[i].Path_origin_device_id);
    var d = Number(paths_array[i].Path_destination_device_id);
    var c = paths_array[i].Path_id;
    var geitonas = {id: c, neighbor: d};
    if (d == station_B){
      var size = neighborhood[s - 1].length;
      var tmp_in = geitonas;
      for (var j = 0; j < size; j++){
        var tmp_out = neighborhood[s - 1][j];
        neighborhood[s - 1][j] = tmp_in;
        var tmp_in = tmp_out;
      }
      neighborhood[s - 1].push(tmp_in);
    }
    else{
      neighborhood[s - 1].push(geitonas);
    }
  }
  StageFive_Find_Best_Route_Dijkstra(res);
}

// Function to create station information from the raw data.
function StageThree_Create_Station_Info(res){
  station_info = new Array(upper_limit_device_id);
  var device_array = rawData[0];
  total_devices = device_array.length;
  for (var i = 0; i < total_devices; i++){
    var name = device_array[i].device_Name;
    var id = Number(device_array[i].device_id);
    var lat = device_array[i].lat;
    var lon = device_array[i].lon;
    var coords = "( " + lat + " , " + lon + " )";
    var station = {name: name, coords: coords};
    station_info[id - 1] = station;
  }
  StageFour_Create_Neighborhood(res);
}

// Function to find the nearest station for a given coordinate.
function StageTwo_Find_Nearest_Station(x1, y1, x2, y2, res, flag){
  if (flag == 0){
    var coord_x = x1;
    var coord_y = y1;
  }
  else{
    var coord_x = x2;
    var coord_y = y2;
  }
  var devices_array = rawData[0];
  var size = devices_array.length;
  var x = Number(coord_x);
  var y = Number(coord_y);
  var EarthRadius = 6371;
  var pi = Math.PI;
  var dist = new Array();
  for (var i = 0; i < size; i++) {
    var h1 = Number(devices_array[i].lat);
    var h2 = Number(devices_array[i].lon);
    var a = x - h1;
    var b = y - h2;
    var dist_a = (a*pi*EarthRadius)/180;
    var dist_b = (b*pi*EarthRadius)/180;
    var c = Math.pow(dist_a, 2) + Math.pow(dist_b, 2);
    c = Math.sqrt(c);
    var g = {pos: i.toString(), dist: c.toString()};
    dist[i] = g;
  }
  dist.sort(function(a, b) {
    var keyA = new Number(a.dist);
    var keyB = new Number(b.dist);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  var k = dist[0].pos;
  var id = devices_array[k].device_id;
  if (flag == 0){
    station_A = Number(id);
  }
  else{
    station_B = Number(id);
  }
  if (flag == 0){
    StageTwo_Find_Nearest_Station(x1, y1, x2, y2, res, 1);
  }
  else{
    StageThree_Create_Station_Info(res);
  }
}

// Function to read data from files and initiate the data processing.
function StageOne_Read_Files(basic_file_name, secondary_file_name, x1, y1, x2, y2, res, flag){
  const readFile = util.promisify(fs.readFile);
  function getStuff() {
    return readFile(basic_file_name, 'utf8');
  }
  getStuff().then(data => {
    let j = JSON.parse(data)
    rawData.push(j);
    if (flag == 0){
      StageOne_Read_Files(secondary_file_name, basic_file_name, x1, y1, x2, y2, res, 1)
    }
    else{
      StageTwo_Find_Nearest_Station(x1, y1, x2, y2, res, 0);
    }
  })
}

// Function to make HTTP requests to fetch data and initiate the data processing.
function StageOne_Http_Request(basic_url, secondary_url, x1, y1, x2, y2, res, flag){
  http.get(basic_url, resp => {
    let data = "";
    resp.on('data', chunk => {
      data += chunk;
    });
    resp.on('end', () => {
      let str = JSON.parse(data);
      rawData.push(str);
      if (flag == 0){
        StageOne_Http_Request(secondary_url, basic_url, x1, y1, x2, y2, res, 1)
      }
      else{
        StageTwo_Find_Nearest_Station(x1, y1, x2, y2, res, 0);
      }
    });
  })
  .on("error", err => {
    console.log("Error: " + err.message);
  });
}


// Function to handle data retrieval from local files.
function DataByFileSystem(x1, y1, x2, y2, res){
  var file_name_dev = "../Dataset/Devices.txt";
  var file_name_path = "../Dataset/Paths.txt";
  var flag = 0;
  StageOne_Read_Files(file_name_dev, file_name_path, x1, y1, x2, y2, res, flag);
}

// Function to handle data retrieval from a web service.
function DataByWebService(x1, y1, x2, y2, res){
  var url_dev = "http://feed.opendata.imet.gr:23577/itravel/devices.json";
  var url_path = "http://feed.opendata.imet.gr:23577/itravel/paths.json";
  flag = 0;
  StageOne_Http_Request(url_dev, url_path, x1, y1, x2, y2, res, flag);
}

// Function to handle unspecified dataset error.
function DatasetUnspecifiedError(res){
  var error_msg = "Dataset Unspecified: Information can be accesed via local files or web service."
  res.send(error_msg);
}

// Main function for finding connection routes.
function ConnectionRoutes(x1, y1, x2, y2, c, w, res){
  // Initialization of variables and arrays.
  rawData = new Array();
  station_info = new Array();
  neighborhood = new Array();
  tmp_results = new Array();
  results = new Array();
  best_route_results = new Array();
  final_results = new Array();
  counter = c;

  // Set the response header for Cross-Origin Resource Sharing (CORS).
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Usage of web services is disabled temporarily
  var service = w;
  if (service == "web"){
    service = "local";
  }

  // Check the data source type (local or web) and initiate data retrieval accordingly.
  if (service == "local"){
    DataByFileSystem(x1, y1, x2, y2, res);
  }
  else if (service == "web"){
    DataByWebService(x1, y1, x2, y2, res);
  }
  else{
    // Handle the case of unspecified dataset.
    DatasetUnspecifiedError(res);
  }
}

// Export the main function to be used as a module.
module.exports = ConnectionRoutes
