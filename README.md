# TexoIT

## Setup

Before running the setup, make sure you got the values for `JDBC_URL`, `JDBC_DRIVERNAME`, `JDBC_USER` and `JDBC_PASSWORD`

If you are using Mac you can run:

```bash
bash bin/setup-macos.sh
```

Make sure the following ports will be available:

- H2 Database: 5234
- API: 3333

Start the H2 Database with `java -cp ./h2/bin/h2-2.2.224.jar org.h2.tools.Server -tcp -tcpAllowOthers -tcpPort 5234 -baseDir ./ -ifNotExists`

Start Express endpoint with `yarn dev:server`

Now you can visit [`localhost:3333`](http://localhost:3333/movie) from your browser.

## Environment Variables

| Env                                              | Usage                                                               | Example                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| JDBC_URL                               | Primary H2 Database connection URL                                   | jdbc:h2:tcp://localhost:5234/mem:database_name;database_to_lower=true;DB_CLOSE_DELAY=-1                                      |
| JDBC_DRIVERNAME                      | The database drive                                                   | org.h2.Driver                                                               |
| JDBC_USER                                    | user of database                                       | sa                                                                  |
| JDBC_PASSWORD                | Password of database  | **(IS EMPTY)**                                |

Make sure the csv file is in the following directory `./src/file_name_csv`

## Integration tests

Run `yarn test`
