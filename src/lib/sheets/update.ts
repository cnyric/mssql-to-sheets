import type { SheetInfo } from './types.d.ts';

import sheets from './client.js';
import headerRow from './header.js';

async function updateSheet(spreadsheet: SheetInfo, sheetId: number, sheetName: string, data: any[]): Promise<void> {
  const headers = Object.keys(data[0]).filter(key => key !== 'ID');
  const spreadsheetId = <string>spreadsheet.data.spreadsheetId;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetName,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'OVERWRITE',
    requestBody: {
      values: [headers]
    }
  });

  await sheets.spreadsheets.values.append({
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

  await sheets.spreadsheets.batchUpdate(headerRow(spreadsheetId, sheetId));
}

export default updateSheet;
