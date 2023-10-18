import type { SheetInfo, SheetProperties } from './types.js';

import sheets from './client.js';
import { log, setTitle } from '../common/util.js';

async function getOrAddSheet(spreadsheetId: string, sheetName: string): Promise<[SheetInfo, SheetProperties[]] | void> {
  log.debug('getOrAddSheet', { spreadsheetId, sheetName });

  const title = setTitle(sheetName);

  const sheet = await sheets.spreadsheets.get({
    spreadsheetId
  });

  log.debug('getOrAddSheet', { sheet });

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
    return [sheet, <SheetProperties[]>sheet.data.sheets?.map(sheet => sheet.properties)];
  }
}

export default getOrAddSheet;
