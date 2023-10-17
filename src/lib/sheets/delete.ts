import type { SheetInfo } from './types.d.ts';

import { update } from './client.js';
import { errorHandler } from '../util.js';

async function deleteSheet(spreadsheet: SheetInfo, sheetId: number): Promise<void> {
  try {
    const spreadsheetId = <string>spreadsheet.data.spreadsheetId;

    const query = {
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteSheet: {
              sheetId
            }
          }
        ]
      }
    };

    await update(query);
  } catch (err) {
    await errorHandler(<Error>err, 'deleteSheet');
  }
}

export default deleteSheet;
