# GET http://localhost:3000
# HTTP 200
# [Asserts]
# jsonpath "$.status" == "OK"

# GET http://localhost:3000/test
# HTTP 404
# [Asserts]
# jsonpath "$.status" == "Not Found"

POST http://localhost:3000/jobs
Content-Type: application/json
{
  "name": "test-job",
  "spreadsheetId": "11AbOJlQLxbGi1ATEI8gncnUlVde2FHNT7RZdcaGySzI",
  "database": "KSYNC",
  "schedule": "0 1 1 * *",
  "tasks": [{"name": "test-task", "query": "SELECT * FROM `District`"}]
}
HTTP 200

GET http://localhost:3000/jobs
HTTP 200
