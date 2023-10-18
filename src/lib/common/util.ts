import type { ILogObj } from 'tslog';

import { writeFile } from 'fs/promises';
import { Logger } from 'tslog';
import dayjs from 'dayjs';

const log: Logger<ILogObj> = new Logger();
const today = dayjs().format('YYYY_MM_DD');

function setTitle(text: string) {
  return `${text}_${today}`;
}

async function errorHandler(error: Error, source: string) {
  await writeFile(<string>process.env.ERROR_LOG_PATH, `${dayjs().format()}: ${source} - ${error.message}\n`, {
    flag: 'a'
  });
  log.error(source, error.message);
  process.exit(1);
}

export { log, today, errorHandler, setTitle };
