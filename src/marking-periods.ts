import type { MarkingPeriod, Progress } from './types.d.ts';

import { config } from 'dotenv';

import db from './lib/db.js';
import insertSheet from './lib/sheets/index.js';
import { log } from './lib/util.js';

config();

async function main() {
  const spreadsheetId = '1KD-cCOJEdNCWFU1RTG15xE_6BB_NTaoJ5ioBj6iR9W4';
  const markingPeriods = <MarkingPeriod[]>await db('ksync').select('*').from('MarkingPeriods');
  const progress = <Progress[]>await db('ksync').select('*').from('Progress');

  await insertSheet(spreadsheetId, 'Marking_Periods', markingPeriods, true);
  await insertSheet(spreadsheetId, 'Progress', progress, true);

  log.debug('Spreadsheets `Marking_Periods` and `Progress` updated successfully');
  process.exit(0);
}

main();
