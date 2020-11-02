var knex = require('knex')({
    client: 'pg',
    connection: {
        user: "postgres",
        password: "nihas2@llah",
        host: "localhost",
        port: "5432",
        database: "testapp",
    }
  });


module.exports = knex;