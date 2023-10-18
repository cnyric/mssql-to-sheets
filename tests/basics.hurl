GET http://localhost:3000
HTTP 401

GET http://localhost:3000
Authorization: Bearer X1FMbjl3QXhQX1U4OWFCQk9xejBWU0JENkwzY3psLTdGTUZvMVFpcHdVM084SkRwdUJIVlRyaDhvZU9YRHdYcQ==
HTTP 200
[Asserts]
jsonpath "$.status" == "OK"

GET http://localhost:3000/test
Authorization: Bearer X1FMbjl3QXhQX1U4OWFCQk9xejBWU0JENkwzY3psLTdGTUZvMVFpcHdVM084SkRwdUJIVlRyaDhvZU9YRHdYcQ==
HTTP 404
[Asserts]
jsonpath "$.status" == "Not Found"
