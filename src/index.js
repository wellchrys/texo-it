require('dotenv/config');

const initH2 = require('./app/database');

const app = require('./app');
require('./app/controllers/index')(app);

const server = require('http').createServer(app);

// set port, listen for requests
const PORT = process.env.PORT || 3333;

server.listen(PORT, async () => {
  await initH2();

  console.log(`> Server is running on port: ${PORT}.`);
});
