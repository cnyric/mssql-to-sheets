import polka from 'polka';
import bodyParser from 'body-parser';

import routes from './routes.js';
import logger from './logger.js';
import errorHandler from './errors.js';

function presets(req: any, res: any, next: any) {
  res.setHeader('Content-Type', 'application/json');
  next();
}

const service = polka().use(bodyParser.json(), logger, presets);
service.server?.on('error', errorHandler);
routes(service);

export default service;
