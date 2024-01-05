import type { Emitter } from 'mitt';
import type { ILogObj } from 'tslog';
import type { QueueEvent } from '../api/types.d.ts';

import dayjs from 'dayjs';
import { config as dotenv } from 'dotenv';
import { writeFile } from 'fs/promises';
import mitt from 'mitt';
import { Logger } from 'tslog';

/** # `events` */
const events: Emitter<QueueEvent> = mitt<QueueEvent>();

/** # `log`
 * Creates a new instance of the `Logger` class, which is used throughout the application to log messages to the
 * console.
 * @returns A `Logger` instance.
 */
const log: Logger<ILogObj> = new Logger();

/** # `today`
 * @returns A string that is the current date in the format `YYYY_MM_DD`.
 */
function today() {
  return dayjs().format('YYYY_MM_DD');
}

/** # `setTitle`
 * This function is used to create unique titles or filenames for files or logs that are created by the application.
 * @param text - The text to use in the title.
 * @returns A string that is the concatenation of `text` and the `today` constant variable, separated by an underscore.
 */
function setTitle(text: string) {
  return `${text}_${today()}`;
}

/** # `checkForRequired`
 * Check if a required property is present in an object and throw an error if it is not.
 * @param obj - The object to check.
 * @param prop - The name of the property to check.
 * @param msg - The message to use if the property is not present.
 * @throws An error if the property is not present.
 * @returns The value of the property.
 */
function checkForRequired<T, K extends keyof T>(obj: Partial<T>, prop: K, msg?: string): T[K] {
  if (obj[prop] === undefined || obj[prop] === null) {
    throw new Error(msg || `\`${prop.toString()}\` is required`);
  } else {
    return obj[prop] as T[K];
  }
}

/** # `errorHandler`
 * The function first writes a log message to a file specified by the `ERROR_LOG_PATH` environment variable, then logs
 * the error message to the console. Finally, it exits the Node.js process.
 * @param error - An `Error` object.
 * @param source - The source of the error.
 * @param exit - Whether or not to exit the Node.js process. Defaults to `true`.
 */
async function errorHandler(error: Error, source: string) {
  await writeFile(
    <string>env('ERROR_LOG_PATH') ?? `${process.cwd()}/error.log`,
    `${dayjs().format()}: ${source} - ${error.message}\n`,
    {
      flag: 'a'
    }
  );

  log.error(source, error.message, error.stack);
}

function env(key: string): string {
  const processEnv: { [key: string]: any } = {};

  dotenv({ processEnv });

  ['DB_HOST', 'DB_USER', 'DB_PASS'].forEach(v => {
    checkForRequired(processEnv, v);
  });

  return processEnv[key];
}

export { checkForRequired, env, errorHandler, events, log, setTitle, today };
