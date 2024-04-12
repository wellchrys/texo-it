const express = require('express');

const { getWineerProducersWithMoreThanOneAward } = require('../sql');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const producers = await getWineerProducersWithMoreThanOneAward();

    const chunkByProducerId = Object.values(producers.reduce((acc, producer, i) => {
      const producerId = producer.id;
      acc[producerId] = acc[producerId] || [];
      acc[producerId].push(producer);

      return acc;
    }, {}));

    const min = [];
    const max = [];

    let winnerIntervals = setWinnerIntervals(chunkByProducerId);

    for (const arr of winnerIntervals) {
      if (arr.length > 1) {
        let minInterval = Math.min(...arr.map(item => item.interval));

        let minArr = arr.find(item => item.interval === minInterval)
        let maxArr = arr.find(item => item.interval > minInterval);

        min.push(minArr);
        max.push(maxArr);
      } else {
        min.push(arr[0]);
        max.push(arr[0]);
      }
    }

    return res.status(200).json({ min, max })
  } catch (error) {
    return res.status(400).json({ error: 'Some Error' });
  }
});

function setWinnerIntervals(array) {
  for (let i = 0; i < array.length; i++) {
    let previousWin = 0;
    let followingWin = 0;

    let arr = array[i];
    let arr2 = [];

    for (let j = 0; j < arr.length; j++) {
      const index = j - 1;
      previousWin = arr[(index > 0 && index) || 0].movie_year
      followingWin = arr[j].movie_year

      interval = followingWin - previousWin;

      arr2.push({ producer: arr[j].producer_name, interval, previousWin, followingWin })
    }

    array[i] = arr2.filter(e => e.interval > 0);
  }

  return array;
}

module.exports = app => app.use('/movie', router);
