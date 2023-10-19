import type { DeserializedData } from '@keyvhq/core';
import type { Job } from './types.js';

import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { writeFile, unlink } from 'fs/promises';
import { execa } from 'execa';
import { tmpdir } from 'os';

import insertSheet from '../sheets/index.js';
import store from '../common/store.js';
import { events, log, checkForRequired } from '../common/util.js';
import db from '../common/db.js';

// add job
async function addJob(job: Job): Promise<Job | Error> {
  ['name', 'spreadsheetId', 'database', 'schedule', 'tasks'].forEach(v => {
    checkForRequired(job, v);
  });

  if (job.tasks.length === 0) {
    throw new Error(`\`tasks\` definitions are required`);
  }

  job.id = nanoid(18);
  job.active = job.active ?? true;
  job.append = job.append ?? false;

  const now = dayjs().format();
  job.createdAt = now;
  job.updatedAt = now;

  let tasks = [];
  for (const task of job.tasks) {
    task.id = nanoid(18);

    if (task.query.startsWith('http')) {
      task.query = await (await fetch(task.query)).text();
    }

    const tmpFile = `/${tmpdir()}/${task.id}.sql`;
    // log.debug('addJob', tmpFile);
    await writeFile(tmpFile, task.query);
    await execa(`tsqllint`, [tmpFile]);
    await unlink(tmpFile);

    tasks.push(task);
  }
  job.tasks = tasks;

  // log.debug('addJob', job);
  await store.set(job.id, job);
  events.emit('jobAdded', job);
  return job;
}

// delete job
async function delJob(jobId: string) {
  // log.debug('delJob', jobId);
  await store.delete(jobId);
  events.emit('jobDeleted', jobId);
  return {
    id: jobId,
    deletedAt: dayjs().format()
  };
}

// edit job
async function editJob(jobId: string, job: Job) {
  job.updatedAt = dayjs().format();
  // log.debug('editJob', jobId, job);
  await store.set(jobId, job);
  events.emit('jobEdited', job);
  return job;
}

// toggle job
async function toggleJob(jobId: string) {
  const job = <Job>await store.get(jobId);
  job.active = !job.active;
  job.updatedAt = dayjs().format();
  // log.debug('toggleJob', jobId, job.active);
  await store.set(jobId, job);
  events.emit('jobToggled', job);
  return job;
}

// get job(s)
async function getJob(jobId?: string): Promise<Job | Job[] | void> {
  if (jobId) {
    // log.debug('getJob', jobId);
    return await store.get(jobId);
  } else {
    let jobs: any[] = [];
    const values = store.iterator();
    // log.debug('getJob', values);
    for await (const [key, value] of values as AsyncIterableIterator<[string, DeserializedData<string>]>) {
      jobs.push(value);
    }
    // log.debug('getJob', jobs);
    return jobs;
  }
}

// do job
async function doJob(job: Job) {
  // log.debug('doJob', job.id);
  if (job.active) {
    for (const task of job.tasks) {
      const data = await db(job.database).raw(task.query);
      // log.debug('doJob', job.id, data);
      await insertSheet(job.spreadsheetId, job.name, data, job.append);
    }
    job.lastRun = dayjs().format();
    await editJob(<string>job.id, job);
    log.info('doJob', job.id, `\`https://docs.google.com/spreadsheets/d/${job.spreadsheetId}/\` updated successfully`);
    return job;
  } else {
    return false;
  }
}

export { addJob, editJob, toggleJob, delJob, getJob, doJob };
