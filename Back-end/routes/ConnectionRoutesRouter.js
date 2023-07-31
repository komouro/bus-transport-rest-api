// Import the ConnectionRoutesController module (containing the logic for handling the '/Mouro/api/ConnectionRoutes' endpoint).
const ConnectionRoutes = require('./../controllers/ConnectionRoutesController.js');

// Export function that defines the route for the '/Mouro/api/ConnectionRoutes' endpoint.
module.exports = function(app, db) {
  // Define a GET route for the '/Mouro/api/ConnectionRoutes' endpoint.
  app.get('/Mouro/api/ConnectionRoutes/:coord_x_A/:coord_y_A/:coord_x_B/:coord_y_B/:counter/:web', (req, res) => {
    // Extract the parameters from the request URL.
    const x1 = req.params.coord_x_A;   // The x-coordinate of the source.
    const y1 = req.params.coord_y_A;   // The y-coordinate of the source.
    const x2 = req.params.coord_x_B;   // The x-coordinate of the destination.
    const y2 = req.params.coord_y_B;   // The y-coordinate of the destination.
    const c = req.params.counter;      // The number of routes to find.
    const w = req.params.web;          // A flag indicating whether it is a web request.

    // Call the ConnectionRoutesController function passing the extracted parameters and the 'res' object to handle the response.
    ConnectionRoutes(x1, y1, x2, y2, c, w, res);
  });
};

