import type { Polka } from 'polka';
import type { Job } from './types.js';

import status from 'http-status';
import stringify from 'safe-stable-stringify';

import errorHandler from './errors.js';
import { addJob, delJob, getJob, editJob, doJob, toggleJob } from './jobs.js';
import { getQueue } from './cron.js';

function routes(service: Polka) {
  // root
  service.get('/', (req, res) => {
    res.end(stringify({ status: status[200] }));
  });

  // add job
  service.post('/jobs', async (req, res) => {
    if (!req.body) {
      res.statusCode = 400;
      return res.end(stringify({ status: status[400] }));
    }

    try {
      const job = await addJob(req.body);
      res.statusCode = 201;
      res.end(stringify(job));
    } catch (err) {
      errorHandler(<Error>err, req, res);
    }
  });

  // get job
  service.get('/jobs/:id', async (req, res) => {
    try {
      res.end(stringify(await getJob(req.params.id)));
    } catch (err) {
      errorHandler(<Error>err, req, res);
    }
  });

  // get all jobs
  service.get('/jobs', async (req, res) => {
    try {
      res.end(stringify(await getJob()));
    } catch (err) {
      errorHandler(<Error>err, req, res);
    }
  });

  // get queue item
  service.get('/queue/:id', async (req, res) => {
    try {
      res.end(stringify(getQueue()[req.params.id]));
    } catch (err) {
      errorHandler(<Error>err, req, res);
    }
  });

  // get all queue items
  service.get('/queue', async (req, res) => {
    try {
      res.end(stringify(getQueue()));
    } catch (err) {
      errorHandler(<Error>err, req, res);
    }
  });

  // edit job
  service.put('/jobs/:id', async (req, res) => {
    try {
      res.statusCode = 202;
      res.end(stringify(await editJob(req.params.id, req.body)));
    } catch (err) {
      errorHandler(<Error>err, req, res);
    }
  });

  // toggle job
  service.put('/jobs/:id/toggle', async (req, res) => {
    try {
      res.statusCode = 202;
      res.end(stringify(await toggleJob(req.params.id)));
    } catch (err) {
      errorHandler(<Error>err, req, res);
    }
  });

  // execute job
  service.put('/jobs/:id/exec', async (req, res) => {
    try {
      const job = <Job>await getJob(req.params.id);
      const exec = <Job | boolean>await doJob(job);

      let response;
      if (exec === false) {
        res.statusCode = 400;
        response = {
          status: status[400]
        };
      } else {
        res.statusCode = 202;
        response = job;
      }

      res.end(stringify(response));
    } catch (err) {
      errorHandler(<Error>err, req, res);
    }
  });

  // delete job
  service.delete('/jobs/:id', async (req, res) => {
    try {
      res.statusCode = 202;
      res.end(stringify(await delJob(req.params.id)));
    } catch (err) {
      errorHandler(<Error>err, req, res);
    }
  });

  // fallthrough
  service.get('*', (req, res) => {
    res.statusCode = 404;
    res.end(stringify({ status: status[404] }));
  });
}

export default routes;
