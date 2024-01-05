import bodyParser from 'body-parser';
import polka from 'polka';

import authenticate from './auth.js';
import logger from './logger.js';
import routes from './routes.js';

function presets(req: any, res: any, next: any) {
  res.setHeader('Content-Type', 'application/json');
  next();
}

const service = polka().use(bodyParser.json(), logger, presets, authenticate);
routes(service);

export default service;
