const app = require('../src/testApp');
const supertest = require('supertest');

const csv = require('csvtojson');
const { seeder, initialize } = require('../src/app/movie');

describe('Endpoint validation', () => {
  it('Should be able receive the producer winners', async () => {
    const request = supertest(app);

    await initialize();

    const jsonArray = await csv(
      {
        delimiter: ";",
        headers: ["year", "title", "studios", "producers", "winner"]
      }
    ).fromFile("./src/movielist.csv");

    await seeder(jsonArray);

    const response = await request
      .get('/movie')
      .send();

    expect(response.status).toBe(200);
  })
});
