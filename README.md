# BusBrainiac

## Description

This application was developed for Appathon@Ntua 2020 and was proposed to and accepted by the grading committee. The purpose of the application is to facilitate bus transportation and enhance the overall commuting experience through a web API. The application is built using Node.js for the intermediate server, Python for the command-line interface, and HTML/CSS for the frontend environment. 


## Data and Impact

Our application is built upon a comprehensive dataset comprising 71 Greek bus stations. Each station is interconnected through directed bus lines, forming a well-defined transportation network represented as a graph. By employing graph-based algorithms, including variations of Dijkstra's and Breadth-First Search (BFS), our application can efficiently handle diverse functionalities and support optimal route planning for users.

![Bus Line Network](./Dataset/BusLineNetwork.png)

The impact of our application is remarkable, offering users enhanced accessibility, improved travel time, and reliable transportation options. By leveraging the power of graph-based algorithms, we can efficiently find the nearest bus stations, suggest optimal bus routes, and provide weather-informed travel options. Through this streamlined approach and a user-friendly interface, we aim to minimize waiting times, reduce travel complexities, and contribute to an enhanced public transportation experience for commuters across Greece.


### Functionality

1. **NearestStations**: Given specific coordinates, the application returns the closest *m* bus stations to that location, where *m* is specified by the user.

2. **ConnectionRoutes**: By specifying the coordinates of a source location and a destination, the application determines the closest bus station to the source (S<sub>i</sub>) and the closest bus station to the destination (S<sub>j</sub>). It then provides at most *k* routes (if available) to travel from S<sub>i</sub> to S<sub>j</sub>, including intermediate stops S<sub>1</sub>, S<sub>2</sub>, ..., S<sub>n</sub>. The user also receives the bus route with the minimum number of stops. The parameter *k* is specified by the user.

3. **WeatherConditions**: Users can access information about bus stations where it is not currently raining. Additionally, they can find stations accessible through bus lines that include source stations where it is not currently raining.


### Components

- **Dataset**: Raw data is extracted from web services of itravel via http://feed.opendata.imet.gr:23577/itravel and Web Service 11 (getCurrentTemperatureStartingPoint). The application manager can update these datasets to have fresh local data when the web services are offline. The stored raw data can be found in the ./Dataset directory.

- **Back-end**: The application's intermediate server, developed using Node.js, processes the extracted data. It receives user requests, extracts the required raw data from web services or local files, and generates valuable information for the user.

- **Front-end and CLI**: The front-end of the application was developed using `AngularJS` (https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js) and `jQuery` (https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js). For communication between the front-end and the server, we utilized `XMLHttpRequest`. On the other hand, the CLI (Command-Line Interface) was implemented using Python. To handle communication with the server, the CLI uses the `requests` package. For parsing the CLI input, we employed the `click` library.


## Installation and Execution
The development of the applcation was done using the Node Package Manager (npm). In particular, we used npm 7.18.1 and Python 3.7.4 on a Linux system. To set up the server, follow these steps:

1. Open a terminal in the ./Back-end directory.
2. Run the following command to install the required dependencies:
   ```
   npm install
   ```

To activate the server, run the following command in the same terminal:

```
npm run dev
```

To access the CLI environment, follow these steps:

1. Open a terminal in the ./Cli directory.
2. Run the following command:
   ```
   python appBusBrainiac.py
   ```

For the front-end, follow these steps:

1. Simply open the file `Front-end/AppHome/Home.html` with the help of a web browser.
2. We recommend using Google Chrome or Mozilla Firefox for the best experience.

## Front-end and CLI
In the front-end environment, the user can easily navigate through different pages, each offering specific functionalities. To submit requests, the user must provide all the necessary parameters on the respective page. Once the parameters are validated, the user will be redirected to a new page where they can access the results provided by our application. These results are presented in a table format, accompanied by helpful messages for additional information. The CLI provides the following main functionalities:

- NearestStations:
  ```
  BusBrainiac NearestStations --lat lat --lon lon --num num (--service service)
  ```

- ConnectionRoutes:
  ```
  BusBrainiac ConnectionRoutes --lat_src lat_src --lon_src lon_src --lat_dst lat_dst --lon_dst lon_dst --num num (--service service)
  ```

- WeatherConditions:
  ```
  BusBrainiac WeatherConditions (--stationtype stationtype) (--service service)
  ```

Additionally, the CLI supports the following commands:

- Asking for the state of the server:
  ```
  BusBrainiac HealthCheck
  ```

- Asking for supported commands and their usage in the CLI:
  ```
  cli_Manual
  ```

Users can execute these CLI commands to interact with the application's functionalities from the command-line interface.
