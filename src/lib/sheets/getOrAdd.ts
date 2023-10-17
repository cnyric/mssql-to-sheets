import type { SheetInfo, SheetProperties } from '../../types.js';

import dayjs from 'dayjs';

import sheets from './client.js';
import { errorHandler } from '../util.js';

const today = dayjs().format('YYYY_MM_DD');

async function getOrAddSheet(spreadsheetId: string, sheetName: string): Promise<[SheetInfo, SheetProperties[]] | void> {
  try {
    const title = `${sheetName}_${today}`;

    const sheet = await sheets.spreadsheets.get({
      spreadsheetId
    });

    if (!sheet.data.sheets?.find(sheet => sheet.properties?.title === title)) {
      const pages = await sheets.spreadsheets.batchUpdate({
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
      });

      return [sheet, <SheetProperties[]>pages.data.replies?.map(reply => reply.addSheet?.properties)];
    } else {
      return [sheet, <SheetProperties[]>sheet.data.sheets?.map(sheet => sheet.properties)];
    }
  } catch (err) {
    await errorHandler(<Error>err, 'getOrAddSheet');
  }
}

export default getOrAddSheet;
