import service from './lib/web-service/index.js';
import { log, errorHandler } from './lib/common/util.js';
import loadEnv from './lib/common/env.js';

try {
  loadEnv();

  const port = process.env['PORT'] ?? 3000;

  service.listen(port, () => {
    log.info(`Server started on port ${port}`);
  });
} catch (err) {
  errorHandler(<Error>err, 'main');
}
