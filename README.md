# Export MSSQL data to Google Sheets as-a-service

[![Tests](https://github.com/cnyric/mssql-to-sheets/actions/workflows/test.yaml/badge.svg)](https://github.com/cnyric/mssql-to-sheets/actions/workflows/test.yaml)

Node.js service to automate exports of data from a SQL Server instance to Google Sheets on a user-specified schedule.

Features:

- Job data persisted between runs with SQLite
- Queries linted with [tsqllint](https://github.com/tsqllint/tsqllint)
- Uses [Hurl](https://hurl.dev/) for testing

Roadmap:

- [ ] Email alerts on job completion
- [ ] Support for multiple database instances
- [ ] Frontend interface

## Usage

1. Create a new [Google Sheets](https://sheets.google.com) spreadsheet or edit the spreadsheet you wish to update.\*
2. Click the `Share` button and add `sheets@edsapps.iam.gserviceaccount.com` (or your own service account) as an Editor.
3. Grab the `spreadsheetId` value from the URL. It's the long string of characters between `/d/` and `/edit`.
4. Visit [Crontab.guru](https://crontab.guru) to generate a cron schedule.
5. Create a new [Hurl](https://hurl.dev/) file containing your API request (see the [`jobs`](https://github.com/cnyric/mssql-to-sheets/tree/main/jobs) folder for examples) or use your preferred REST client.

\*The spreadsheet must be manually created because the application was developed with a service account that does not
have direct access to the organization's Google Workspace and therefore does not have permissions to create a document within the
workspace. This will be remedied in a future release.

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
- Production: `https://sheetsvc.edsapps.cnyric.org` (RIC internal LAN only)

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
    - `append`: Add new worksheets (vs. overwrite existing)
    - `email`: Email to alert on job completion (not implemented)
    - `tasks`: Array of tasks
      - `query`: Raw SQL query or SQL file URL (http/s only)
      - `name`: Worksheet name (will be appended with date)

#### `/jobs/:id`

- `GET`: Returns job details.
- `PUT`: Updates job.

  - Parameters same as above for `POST` request.

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
git clone git@github.com:cnyric/mssql-to-sheets.git
cd mssql-to-sheets
npm i
```

### Configure

#### Google authentication

This service requires access to the following Google APIs which must be enabled in the Google Cloud Console:

- Google Sheets API
- IAM Service Account Credentials API

It also requires the creation of a service account with the following roles:

- Service Account Token Creator
- Service Account User
- Viewer
- Workload Identity User (for GitHub Actions CI/CD)

Tokens can be provided to the application by the [`gcloud` CLI](https://cloud.google.com/sdk/docs/install) or by a [service account key](https://cloud.google.com/iam/docs/keys-create-delete) file.

Future releases will require the creation of a Google Workspaces Custom Admin Role with full access to Google Docs,
Sheets, and Drive, and its assignment to the service account.

#### Environment variables

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

Launches a web server on the user-specified port or `3000` by default.

```sh
npm start
```

## Development

### Develop

Launches a web server, recompiling and restarting the server on file changes.

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

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Copyright &copy;2023 CNYRIC. Distributed under the [MIT license](https://github.com/cnyric/mssql-to-sheets/blob/main/LICENSE.txt).
