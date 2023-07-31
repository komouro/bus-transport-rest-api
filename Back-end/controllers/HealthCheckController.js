// Function to perform a health check of the server.
function HealthCheck(res){
  // Prepare a message indicating that the server is working properly.
  const healthy_msg = [{"HealthCheck result": "Server is working properly."}];

  // Set the response header for Cross-Origin Resource Sharing (CORS).
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Send the healthy message as the response.
  res.send(healthy_msg);
}

// Export the HealthCheck function to be used as a module.
module.exports = HealthCheck;

