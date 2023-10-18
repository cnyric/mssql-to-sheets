# No `body`
POST http://localhost:3000/jobs
Content-Type: application/json
HTTP 400

# No `name`
POST http://localhost:3000/jobs
Content-Type: application/json
{
  "spreadsheetId": "11AbOJlQLxbGi1ATEI8gncnUlVde2FHNT7RZdcaGySzI",
  "database": "KSYNC",
  "schedule": "0 1 1 * *",
  "tasks": [{"name": "test-task", "query": "SELECT * FROM \"District\";"}]
}
HTTP 400

# No `spreadsheetId`
POST http://localhost:3000/jobs
Content-Type: application/json
{
  "name": "test-job",
  "database": "KSYNC",
  "schedule": "0 1 1 * *",
  "tasks": [{"name": "test-task", "query": "SELECT * FROM \"District\";"}]
}
HTTP 400

# No `database`
POST http://localhost:3000/jobs
Content-Type: application/json
{
  "name": "test-job",
  "spreadsheetId": "11AbOJlQLxbGi1ATEI8gncnUlVde2FHNT7RZdcaGySzI",
  "schedule": "0 1 1 * *",
  "tasks": [{"name": "test-task", "query": "SELECT * FROM \"District\";"}]
}
HTTP 400

# No `schedule`
POST http://localhost:3000/jobs
Content-Type: application/json
{
  "name": "test-job",
  "spreadsheetId": "11AbOJlQLxbGi1ATEI8gncnUlVde2FHNT7RZdcaGySzI",
  "database": "KSYNC",
  "tasks": [{"name": "test-task", "query": "SELECT * FROM \"District\";"}]
}
HTTP 400

# No `tasks`
POST http://localhost:3000/jobs
Content-Type: application/json
{
  "name": "test-job",
  "spreadsheetId": "11AbOJlQLxbGi1ATEI8gncnUlVde2FHNT7RZdcaGySzI",
  "database": "KSYNC",
  "schedule": "0 1 1 * *"
}
HTTP 400

# No `tasks` defined
POST http://localhost:3000/jobs
Content-Type: application/json
{
  "name": "test-job",
  "spreadsheetId": "11AbOJlQLxbGi1ATEI8gncnUlVde2FHNT7RZdcaGySzI",
  "database": "KSYNC",
  "schedule": "0 1 1 * *",
  "tasks": []
}
HTTP 400

# Invalid query
POST http://localhost:3000/jobs
Content-Type: application/json
{
  "name": "test-job",
  "spreadsheetId": "11AbOJlQLxbGi1ATEI8gncnUlVde2FHNT7RZdcaGySzI",
  "database": "KSYNC",
  "schedule": "0 1 1 * *",
  "tasks": [{"name": "test-task", "query": "SELET * FROM \"District\";"}]
}
HTTP 400

# Successful query
POST http://localhost:3000/jobs
Content-Type: application/json
{
  "name": "test-job",
  "spreadsheetId": "11AbOJlQLxbGi1ATEI8gncnUlVde2FHNT7RZdcaGySzI",
  "database": "KSYNC",
  "schedule": "0 1 1 * *",
  "tasks": [{"name": "test-task", "query": "SELECT * FROM \"District\";"}]
}
HTTP 201
[Captures]
id: jsonpath "$.id"

# Check for job
GET http://localhost:3000/jobs/{{id}}
HTTP 200
[Asserts]
jsonpath "$.name" == "test-job"

# Toggle job inactive
PUT http://localhost:3000/jobs/{{id}}/toggle
HTTP 202
[Asserts]
jsonpath "$.active" == false

# Run inactive job
PUT http://localhost:3000/jobs/{{id}}/exec
HTTP 400

# Toggle job active
PUT http://localhost:3000/jobs/{{id}}/toggle
HTTP 202
[Asserts]
jsonpath "$.active" == true

# Run active job
PUT http://localhost:3000/jobs/{{id}}/exec
HTTP 202

# Delete job
DELETE http://localhost:3000/jobs/{{id}}
HTTP 202
[Asserts]
jsonpath "$.id" == "{{id}}"

