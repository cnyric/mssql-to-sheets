# Export Microsoft SQL data to Google Sheets as-a-service

[![Tests](https://github.com/cnyric/export-to-sheets/actions/workflows/test.yaml/badge.svg)](https://github.com/cnyric/export-to-sheets/actions/workflows/test.yaml)

Node.js service to automate exports of data from a SQL Server instance to Google Sheets on a user-specified schedule.

Features:

- Job data is persisted between runs with SQLite.
- Queries are linted with [tsqllint](https://github.com/tsqllint/tsqllint).
- Uses [Hurl](https://hurl.dev/) for testing.

## Usage

1. Create a new [Google Sheets](https://sheets.google.com) spreadsheet or edit the spreadsheet you wish to update.
2. Click the `Share` button and add `sheets@edsapps.iam.gserviceaccount.com` as an Editor.
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

To obtain the production transaction key, contact the Data Integrations team within the Educational Data Services
department at [CNYRIC](https://www.cnyric.org/).

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
      - `query`: Raw SQL query or URL to a SQL file
      - `name`: Worksheet name

#### `/jobs/:id`

- `GET`: Returns job details.
- `PUT`: Updates job.

  - Parameters:
    - `name`: Job name
    - `schedule`: Cron schedule
    - `spreadsheetId`: Google Sheet ID
    - `tasks`: Array of tasks
      - `query`: Raw SQL query or URL to a SQL file
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
# These are required
DB_HOST="[database host]"
DB_PASS="[database password]"
DB_USER="[database user]"

# One of either is required
GOOGLE_APPLICATION_CREDENTIALS="[gcloud default credentials]"
CREDENTIAL_FILE_PATH="[gcloud jwt credentials]"

# Not required but recommended
TRANSACTION_KEY="[unencoded transaction key]" # autogenerates if unspecified

# Optional
PORT="[port number]" # defaults to 3000
ERROR_LOG_PATH="[log file path]" # defaults to `./error.log`
STORE_PATH="[data store path]" # defaults to `./store.sqlite`
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

#### Set variables

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
