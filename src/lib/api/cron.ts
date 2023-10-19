import type { Job, Queue } from './types.d.ts';
import type { Handler } from 'mitt';

import { CronJob } from 'cron';
import dayjs from 'dayjs';

import { editJob, doJob, getJob } from './jobs.js';
import { log, events } from '../common/util.js';

let queue: Queue = {};

async function setNextRun(job: Job, item: CronJob) {
  job.nextRun = dayjs(item.nextDate().toString()).format();
  await editJob(<string>job.id, job);
}

async function addToQueue(job: Job) {
  const jobId = <string>job.id;
  const item = new CronJob(job.schedule, async () => await doJob(job), null, true);
  await setNextRun(job, item);
  queue[jobId] = item;
  log.debug('addToQueue', jobId);
  return item;
}

async function replaceInQueue(job: Job) {
  const jobId = <string>job.id;
  queue[jobId].stop();
  delete queue[jobId];
  const item = await addToQueue(job);
  await setNextRun(job, item);
  log.debug('updateQueue', jobId);
  return item;
}

function activateJob(jobId: string) {
  log.debug('activateJob', jobId);
  queue[jobId].start();
}

function deactivateJob(jobId: string) {
  log.debug('deactivateJob', jobId);
  queue[jobId].stop();
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
