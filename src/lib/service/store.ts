import Keyv from '@keyvhq/core';
import KeyvSQLite from '@keyvhq/sqlite';

const storePath = process.env.STORE_PATH ?? `${process.cwd()}/store.sqlite`;

const store = new Keyv({ store: new KeyvSQLite(`sqlite://${storePath}`) });

export default store;
