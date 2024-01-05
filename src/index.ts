import { nanoid } from 'nanoid';

import { initQueue } from './lib/api/cron.js';
import service from './lib/api/index.js';
import { env, errorHandler, log } from './lib/common/util.js';

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
  const port = env('PORT') ?? 3000;
  const token = env('TRANSACTION_KEY') ?? nanoid(64);

  initQueue();

  service.listen(port, () => {
    log.info(`Server started on port ${port}`);

    if (!env('TRANSACTION_KEY')) {
      log.info(`Transaction key: ${token}`);
    }
  });
} catch (err) {
  errorHandler(<Error>err, 'main');
}
