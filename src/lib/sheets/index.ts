import getOrAddSheet from './get-or-add.js';
import updateSheet from './update.js';
import deleteSheet from './delete.js';
import { setTitle, today } from '../common/util.js';

async function insertSheet(spreadsheetId: string, sheetName: string, data: any[], append: boolean = false) {
  const sheet = await getOrAddSheet(spreadsheetId, sheetName);
  const title = setTitle(sheetName);

  if (sheet) {
    const [sheetInfo, pages] = sheet;

    if (append === false) {
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
