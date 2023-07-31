// Import the required modules: express for creating the server and bodyParser for parsing request bodies
const express = require('express');
const bodyParser = require('body-parser');

// Create an instance of Express application
const app = express();

// Initialize an empty object 'db' to hold the database (here is is just an empty object)
const db = {};

// Set the port number for the server to listen on
const port = 8765;

// Require and use the routes defined in the './routes' module, passing the Express app and the database object
require('./routes')(app, db);

// Start the server to listen on the specified port
app.listen(port, () => {
  console.log("Listening on port " + port);
});

