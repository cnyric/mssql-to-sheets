GET http://{{host}}
HTTP 401

GET http://{{host}}
Authorization: Bearer {{token}}
HTTP 200
[Asserts]
jsonpath "$.status" == "OK"

GET http://{{host}}/test
Authorization: Bearer {{token}}
HTTP 404
[Asserts]
jsonpath "$.status" == "Not Found"
