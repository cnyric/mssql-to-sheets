import type { Polka } from 'polka';
import status from 'http-status';

function routes(service: Polka) {
  // root
  service.get('/', (req, res) => {
    res.end(JSON.stringify({ status: status[200] }));
  });

  // fallthrough
  service.get('*', (req, res) => {
    res.statusCode = 404;
    res.end(JSON.stringify({ status: status[404] }));
  });
}

export default routes;
