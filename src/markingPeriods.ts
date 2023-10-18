import { config } from 'dotenv';

import db from './lib/common/db.js';
import insertSheet from './lib/sheets/index.js';
import { log } from './lib/common/util.js';

config();

async function main() {
  const spreadsheetId = '1KD-cCOJEdNCWFU1RTG15xE_6BB_NTaoJ5ioBj6iR9W4';
  const markingPeriods = await db('ksync').select('*').from('MarkingPeriods');
  const progress = await db('ksync').select('*').from('Progress');

  await insertSheet(spreadsheetId, 'Marking_Periods', markingPeriods, true);
  await insertSheet(spreadsheetId, 'Progress', progress, true);

  log.debug('Spreadsheets `Marking_Periods` and `Progress` updated successfully');
  process.exit(0);
}

main();
