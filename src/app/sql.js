require('dotenv').config()

const { handleApostrophe } = require('./utils/index');

const JDBC = require('jdbc');
const jinst = require('jdbc/lib/jinst');

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./h2/bin/h2-2.2.224.jar']);
}

let h2 = new JDBC({
  url: process.env.JDBC_URL,
  drivername: process.env.JDBC_DRIVERNAME,
  minpoolsize: 10,
  maxpoolsize: 100,
  properties: {
    user: process.env.JDBC_USER,
    password: process.env.JDBC_PASSWORD
  },
});

let h2Init = false;

function reserve(db) {
  return new Promise((resolve, reject) => {
    db.reserve(function (err, connobj) {
      if (err) {
        resolve(false);
      } else {
        resolve({ connobj, conn: connobj.conn });
      }
    });
  })
};

function release(db, connobj, err, result, callback) {
  db.release(connobj, function (e) {
    if (err) {
      return callback(false);
    } else {
      return callback(result);
    }
  });
};

function h2db() {
  return new Promise((resolve, reject) => {
    if (!h2Init) {
      h2.initialize(function (err) {
        if (err) {
          console.log(err)
          resolve(false);
        } else {
          h2Init = true;
          resolve(h2);
        }
      });
    } else {
      resolve(h2);
    }
  })
};

async function executeUpdate(db, sql) {
  const resConn = await reserve(db);

  if (!resConn) {
    return false;
  } else {
    const { connobj, conn } = resConn;

    return await doExecuteUpdate(connobj, conn, db, sql);
  }
};

function doExecuteUpdate(connobj, conn, db, sql) {
  return new Promise((resolve, reject) => {
    conn.createStatement(function (err, statement) {
      if (err) {
        release(db, connobj, err, null, resolve);
      } else {
        statement.executeUpdate(sql, function (err, result) {
          release(db, connobj, err, result, resolve);
        });
      }
    });
  })
}

async function create(table, values) {
  const h2 = await h2db()

  if (!h2) {
    return false;
  } else {
    columns = Object.keys(values).join();
    Object.keys(values).forEach((key) => values[key] = `'${handleApostrophe(values[key])}'`);
    values = Object.values(values).join();

    const res = await executeUpdate(h2, `INSERT INTO ${table} (${columns}) VALUES(${values})`);

    if (res === false) {
      return false;
    } else {
      const [row] = await get(`${table}`, 'ORDER BY id DESC LIMIT 1');

      return row;
    }
  }
}

async function executeQuery(db, sql) {
  const resConn = await reserve(db);

  if (!resConn) {
    return false;
  } else {
    const { connobj, conn } = resConn;

    return await doExecuteQuery(connobj, conn, db, sql);
  }
};

function doExecuteQuery(connobj, conn, db, sql) {
  return new Promise((resolve, reject) => {
    conn.createStatement(function (err, statement) {
      if (err) {
        release(db, connobj, err, null, resolve);
      } else {
        statement.executeQuery(sql, function (err, result) {
          result.toObjArray((err, results) => {
            release(db, connobj, err, results, resolve);
          });
        });
      }
    });
  })
}

async function get(table, conditions) {
  const h2 = await h2db()

  if (!h2) {
    console.log("Error to connect to database");
    return false;
  } else {
    const result = await executeQuery(h2, `SELECT * FROM ${table} ${conditions}`);

    if (!result) {
      console.log(result);
      return false;
    } else {
      return result;
    }
  }
}

async function isTableExist(table) {
  const h2 = await h2db()

  if (!h2) {
    console.log("Error to connect to database");
    return false;
  } else {
    const result = await executeQuery(h2, `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${table}' and row_count_estimate > 0`);

    if (result.length === 0) {
      return false;
    } else {
      return true;
    }
  }
}

async function getWineerProducersWithMoreThanOneAward() {
  const h2 = await h2db()

  if (!h2) {
    console.log("Error to connect to database");
    return false;
  } else {
    const result = await executeQuery(h2, `
      WITH winner_intervals AS (
        SELECT p.id,
          p.producer_name,
          m1.movie_title,
          m1.movie_year,
          COUNT(*) OVER(PARTITION BY p.id) AS num_wins
        FROM
          producers p
        JOIN
          producer_intermediate pi1 ON p.id = pi1.producer_id
        JOIN
          movies m1 ON pi1.movie_id = m1.id AND m1.movie_winner = true
      )

      SELECT
        w.id,
        w.producer_name,
        w.movie_year
      FROM
        winner_intervals w
      WHERE w.num_wins > 1
      GROUP BY w.id, w.movie_year
    `);

    if (result.length === 0) {
      return false;
    } else {
      return result;
    }
  }
}


module.exports = { h2db, executeUpdate, create, get, isTableExist, getWineerProducersWithMoreThanOneAward }
