GET http://localhost:3000
HTTP 401

GET http://localhost:3000
Authorization: Bearer {{token}}
HTTP 200
[Asserts]
jsonpath "$.status" == "OK"

GET http://localhost:3000/test
Authorization: Bearer {{token}}
HTTP 404
[Asserts]
jsonpath "$.status" == "Not Found"
