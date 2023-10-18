import polka from 'polka';

import routes from './routes.js';
import logger from './logger.js';

function presets(req: any, res: any, next: any) {
  res.setHeader('Content-Type', 'application/json');
  next();
}

const service = polka().use(logger, presets);
routes(service);

export default service;
