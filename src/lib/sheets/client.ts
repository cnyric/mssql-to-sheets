import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { readFile } from 'fs/promises';

const scopes = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file'
];

const key = JSON.parse(
  await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS ?? `${process.cwd()}/credentials.json`, 'utf-8')
);

const auth = new JWT({
  email: key.client_email,
  key: key.private_key,
  scopes
});

const sheets = google.sheets({ version: 'v4', auth });

export default sheets;
