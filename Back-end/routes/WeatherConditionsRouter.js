// Import the WeatherConditionsController module (containing the logic for handling the '/Mouro/api/WeatherConditions' endpoint).
const WeatherConditions = require('./../controllers/WeatherConditionsController.js');

// Export function that defines the route for the '/Mouro/api/WeatherConditions' endpoint.
module.exports = function(app, db) {
  // Define a GET route for the '/Mouro/api/WeatherConditions' endpoint with URL parameters.
  app.get('/Mouro/api/WeatherConditions/:stationtype/:web', (req, res) => {
    // Extract the URL parameters from the request object.
    const t = req.params.stationtype;   // The type of station ('source', 'destination' or 'both').
    const w = req.params.web;           // A flag indicating whether it is a web request.

    // Call the WeatherConditionsController function passing the extracted parameters and the 'res' object to handle the response.
    WeatherConditions(t, w, res);
  });
};

