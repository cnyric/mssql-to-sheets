import { nanoid } from 'nanoid';

import service from './lib/api/index.js';
import { log, errorHandler } from './lib/common/util.js';
import loadEnv from './lib/common/env.js';
import { initQueue } from './lib/api/cron.js';

process.on('SIGTERM', async e => {
  await errorHandler(new Error(e), 'SIGTERM');
});
process.on('SIGINT', async e => {
  await errorHandler(new Error(e), 'SIGINT');
});
process.on('uncaughtException', async err => {
  await errorHandler(err, 'uncaughtException');
});

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
} catch (err) {
  errorHandler(<Error>err, 'main');
}
