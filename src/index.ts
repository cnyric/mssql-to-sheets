import { nanoid } from 'nanoid';

import service from './lib/api/index.js';
import { log, errorHandler } from './lib/common/util.js';
import loadEnv from './lib/common/env.js';
import { initQueue } from './lib/api/cron.js';

try {
  loadEnv();

  const port = process.env['PORT'] ?? 3000;
  const token = process.env['TRANSACTION_KEY'] ?? nanoid(64);

  initQueue();

  service.listen(port, () => {
    log.info(`Server started on port ${port}`);

    if (!process.env['TRANSACTION_KEY']) {
      log.info(`Transaction key: ${token}`);
    }
  });

  process.on('SIGTERM', e => {
    errorHandler(new Error(e), 'SIGTERM').then(() => {
      process.exit(0);
    });
  });

  process.on('SIGINT', e => {
    errorHandler(new Error(e), 'SIGINT').then(() => {
      process.exit(1);
    });
  });

  process.on('uncaughtException', async err => {
    await errorHandler(err, 'uncaughtException');
  });
} catch (err) {
  errorHandler(<Error>err, 'main');
}
