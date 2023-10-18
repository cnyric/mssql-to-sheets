import type { SheetInfo, SheetProperties } from './types.js';

import { get, update } from './client.js';
import { errorHandler, setTitle } from '../common/util.js';

async function getOrAddSheet(spreadsheetId: string, sheetName: string): Promise<[SheetInfo, SheetProperties[]] | void> {
  try {
    const title = setTitle(sheetName);

    const sheet = await get({
      spreadsheetId
    });

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

      const pages = await update(query);

      return [sheet, <SheetProperties[]>pages.data.replies?.map(reply => reply.addSheet?.properties)];
    } else {
      return [sheet, <SheetProperties[]>sheet.data.sheets?.map(sheet => sheet.properties)];
    }
  } catch (err) {
    await errorHandler(<Error>err, 'getOrAddSheet');
  }
}

export default getOrAddSheet;
