# Export SQL to Google Sheets

[![Tests](https://github.com/cnyric/export-to-sheets/actions/workflows/test.yaml/badge.svg)](https://github.com/cnyric/export-to-sheets/actions/workflows/test.yaml)

Automates exports of data from SQL Server to Google Sheets on a schedule.

## Usage

1. Create a new Google Sheets spreadsheet or edit the spreadsheet you want to update.
2. Click the `Share` button and add `sheets@edsapps.iam.gserviceaccount.com` as an editor.
3. Grab the `spreadsheetId` value from the URL. It's the long string of characters between `/d/` and `/edit`.
4. Visit [Crontab.guru](https://crontab.guru) to generate a cron schedule.
5. Create a new [Hurl](https://hurl.dev/) file containing your API request (see the [`jobs`](https://github.com/cnyric/export-to-sheets/tree/main/jobs) folder for examples) or use your preferred REST client.

## API

### Authentication

All requests require an `Authorization` header with a `Bearer` token. The value should be the encoded transaction key
generated during configuration. E.g.:

```sh
Authorization: Bearer [encoded transaction key]
```

### Base URLs

- Development: `http://localhost:3000`
- Production: `https://sheetsvc.edsapps.cnyric.org`

### Endpoints

#### `/`

- `GET`: Returns server status.

#### `/jobs`

- `GET`: Returns list of jobs.
- `POST`: Creates a new job.
  - Parameters:
    - `name`: Job name
    - `schedule`: Cron schedule
    - `spreadsheetId`: Google Sheet ID
    - `tasks`: Array of tasks
      - `query`: SQL query
      - `name`: Worksheet name

#### `/jobs/:id`

- `GET`: Returns job details.
- `PUT`: Updates job.

  - Parameters:
    - `name`: Job name
    - `schedule`: Cron schedule
    - `spreadsheetId`: Google Sheet ID
    - `tasks`: Array of tasks
      - `query`: SQL query
      - `name`: Worksheet name

- `DELETE`: Deletes job.

#### `/jobs/:id/toggle`

- `PUT`: Toggles job from active to inactive and vice-versa.

#### `/jobs/:id/exec`

- `PUT`: Executes job.

#### `/queue`

- `GET`: Returns list of queued jobs.

#### `/queue:id`

- `GET`: Returns queued job details.

## Setup

### Install

```sh
git clone git@github.com:cnyric/export-to-sheets.git
cd export-to-sheets
npm i
```

### Configure

Generate a transaction key by running the following command in the terminal:

```sh
TRANSACTION_KEY="$(openssl rand -hex 64)"
echo -n "$TRANSACTION_KEY"
```

Then, encode the transaction key in base64:

```sh
echo -n "$TRANSACTION_KEY" | base64 -w 0
```

Create a `.env` file in the project root with the following variables or set them as environment variables.

```sh
DB_HOST="[database host]"
DB_PASS="[database password]"
DB_USER="[database user]"
TRANSACTION_KEY="[unencoded transaction key]"
```

### Run service

Launches a web server on port 3000.

```sh
npm start
```

## Development

### Develop

Launches a web server on port 3000 and restarts when files change.

```sh
npm run dev
```

### Test

#### Configure

Create a `.env.hurl` file in the `tests` folder with the following variables:

```sh
host="[host:port]"
database="[database name]"
token="[encoded transaction key]"
sheetId="[Google Sheet ID]"
schedule="[cron schedule]"
query="[SQL query]"
name="[job name]"
```

Run the tests:

```sh
npm test
```
