import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { readFile } from 'fs/promises';

const key = JSON.parse(await readFile(`${process.cwd()}/credentials.json`, 'utf-8'));

const auth = new JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
  ]
});

const sheets = google.sheets({ version: 'v4', auth });

export default sheets;
