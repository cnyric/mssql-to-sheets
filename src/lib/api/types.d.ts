import type { CronJob } from 'cron';
import type { EventType } from 'mitt';

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

export type { Job, Queue, QueueEvent, Task };
