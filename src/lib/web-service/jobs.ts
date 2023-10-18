import type { DeserializedData } from '@keyvhq/core';
import type { Job } from '../../types.d.ts';

import { nanoid } from 'nanoid';

import store from '../common/store.js';
import { log } from '../common/util.js';

// add job
async function addJob(job: Job) {
  job.id = nanoid(18);
  job.active = true;
  job.tasks = job.tasks.map(task => {
    task.id = nanoid(18);
    return task;
  });
  log.debug('addJob', job);
  return await store.set(job.id, job);
}

// delete job
async function delJob(jobId: string) {
  log.debug('delJob', jobId);
  store.delete(jobId);
}

// edit job
async function editJob(jobId: string, job: Job) {
  log.debug('editJob', jobId, job);
  return await store.set(jobId, job);
}

// toggle job
async function toggleJob(jobId: string) {
  const job = <Job>await store.get(jobId);
  job.active = !job.active;
  log.debug('toggleJob', jobId, job.active);
  return await store.set(jobId, job);
}

// get job(s)
async function getJob(jobId?: string): Promise<Job | Job[] | void> {
  if (jobId) {
    log.debug('getJob', jobId);
    return await store.get(jobId);
  } else {
    let jobs: any[] = [];
    const values = store.iterator();
    log.debug('getJob', values);
    for await (const [key, value] of values as AsyncIterableIterator<[string, DeserializedData<string>]>) {
      jobs.push(value);
    }
    log.debug('getJob', jobs);
    return jobs;
  }
}

// do job
async function doJob(job: Job) {
  log.debug('doJob', job.id);
  await Promise.all(
    job.tasks.map(task => {
      log.debug('doJob', task.id);
    })
  );
}

export { addJob, editJob, toggleJob, delJob, getJob, doJob };
