import { nanoid } from 'nanoid';

import service from './lib/api/index.js';
import { log, errorHandler } from './lib/common/util.js';
import loadEnv from './lib/common/env.js';

try {
  loadEnv();

  const port = process.env['PORT'] ?? 3000;
  const token = process.env['TRANSACTION_KEY'] ?? nanoid(64);

  service.listen(port, () => {
    log.info(`Server started on port ${port}`);

    if (!process.env['TRANSACTION_KEY']) {
      log.info(`Transaction key: ${token}`);
    }
  });
} catch (err) {
  errorHandler(<Error>err, 'main');
}
