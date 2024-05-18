# TexoIT

## Setup

Before running the setup, make sure you got the values for `JDBC_URL`, `JDBC_DRIVERNAME`, `JDBC_USER` and `JDBC_PASSWORD`

Make sure JAVA_HOME is pointed to the right location.

It should be:

`/Library/Java/JavaVirtualMachines/jdk1.8.0_401.jdk/Contents/Home/`
The best way to set this properly is by exporting it:

```bash
export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0`
```

If you are using Mac you can run:

```bash
bash bin/setup-macos.sh
```

Make sure the following ports will be available:

- H2 Database: 5234
- API: 3333

Start Express endpoint with `yarn dev:server`

Now you can visit [`localhost:3333/movie`](http://localhost:3333/movie) from your browser.

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
