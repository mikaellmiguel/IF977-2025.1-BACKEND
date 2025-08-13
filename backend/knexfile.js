const path = require("path");
require("dotenv").config();

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "knex", "seeds")
    }
  },

   production: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "knex", "seeds")
    }
  }
}