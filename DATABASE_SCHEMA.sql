-- Feedback System Database Schema

-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  institutional_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_institutional_id (institutional_id),
  INDEX idx_role (role)
);

-- Faculties Table
CREATE TABLE faculties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_department (department)
);

-- Feedback Table (stores student_id separately from feedback - anonymous to admins)
CREATE TABLE feedbacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  faculty_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
  UNIQUE KEY unique_feedback_per_user_faculty (user_id, faculty_id),
  INDEX idx_faculty_id (faculty_id),
  INDEX idx_created_at (created_at)
);

-- Sample Data

-- Insert admin user
INSERT INTO users (email, password, institutional_id, name, role) 
VALUES ('admin@college.com', 'admin', 'ADMIN001', 'Admin User', 'admin');

-- Insert sample faculties
INSERT INTO faculties (name, department, email) VALUES
('Dr. Rajesh Kumar', 'Computer Science', 'rajesh@college.com'),
('Prof. Priya Singh', 'Mathematics', 'priya@college.com'),
('Dr. Amit Patel', 'Physics', 'amit@college.com'),
('Prof. Sarah Johnson', 'English', 'sarah@college.com'),
('Dr. Ravi Gupta', 'Chemistry', 'ravi@college.com');

-- Insert sample students (passwords should be bcrypt hashed in production)
INSERT INTO users (email, password, institutional_id, name, role) VALUES
('student1@college.com', 's1', 'STU001', 'Student One', 'student'),
('student2@college.com', 's2', 'STU002', 'Student Two', 'student'),
('student3@college.com', 's3', 'STU003', 'Student Three','student'),
('student4@college.com', 's4', 'STU004', 'Student Four','student');

-- Insert sample feedback (anonymous to admins - only user_id links them)
INSERT INTO feedbacks (user_id, faculty_id, rating, comments) VALUES
(2, 1, 5, 'Excellent teaching methodology. Very engaging classes.'),
(2, 2, 4, 'Good explanation but sometimes hard to follow.'),
(3, 1, 4, 'Great instructor. Clear lectures.'),
(3, 3, 3, 'Average teaching style. Could improve pace.'),
(4, 2, 5, 'Outstanding! Best professor I have had.'),
(4, 4, 4, 'Very knowledgeable and approachable.');
