import type { CronJob } from 'cron';
import type { EventType } from 'mitt';

interface EnvVars {
  [key: string]: any;

  DB_HOST: string;
  DB_USER: string;
  DB_PASS: string;
  PORT?: number;
  ERROR_LOG_PATH?: string;
  STORE_PATH?: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVars {}
  }
}

interface Task {
  id?: string;
  name: string;
  query: string;
}

interface Job {
  [key: string]: any;

  id?: string;
  name: string;
  active?: boolean;
  spreadsheetId: string;
  database: string;
  schedule: string;
  append?: boolean;
  lastRun?: string;
  nextRun?: string;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  tasks: Task[];
}

interface Queue {
  [key: string]: CronJob;
}

interface QueueEvent {
  [key: EventType]: Job | string;
}

export type { Job, Task, Queue, QueueEvent };
