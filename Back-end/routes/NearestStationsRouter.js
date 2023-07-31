// Import the NearestStationsController module (containing the logic for handling the '/Mouro/api/NearestStations' endpoint).
const NearestStations = require('./../controllers/NearestStationsController');

// Export function that defines the route for the '/Mouro/api/NearestStations' endpoint.
module.exports = function(app, db) {
  // Define a GET route for the '/Mouro/api/NearestStations' endpoint with URL parameters.
  app.get('/Mouro/api/NearestStations/:coord_x/:coord_y/:num/:web', (req, res) => {
    // Extract the URL parameters from the request object.
    const n = req.params.num;       // The number of nearest stations to find.
    const x = req.params.coord_x;   // The x-coordinate of the location.
    const y = req.params.coord_y;   // The y-coordinate of the location.
    const w = req.params.web;       // A flag indicating whether it is a web request.

    // Call the NearestStationsController function passing the extracted parameters and the 'res' object to handle the response.
    NearestStations(x, y, n, w, res);
  });
};

