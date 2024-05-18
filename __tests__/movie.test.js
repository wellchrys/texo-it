const app = require('../src/testApp');
const supertest = require('supertest');

const csv = require('csvtojson');
const { seeder, initialize } = require('../src/app/movie');

const initH2 = require('../src/app/database');

describe('Endpoint validation', () => {
  it('Should be able receive the producer winners', async () => {
    const request = supertest(app);

    await initH2();

    const response = await request
      .get('/movie')
      .send();

    expect(response.status).toBe(200);
  })
});
