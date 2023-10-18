import type { SheetInfo } from './types.d.ts';

import sheets from './client.js';

async function deleteSheet(spreadsheet: SheetInfo, sheetId: number): Promise<void> {
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

  await sheets.spreadsheets.batchUpdate(query);
}

export default deleteSheet;
