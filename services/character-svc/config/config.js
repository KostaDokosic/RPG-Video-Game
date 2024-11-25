module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DB_NAME || 'accounts',
    host: process.env.DB_HOST || 'account-svc-db',
    port: process.env.DATABASE_PORT || '5432',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DB_NAME || 'accounts',
    host: process.env.DB_HOST || 'account-svc-db',
    port: process.env.DATABASE_PORT || '5432',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DB_NAME || 'accounts',
    host: process.env.DB_HOST || 'account-svc-db',
    port: process.env.DATABASE_PORT || '5432',
    dialect: 'postgres',
  },
};
