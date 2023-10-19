import type { Job, Queue } from './types.d.ts';
import type { Handler } from 'mitt';

import { CronJob } from 'cron';

import { doJob, getJob } from './jobs.js';
import { log, events } from '../common/util.js';

let queue: Queue = {};

async function addToQueue(job: Job) {
  const jobId = <string>job.id;
  log.debug('addToQueue', jobId);
  const item = new CronJob(job.schedule, async () => <void>await doJob(job), null, true);
  queue[jobId] = item;
  return item;
}

async function replaceInQueue(job: Job) {
  const jobId = <string>job.id;
  log.debug('replaceInQueue', jobId);
  queue[jobId]?.stop();
  delete queue[jobId];
  const item = await addToQueue(job);
  return item;
}

function activateJob(jobId: string) {
  log.debug('activateJob', jobId);
  queue[jobId]?.start();
}

function deactivateJob(jobId: string) {
  log.debug('deactivateJob', jobId);
  queue[jobId]?.stop();
}

function deleteFromQueue(jobId: string) {
  log.debug('deleteFromQueue', jobId);
  deactivateJob(jobId);
  delete queue[jobId];
}

function getQueue() {
  return queue;
}

async function initQueue() {
  const jobs = <Job[]>await getJob();
  for (const job of jobs) {
    await addToQueue(job);
  }
  events.on('jobAdded', <Handler>(async (job: Job) => await addToQueue(job)));
  events.on('jobEdited', <Handler>(async (job: Job) => await replaceInQueue(job)));
  events.on('jobDeleted', <Handler>(async (jobId: string) => deleteFromQueue(jobId)));
  events.on('jobToggled', <Handler>(async (job: Job) => {
    const jobId = <string>job.id;
    if (job.active) {
      activateJob(jobId);
    } else {
      deactivateJob(jobId);
    }
  }));
}

export { addToQueue, getQueue, replaceInQueue, deleteFromQueue, initQueue, activateJob, deactivateJob };
