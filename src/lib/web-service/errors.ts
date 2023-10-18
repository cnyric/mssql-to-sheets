import status from 'http-status';
import { log, errorHandler as logError } from '../common/util.js';

async function errorHandler(err: Error, req: any, res: any) {
  await logError(err, 'webService');

  if (err.message.includes('required') || err.message.includes('invalid')) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ status: status[400], message: err.message }));
  } else {
    res.statusCode = 500;
    res.end(JSON.stringify({ status: status[500], message: err.message, stack: err.stack }));
  }
}

export default errorHandler;
