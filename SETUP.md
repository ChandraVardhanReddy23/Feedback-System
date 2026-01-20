# Setup Guide

Prerequisites: Node.js v14+, MySQL 5.7+

## Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE feedback_system;"

# Import schema
mysql -u root -p feedback_system < DATABASE_SCHEMA.sql
```

For testing with sample credentials (admin@college.com / password123), ensure the database has been populated via the schema import.

## Backend

```bash
cd Backend
npm install

# Edit config/db.js with your MySQL credentials
nano config/db.js  # or use your editor
# Set: host, user, password, database

npm start
# Runs on http://localhost:5000
```

**Test**: `curl http://localhost:5000` should return success message

## Frontend

In a new terminal:

```bash
cd Frontend/frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

Access at `http://localhost:5173`

## Test Credentials

- **Admin**: admin@college.com / password123
- **Student**: student1@college.com / password123 (ID: STU001)

To change database credentials later, or to hash a custom password, use:

```bash
# Hash a password with bcryptjs
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_password', 10));"
```

Then update in database:
```sql
UPDATE users SET password='$2a$10$...' WHERE email='admin@college.com';
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| MySQL connection fails | Verify MySQL running, check credentials in config/db.js |
| Port 5000/5173 in use | Change port in index.js or kill process using that port |
| CORS errors | Verify backend is running and CORS config in index.js |
| Login fails | Check user exists in database: `SELECT * FROM users;` |
| No feedback visible | Submit feedback as student first, then check as admin |

## API Testing

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@college.com","password":"password123"}'

# Get faculties
curl -X GET http://localhost:5000/api/feedback/faculties \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Commands

```sql
-- Check users
SELECT email, role FROM users;

-- Check faculties
SELECT name, department FROM faculties;

-- Check feedback (admin only)
SELECT faculty_id, rating, comments, created_at FROM feedbacks;

-- Feedback stats by faculty
SELECT f.name, COUNT(*) as total, AVG(r.rating) as avg_rating
FROM faculties f
LEFT JOIN feedbacks r ON f.id = r.faculty_id
GROUP BY f.id;
```

## Next Steps

1. Customize faculties in database
2. Modify CSS in Frontend/frontend/src/styles/
3. Add more features as needed

See README.md for more information.
