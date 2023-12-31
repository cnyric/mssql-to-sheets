import type { Knex } from 'knex';
import knex from 'knex';

import { env } from './util.js';

/** # `db`
 * Returns a `knex` instance that is configured to connect to a Microsoft SQL Server database. The `knex`
 * instance can be used to perform various database operations such as querying, inserting, updating, and deleting data.
 * @param database - The name of the database to connect to.
 * @throws An error if the database name is not specified.
 * @returns A `knex` instance that is configured to connect to the specified database.
 */
function db(database: string): Knex<any, unknown[]> {
  if (!database) {
    throw new Error('Missing required parameter `database`');
  }

  return knex({
    client: 'mssql',
    connection: {
      host: env('DB_HOST'),
      user: env('DB_USER'),
      password: env('DB_PASS'),
      database,
      options: {
        trustServerCertificate: true
      }
    }
  });
}

export default db;
