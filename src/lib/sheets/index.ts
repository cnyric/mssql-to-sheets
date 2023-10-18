import getOrAddSheet from './getOrAdd.js';
import updateSheet from './update.js';
import deleteSheet from './delete.js';
import { setTitle, today } from '../common/util.js';

async function insertSheet(spreadsheetId: string, sheetName: string, data: any[], deleteOld: boolean = false) {
  const sheet = await getOrAddSheet(spreadsheetId, sheetName);
  const title = setTitle(sheetName);

  if (sheet) {
    const [sheetInfo, pages] = sheet;

    if (deleteOld === true) {
      const old = pages.filter(page => !page.title?.endsWith(today));

      for (const p of old) {
        await deleteSheet(sheetInfo, <number>p.sheetId);
      }
    }

    const sheetId = <number>pages.find(page => page.title === title)?.sheetId;

    await updateSheet(sheetInfo, sheetId, title, data);
  }
}

export default insertSheet;
