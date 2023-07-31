// Import the different route modules for each API endpoint.
const HealthCheckRoute = require('./HealthCheckRouter.js');
const NearestStationsRoute = require('./NearestStationsRouter.js');
const ConnectionRoutesRoute = require('./ConnectionRoutesRouter.js');
const WeatherConditionsRoute = require('./WeatherConditionsRouter.js');

// Export function that sets up the routes for various API endpoints.
module.exports = function(app, db) {
  // Call each route module to set up the corresponding routes (each route module is responsible for handling a specific API endpoint).
  HealthCheckRoute(app, db);
  NearestStationsRoute(app, db);
  ConnectionRoutesRoute(app, db);
  WeatherConditionsRoute(app, db);
};

