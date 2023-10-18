GET http://localhost:3000
HTTP 200
[Asserts]
jsonpath "$.status" == "OK"

GET http://localhost:3000/test
HTTP 404
[Asserts]
jsonpath "$.status" == "Not Found"
