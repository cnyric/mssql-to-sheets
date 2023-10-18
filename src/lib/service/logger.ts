import status from 'http-status';

import { log } from '../util.js';

function logger(req: any, res: any, next: any) {
  const { info, warn, error } = log;

  res.on('finish', () => {
    const message = [req.method, decodeURI(<string>req.url), res.statusCode, status[res.statusCode]];

    if (res.statusCode < 400) {
      info(...message);
    } else if (res.statusCode < 500) {
      warn(...message);
    } else {
      error(...message);
    }
  });

  next();
}

export default logger;
