import { google } from 'googleapis';
import { GoogleAuth, JWT } from 'google-auth-library';
import { readFile } from 'fs/promises';

const scopes = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file'
];

let auth;
if (
  process.env['GOOGLE_APPLICATION_CREDENTIALS'] !== undefined &&
  process.env['GOOGLE_APPLICATION_CREDENTIALS'] !== ''
) {
  auth = new GoogleAuth({
    keyFile: process.env['GOOGLE_APPLICATION_CREDENTIALS'],
    scopes
  });
} else {
  const key = JSON.parse(
    await readFile(process.env['CREDENTIAL_FILE_PATH'] ?? `${process.cwd()}/credentials.json`, 'utf-8')
  );

  auth = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes
  });
}

const sheets = google.sheets({ version: 'v4', auth });

export default sheets;
