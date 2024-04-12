const { create, h2db, executeUpdate, get, isTableExist } = require('./sql');
const { convertToBoolean, removeComma, getIdFromObjInsideLoop } = require('./utils/index');

async function initialize() {
  const h2 = await h2db()

  if (!h2) {
    console.log("Error to connect to database");
  } else {
    await executeUpdate(h2,
      "CREATE TABLE IF NOT EXISTS movies ("
      + "  id INT PRIMARY KEY AUTO_INCREMENT,"
      + "  movie_title VARCHAR(255) NOT NULL,"
      + "  movie_studio VARCHAR(255) NOT NULL,"
      + "  movie_year INT,"
      + "  movie_winner BOOLEAN NOT NULL)");

    await executeUpdate(h2,
      "CREATE TABLE IF NOT EXISTS producers ("
      + "  id INT PRIMARY KEY AUTO_INCREMENT,"
      + "  producer_name VARCHAR(255) NOT NULL UNIQUE)"
    );

    await executeUpdate(h2,
      "CREATE TABLE IF NOT EXISTS producer_intermediate ("
      + "  id INT PRIMARY KEY AUTO_INCREMENT,"
      + "  movie_id INT NOT NULL,"
      + "  producer_id INT NOT NULL,"
      + "  FOREIGN KEY (movie_id) REFERENCES movies(id),"
      + "  FOREIGN KEY (producer_id) REFERENCES producers(id))"
    );
  }
}

async function seeder(jsonArray) {
  const isExist = await isTableExist('movies');

  if (!isExist) {
    for (const row of jsonArray) {
      const producersArr = removeComma(row.producers);

      const movie = await create('movies', {
        movie_title: row.title,
        movie_studio: row.studios,
        movie_year: row.year,
        movie_winner: convertToBoolean(row.winner),
      });

      const movieId = getIdFromObjInsideLoop(movie);

      for (const producer_name of producersArr) {
        let producer = await create('producers', {
          producer_name
        });

        if (producer === false) {
          [curr_prod] = await get('producers', `WHERE producer_name = '${producer_name}'`);
          producer = curr_prod;
        }

        const prodId = getIdFromObjInsideLoop(producer);

        await create('producer_intermediate', {
          movie_id: movieId,
          producer_id: prodId
        });
      };
    }
  }
}

module.exports = { seeder, initialize };
