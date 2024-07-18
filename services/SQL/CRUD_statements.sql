-- Query to Retrieve All Classes

SELECT * FROM fitness_class;

-- Query to retrieve classes by month and year

SELECT * FROM fitness_class WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2;

-- Fetch classes by name with partial Match

SELECT * FROM fitness_class WHERE name ILIKE $1;

-- query to delete a class by ID

DELETE FROM fitness_class WHERE  id = $1 RETURNING * ;

-- query to retrieve a class by id

SELECT * FROM fitness_class WHERE id = $1;


-- Create a new class 

INSERT INTO fitness_class
(class_name, instructor, date, time, duration, details, class_type)
VALUES ($1, $2, $3, $4, $5, $7)
RETURNING *;

-- Query to Patch 

UPDATE fitness_class 
SET 
    class_name = $1, 
    instructor = $2, 
    date = $3, 
    time = $4, 
    duration = $5, 
    details = $6, 
    class_type = $7 
WHERE 
    id = $8 
RETURNING *;


-- 