# No auth
POST http://{{host}}/jobs
Content-Type: application/json
HTTP 401

# No `body`
POST http://{{host}}/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
HTTP 400

# No `name`
POST http://{{host}}/jobs
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
POST http://{{host}}/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "{{name}}",
  "database": "{{database}}",
  "schedule": "{{schedule}}",
  "tasks": [{"name": "test-task", "query": "{{query}}"}]
}
HTTP 400

# No `database`
POST http://{{host}}/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "{{name}}",
  "spreadsheetId": "{{sheetId}}",
  "schedule": "{{schedule}}",
  "tasks": [{"name": "test-task", "query": "{{query}}"}]
}
HTTP 400

# No `schedule`
POST http://{{host}}/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "{{name}}",
  "spreadsheetId": "{{sheetId}}",
  "database": "{{database}}",
  "tasks": [{"name": "test-task", "query": "{{query}}"}]
}
HTTP 400

# No `tasks`
POST http://{{host}}/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "{{name}}",
  "spreadsheetId": "{{sheetId}}",
  "database": "{{database}}",
  "schedule": "{{schedule}}"
}
HTTP 400

# No `tasks` defined
POST http://{{host}}/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "{{name}}",
  "spreadsheetId": "{{sheetId}}",
  "database": "{{database}}",
  "schedule": "{{schedule}}",
  "tasks": []
}
HTTP 400

# Invalid query
POST http://{{host}}/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "{{name}}",
  "spreadsheetId": "{{sheetId}}",
  "database": "{{database}}",
  "schedule": "{{schedule}}",
  "tasks": [{"name": "test-task", "query": "SELET * FROM \"District\";"}]
}
HTTP 400

# Successful query
POST http://{{host}}/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "{{name}}",
  "spreadsheetId": "{{sheetId}}",
  "database": "{{database}}",
  "schedule": "{{schedule}}",
  "tasks": [{"name": "test-task", "query": "{{query}}"}]
}
HTTP 201
[Captures]
id: jsonpath "$.id"

# Check for job
GET http://{{host}}/jobs/{{id}}
Authorization: Bearer {{token}}
HTTP 200
[Asserts]
jsonpath "$.name" == "{{name}}"

# Toggle job inactive
PUT http://{{host}}/jobs/{{id}}/toggle
Authorization: Bearer {{token}}
HTTP 202
[Asserts]
jsonpath "$.active" == false

# Run inactive job
PUT http://{{host}}/jobs/{{id}}/exec
Authorization: Bearer {{token}}
HTTP 400

# Toggle job active
PUT http://{{host}}/jobs/{{id}}/toggle
Authorization: Bearer {{token}}
HTTP 202
[Asserts]
jsonpath "$.active" == true

# Run active job
PUT http://{{host}}/jobs/{{id}}/exec
Authorization: Bearer {{token}}
HTTP 202

# Delete job
DELETE http://{{host}}/jobs/{{id}}
Authorization: Bearer {{token}}
HTTP 202
[Asserts]
jsonpath "$.id" == "{{id}}"

