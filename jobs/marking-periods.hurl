
POST http://localhost:3000/jobs
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "MarkingPeriods",
  "spreadsheetId": "1KD-cCOJEdNCWFU1RTG15xE_6BB_NTaoJ5ioBj6iR9W4",
  "database": "KSYNC",
  "schedule": "0 1 1 * *",
  "tasks": [{"name": "Marking_Periods", "query": "SELECT * FROM \"MarkingPeriods\";"},{"name": "Progress", "query": "SELECT * FROM \"Progress\";"}]
}
HTTP 201
