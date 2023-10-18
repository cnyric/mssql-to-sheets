POST http://localhost:3000/jobs
Content-Type: application/json
{
  "name": "test-job",
  "spreadsheetId": "11AbOJlQLxbGi1ATEI8gncnUlVde2FHNT7RZdcaGySzI",
  "database": "KSYNC",
  "schedule": "0 1 1 * *",
  "tasks": [{"name": "test-task", "query": "SELET * FROM `District`"}]
}
