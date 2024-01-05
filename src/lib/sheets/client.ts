import { readFile } from 'fs/promises';
import { GoogleAuth, JWT } from 'google-auth-library';
import { google } from 'googleapis';

import { env } from '../common/util.js';

const scopes = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file'
];

let auth;
if (env('GOOGLE_APPLICATION_CREDENTIALS')) {
  auth = new GoogleAuth({
    keyFile: env('GOOGLE_APPLICATION_CREDENTIALS'),
    scopes
  });
} else {
  const key = JSON.parse(await readFile(env('CREDENTIAL_FILE_PATH') ?? `${process.cwd()}/credentials.json`, 'utf-8'));

  auth = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes
  });
}

const sheets = google.sheets({ version: 'v4', auth });

export default sheets;
