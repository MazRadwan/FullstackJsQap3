CREATE TABLE fitness_classes (
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INTEGER NOT NULL,
    details TEXT,
    class_type VARCHAR(50) CHECK (class_type IN ('Yoga', 'Pilates', 'Spinning', 'CrossFit', 'Aerobics', 'Zumba', 'Boxing'))
);
