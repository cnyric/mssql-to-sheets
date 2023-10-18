import type { Polka } from 'polka';
import type { Job } from '../../types.d.ts';

import status from 'http-status';

import { addJob, delJob, getJob, editJob, doJob, toggleJob } from './jobs.js';

function routes(service: Polka) {
  // root
  service.get('/', (req, res) => {
    res.end(JSON.stringify({ status: status[200] }));
  });

  // add job
  service.post('/jobs', async (req, res) => {
    res.end(JSON.stringify(await addJob(req.body)));
  });

  // get job
  service.get('/jobs/:id', async (req, res) => {
    res.end(JSON.stringify(await getJob(req.params.id)));
  });

  // get all jobs
  service.get('/jobs', async (req, res) => {
    res.end(JSON.stringify(await getJob()));
  });

  // edit job
  service.put('/jobs/:id', async (req, res) => {
    res.end(JSON.stringify(await editJob(req.params.id, req.body)));
  });

  // toggle job
  service.put('/jobs/:id/toggle', async (req, res) => {
    res.end(JSON.stringify(await toggleJob(req.params.id)));
  });

  // execute job
  service.put('/jobs/:id/exec', async (req, res) => {
    const job = <Job>await getJob(req.params.id);
    res.end(JSON.stringify(await doJob(job)));
  });

  // delete job
  service.delete('/jobs/:id', async (req, res) => {
    res.end(JSON.stringify(await delJob(req.params.id)));
  });

  // fallthrough
  service.get('*', (req, res) => {
    res.statusCode = 404;
    res.end(JSON.stringify({ status: status[404] }));
  });
}

export default routes;
