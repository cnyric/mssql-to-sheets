import type { SheetInfo } from '../../types.js';

import sheets from './client.js';
import { errorHandler } from '../util.js';

async function updateSheet(spreadsheet: SheetInfo, sheetId: number, sheetName: string, data: any[]): Promise<void> {
  try {
    const headers = Object.keys(data[0]).filter(key => key !== 'ID');
    const spreadsheetId = <string>spreadsheet.data.spreadsheetId;

    // set column headers
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'OVERWRITE',
      requestBody: {
        values: [headers]
      }
    });

    // append data
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

    // format headers
    const query = {
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 1
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.0,
                    green: 0.0,
                    blue: 0.0
                  },
                  horizontalAlignment: 'CENTER',
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0
                    },
                    fontSize: 12,
                    bold: true
                  }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          },
          {
            updateSheetProperties: {
              properties: {
                sheetId,
                gridProperties: {
                  frozenRowCount: 1
                }
              },
              fields: 'gridProperties.frozenRowCount'
            }
          }
        ]
      }
    };

    await sheets.spreadsheets.batchUpdate(query);
  } catch (err) {
    await errorHandler(<Error>err, 'updateSheet');
  }
}

export default updateSheet;
