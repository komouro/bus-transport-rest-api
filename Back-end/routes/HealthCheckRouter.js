// Import the HealthCheckController module (containing the logic for handling the '/Mouro/api/HealthCheck' endpoint).
const HealthCheck = require('./../controllers/HealthCheckController.js');

// Export function that defines the route for the '/Mouro/api/HealthCheck' endpoint.
module.exports = function(app, db) {
  // Define a GET route for the '/Mouro/api/HealthCheck' endpoint.
  app.get('/Mouro/api/HealthCheck', (req, res) => {
    // Call the HealthCheckController function passing the 'res' object to handle the response.
    HealthCheck(res);
  });
};

