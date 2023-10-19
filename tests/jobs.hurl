# No auth
POST http://localhost:3000/jobs
Content-Type: application/json
[Options]
variable: sheetId="11AbOJlQLxbGi1ATEI8gncnUlVde2FHNT7RZdcaGySzI"
variable: schedule="0 1 1 * *"
variable: query="SELECT * FROM \"District\";"
HTTP 401

# No `body`
POST http://localhost:3000/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
HTTP 400

# No `name`
POST http://localhost:3000/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "spreadsheetId": "{{sheetId}}",
  "database": "{{database}}",
  "schedule": "{{schedule}}",
  "tasks": [{"name": "test-task", "query": "{{query}}"}]
}
HTTP 400

# No `spreadsheetId`
POST http://localhost:3000/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "test-job",
  "database": "{{database}}",
  "schedule": "{{schedule}}",
  "tasks": [{"name": "test-task", "query": "{{query}}"}]
}
HTTP 400

# No `database`
POST http://localhost:3000/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "test-job",
  "spreadsheetId": "{{sheetId}}",
  "schedule": "{{schedule}}",
  "tasks": [{"name": "test-task", "query": "{{query}}"}]
}
HTTP 400

# No `schedule`
POST http://localhost:3000/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "test-job",
  "spreadsheetId": "{{sheetId}}",
  "database": "{{database}}",
  "tasks": [{"name": "test-task", "query": "{{query}}"}]
}
HTTP 400

# No `tasks`
POST http://localhost:3000/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "test-job",
  "spreadsheetId": "{{sheetId}}",
  "database": "{{database}}",
  "schedule": "{{schedule}}"
}
HTTP 400

# No `tasks` defined
POST http://localhost:3000/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "test-job",
  "spreadsheetId": "{{sheetId}}",
  "database": "{{database}}",
  "schedule": "{{schedule}}",
  "tasks": []
}
HTTP 400

# Invalid query
POST http://localhost:3000/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "test-job",
  "spreadsheetId": "{{sheetId}}",
  "database": "{{database}}",
  "schedule": "{{schedule}}",
  "tasks": [{"name": "test-task", "query": "SELET * FROM \"District\";"}]
}
HTTP 400

# Successful query
POST http://localhost:3000/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "test-job",
  "spreadsheetId": "{{sheetId}}",
  "database": "{{database}}",
  "schedule": "{{schedule}}",
  "tasks": [{"name": "test-task", "query": "{{query}}"}]
}
HTTP 201
[Captures]
id: jsonpath "$.id"

# Check for job
GET http://localhost:3000/jobs/{{id}}
Authorization: Bearer {{token}}
HTTP 200
[Asserts]
jsonpath "$.name" == "test-job"

# Toggle job inactive
PUT http://localhost:3000/jobs/{{id}}/toggle
Authorization: Bearer {{token}}
HTTP 202
[Asserts]
jsonpath "$.active" == false

# Run inactive job
PUT http://localhost:3000/jobs/{{id}}/exec
Authorization: Bearer {{token}}
HTTP 400

# Toggle job active
PUT http://localhost:3000/jobs/{{id}}/toggle
Authorization: Bearer {{token}}
HTTP 202
[Asserts]
jsonpath "$.active" == true

# Run active job
PUT http://localhost:3000/jobs/{{id}}/exec
Authorization: Bearer {{token}}
HTTP 202

# Delete job
DELETE http://localhost:3000/jobs/{{id}}
Authorization: Bearer {{token}}
HTTP 202
[Asserts]
jsonpath "$.id" == "{{id}}"

