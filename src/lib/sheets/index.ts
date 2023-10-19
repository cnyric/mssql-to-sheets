import addSheet from './add.js';
import updateSheet from './update.js';
import { setTitle } from '../common/util.js';

async function insertSheet(spreadsheetId: string, sheetName: string, data: any[], append: boolean = false) {
  const sheet = await addSheet(spreadsheetId, sheetName, append);
  const title = setTitle(sheetName);

  if (sheet) {
    const [sheetInfo, pages] = sheet;
    const sheetId = <number>pages.find(page => page.title === title)?.sheetId;
    await updateSheet(sheetInfo, sheetId, title, data);
  }
}

export default insertSheet;
