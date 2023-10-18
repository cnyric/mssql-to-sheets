import status from 'http-status';

import { log } from '../common/util.js';

function logger(req: any, res: any, next: any) {
  res.on('finish', () => {
    const message = [req.method, decodeURI(<string>req.url), res.statusCode, status[res.statusCode]];

    if (res.statusCode < 400) {
      log.info(...message);
    } else if (res.statusCode < 500) {
      log.warn(...message);
    } else {
      log.error(...message);
    }
  });

  next();
}

export default logger;
