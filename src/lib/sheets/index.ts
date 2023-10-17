import getOrAddSheet from './getOrAdd.js';
import updateSheet from './update.js';
import deleteSheet from './delete.js';
import { log, setTitle, today } from '../util.js';

async function insertSheet(spreadsheetId: string, sheetName: string, data: any[], deleteOld: boolean = false) {
  const sheet = await getOrAddSheet(spreadsheetId, sheetName);
  const title = setTitle(sheetName);

  if (sheet) {
    const [sheetInfo, pages] = sheet;
    // log.debug('sheetInfo', sheetInfo);

    if (deleteOld === true) {
      const old = pages.filter(page => !page.title?.endsWith(today));
      // log.debug('oldEntries', old);

      for (const p of old) {
        await deleteSheet(sheetInfo, <number>p.sheetId);
      }
    }

    const sheetId = <number>pages.find(page => page.title === title)?.sheetId;
    // log.debug('sheetId', sheetId);

    await updateSheet(sheetInfo, sheetId, title, data);
  }
}

export default insertSheet;
