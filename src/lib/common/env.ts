import { config } from 'dotenv';

import { checkForRequired } from './util.js';

/** # `loadEnv`
 * Loads environment variables from a `.env` file using the `dotenv` package and checks if required environment
 * variables are present.
 * @throws An error if a required environment variable is not present.
 */
function loadEnv() {
  config();

  ['DB_HOST', 'DB_USER', 'DB_PASS'].forEach(v => {
    checkForRequired(process.env, v);
  });
}

export default loadEnv;
