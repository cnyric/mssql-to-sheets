import knex from 'knex';

function db(database: string) {
  return knex({
    client: 'mssql',
    connection: {
      host: process.env['DB_HOST'],
      user: process.env['DB_USER'],
      password: process.env['DB_PASS'],
      database
    }
  });
}

export default db;
