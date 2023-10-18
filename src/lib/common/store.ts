import type { Job } from '../../types.d.ts';

import Keyv from '@keyvhq/core';
import KeyvSQLite from '@keyvhq/sqlite';

const storePath = process.env['STORE_PATH'] ?? `${process.cwd()}/store.sqlite`;

/** # `store`
 * Creates a new instance of Keyv, a simple key-value store that can be used to store and retrieve data.
 * @param storePath - The path to the SQLite database file to use for the store.
 * @returns A new instance of Keyv.
 */
const store = new Keyv<Job>({ store: new KeyvSQLite(`sqlite://${storePath}`) });

export default store;
