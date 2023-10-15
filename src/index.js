const express = require('express');

// Create a new express application instance
const app = express();

// Define a route to handle GET requests to the root path ('/')
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server listening on port 3000
app.listen(3000, () => {
  console.log('App is listening on port 3000!');
});
