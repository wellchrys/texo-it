require('dotenv/config');

const app = require('./app');
require('./app/controllers/index')(app);

const server = require('http').createServer(app);

const csv = require('csvtojson');

const { seeder, initialize } = require('./app/movie');

// set port, listen for requests
const PORT = process.env.PORT || 3333;

const { spawn } = require('child_process');

server.listen(PORT, () => {
  const serverOptions = ['org.h2.tools.Server', '-tcp', '-tcpAllowOthers', '-tcpPort', '5234', '-baseDir', './', '-ifNotExists'];

  const childProcess = spawn('java', ['-cp', './h2/bin/h2-2.2.224.jar', ...serverOptions]);

  childProcess.stdout.on('data', async (data) => {
    console.log('H2 Database stdout:', data.toString());

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

  childProcess.stderr.on('data', (data) => {
    console.error('H2 Database stderr:', data.toString());
  });

  childProcess.on('close', (code) => {
    console.log(`H2 Database child process exited with code ${code}`);
  });
});
