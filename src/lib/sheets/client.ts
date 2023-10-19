import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const auth = new JWT({
  keyFile: process.env['GOOGLE_APPLICATION_CREDENTIALS'] ?? `${process.cwd()}/credentials.json`,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
  ]
});

const sheets = google.sheets({ version: 'v4', auth });

export default sheets;
