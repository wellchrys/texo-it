require('dotenv/config');

const app = require('./app');
require('./app/controllers/index')(app);

const server = require('http').createServer(app);

const csv = require('csvtojson');

const { seeder, initialize } = require('./app/movie');

// set port, listen for requests
const PORT = process.env.PORT || 3333;

server.listen(PORT, async () => {
  await initialize();

  const jsonArray = await csv(
    {
      delimiter: ";",
      headers: ["year", "title", "studios", "producers", "winner"]
    }
  ).fromFile("./src/movielist.csv");

  await seeder(jsonArray);

  console.log(`> Server is running on port: ${PORT}.`);
});
