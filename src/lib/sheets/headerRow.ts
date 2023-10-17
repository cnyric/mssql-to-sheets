function headerRow(spreadsheetId: string, sheetId: number) {
  return {
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
}

export default headerRow;
