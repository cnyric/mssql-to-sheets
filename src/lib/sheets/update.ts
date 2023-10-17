import type { SheetInfo } from './types.d.ts';

import { append, update } from './client.js';
import headerRow from './headerRow.js';
import { errorHandler } from '../util.js';

async function updateSheet(spreadsheet: SheetInfo, sheetId: number, sheetName: string, data: any[]): Promise<void> {
  try {
    const headers = Object.keys(data[0]).filter(key => key !== 'ID');
    const spreadsheetId = <string>spreadsheet.data.spreadsheetId;

    await append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'OVERWRITE',
      requestBody: {
        values: [headers]
      }
    });

    await append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: data.map(i => {
          delete i.ID;
          return Object.values(i);
        })
      }
    });

    await update(headerRow(spreadsheetId, sheetId));
  } catch (err) {
    await errorHandler(<Error>err, 'updateSheet');
  }
}

export default updateSheet;
