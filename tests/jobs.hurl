POST http://localhost:3000/jobs
Content-Type: application/json
{
  "name": "test-job",
  "spreadsheetId": "11AbOJlQLxbGi1ATEI8gncnUlVde2FHNT7RZdcaGySzI",
  "database": "KSYNC",
  "schedule": "0 1 1 * *",
  "tasks": [{"name": "test-task", "query": "SELECT * FROM `District`"}]
}
HTTP 201
[Captures]
id: jsonpath "$.id"

GET http://localhost:3000/jobs/{{id}}
HTTP 200
[Asserts]
jsonpath "$.name" == "test-job"

PUT http://localhost:3000/jobs/{{id}}/toggle
HTTP 202
[Asserts]
jsonpath "$.active" == false

DELETE http://localhost:3000/jobs/{{id}}
HTTP 202
[Asserts]
jsonpath "$.id" == "{{id}}"

