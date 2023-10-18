import { config } from 'dotenv';

function throwIfNot<T, K extends keyof T>(obj: Partial<T>, prop: K, msg?: string): T[K] {
  if (obj[prop] === undefined || obj[prop] === null) {
    throw new Error(msg || `Missing required variable ${prop.toString()}`);
  } else {
    return obj[prop] as T[K];
  }
}

function loadEnv() {
  config();

  ['DB_HOST', 'DB_USER', 'DB_PASS'].forEach(v => {
    throwIfNot(process.env, v);
  });
}

export default loadEnv;
