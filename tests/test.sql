USE tempdb;

CREATE TABLE testTable (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  age INT,
  email VARCHAR(100),
  is_active BIT,
  created_at DATETIME
);

INSERT INTO testTable (id, name, age, email, is_active, created_at)
VALUES
  (1, 'Alice', 30, 'alice@example.com', 1, '2022-01-01 00:00:00'),
  (2, 'Bob', 40, 'bob@example.com', 0, '2022-01-02 00:00:00'),
  (3, 'Charlie', 50, 'charlie@example.com', 1, '2022-01-03 00:00:00');
