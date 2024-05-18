const csv = require('csvtojson');

const { seeder, initialize } = require('./movie');

const { spawn } = require('child_process');

function initH2() {
  return new Promise((resolve, reject) => {
    const serverOptions = ['org.h2.tools.Server', '-tcp', '-tcpAllowOthers', '-tcpPort', '5234', '-baseDir', './', '-ifNotExists'];

    const childProcess = spawn('java', ['-cp', './h2/bin/h2-2.2.224.jar', ...serverOptions]);

    childProcess.stdout.on('data', async (d) => {
      await initialize();

      const jsonArray = await csv(
        {
          delimiter: ";",
          headers: ["year", "title", "studios", "producers", "winner"]
        }
      ).fromFile("./src/movielist.csv");

      await seeder(jsonArray);

      const data = await d.toString();
      resolve(data);
    });

    childProcess.stderr.on('data', async (d) => {
      const data = await d.toString();

      resolve(data);
    });

    childProcess.on('close', (code) => {
      resolve(code);
    });
  })
}


module.exports = initH2;
