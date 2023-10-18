import { config } from 'dotenv';

/** # `checkIfRequired`
 * Check if a required property is present in an object and throw an error if it is not.
 * @param obj - The object to check.
 * @param prop - The name of the property to check.
 * @param msg - The message to use if the property is not present.
 * @throws An error if the property is not present.
 * @returns The value of the property.
 */
function checkIfRequred<T, K extends keyof T>(obj: Partial<T>, prop: K, msg?: string): T[K] {
  if (obj[prop] === undefined || obj[prop] === null) {
    throw new Error(msg || `Missing required variable ${prop.toString()}`);
  } else {
    return obj[prop] as T[K];
  }
}

/** # `loadEnv`
 * Loads environment variables from a `.env` file using the `dotenv` package and checks if required environment
 * variables are present.
 * @throws An error if a required environment variable is not present.
 */
function loadEnv() {
  config();

  ['DB_HOST', 'DB_USER', 'DB_PASS'].forEach(v => {
    checkIfRequred(process.env, v);
  });
}

export default loadEnv;
