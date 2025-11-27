const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: 3309,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'hub_db'
  }
});

module.exports = knex;
