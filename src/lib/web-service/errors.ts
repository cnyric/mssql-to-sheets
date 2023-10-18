import status from 'http-status';
import { errorHandler as logError } from '../common/util.js';

async function errorHandler(err: Error, req: any, res: any, next: any) {
  await logError(err, 'web-service', false);

  if (res.headersSent) {
    return next(err);
  }

  res.statusCode = 500;
  res.end(JSON.stringify({ status: status[500], message: err.message, stack: err.stack }));
}

export default errorHandler;
