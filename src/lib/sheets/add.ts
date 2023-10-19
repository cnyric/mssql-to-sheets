import type { SheetInfo, SheetProperties } from './types.js';

import sheets from './client.js';
import { log, setTitle } from '../common/util.js';
import deleteSheet from './delete.js';

async function addSheet(
  spreadsheetId: string,
  sheetName: string,
  append: boolean = false
): Promise<[SheetInfo, SheetProperties[]] | void> {
  // log.debug('addSheet', { spreadsheetId, sheetName });
  const title = setTitle(sheetName);
  const sheet = await sheets.spreadsheets.get({
    spreadsheetId
  });
  // log.debug('addSheet', title, { sheet });
  if (append === false) {
    const old = sheet.data.sheets?.filter(s => s.properties?.title !== title) ?? [];
    for (const s of old) {
      await deleteSheet(sheet, <number>s.properties?.sheetId);
    }
  }

  if (!sheet.data.sheets?.find(sheet => sheet.properties?.title === title)) {
    const query = {
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title
              }
            }
          }
        ]
      }
    };
    const pages = await sheets.spreadsheets.batchUpdate(query);
    return [sheet, <SheetProperties[]>pages.data.replies?.map(reply => reply.addSheet?.properties)];
  } else {
    const query = {
      spreadsheetId,
      requestBody: {
        ranges: [`${title}!A1:ZZ1000000`]
      }
    };
    await sheets.spreadsheets.values.batchClear(query);
    return [sheet, <SheetProperties[]>sheet.data.sheets?.map(sheet => sheet.properties)];
  }
}

export default addSheet;
