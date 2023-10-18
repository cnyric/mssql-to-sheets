import { config } from 'dotenv';

import service from './lib/service/index.js';
import { log, errorHandler } from './lib/util.js';

try {
  config();

  const port = process.env.PORT ?? 3000;

  service.listen(port, () => {
    log.info(`Server started on port ${port}`);
  });
} catch (err) {
  errorHandler(<Error>err, 'main');
}
