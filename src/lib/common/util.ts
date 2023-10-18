import type { ILogObj } from 'tslog';

import { writeFile } from 'fs/promises';
import { Logger } from 'tslog';
import dayjs from 'dayjs';

/** # `log`
 * Creates a new instance of the `Logger` class, which is used throughout the application to log messages to the
 * console.
 * @returns A `Logger` instance.
 */
const log: Logger<ILogObj> = new Logger();

/** # `today`
 * @returns A string that is the current date in the format `YYYY_MM_DD`.
 */
const today = dayjs().format('YYYY_MM_DD');

/** # `setTitle`
 * This function is used to create unique titles or filenames for files or logs that are created by the application.
 * @param text - The text to use in the title.
 * @returns A string that is the concatenation of `text` and the `today` constant variable, separated by an underscore.
 */
function setTitle(text: string) {
  return `${text}_${today}`;
}

/** # `errorHandler`
 * The function first writes a log message to a file specified by the `ERROR_LOG_PATH` environment variable, then logs
 * the error message to the console. Finally, it exits the Node.js process.
 * @param error - An `Error` object.
 * @param source - The source of the error.
 * @param exit - Whether or not to exit the Node.js process. Defaults to `true`.
 */
async function errorHandler(error: Error, source: string, exit: boolean = true) {
  await writeFile(<string>process.env['ERROR_LOG_PATH'], `${dayjs().format()}: ${source} - ${error.message}\n`, {
    flag: 'a'
  });

  log.error(source, error.message);

  if (exit) {
    process.exit(1);
  }
}

export { log, today, errorHandler, setTitle };
