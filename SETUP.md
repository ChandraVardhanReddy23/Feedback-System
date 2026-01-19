# Setup Guide - Feedback System

This guide walks you through setting up the Feedback System locally for development and testing.

## Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL Server** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** (optional) - [Download](https://git-scm.com/)

## Step 1: Database Setup

### 1.1 Create Database

Open MySQL Command Line or MySQL Workbench and run:

```sql
CREATE DATABASE feedback_system;
```

### 1.2 Import Schema

Run the schema file to create all tables:

```bash
# From command line
mysql -u root -p feedback_system < DATABASE_SCHEMA.sql

# When prompted, enter your MySQL password
```

Or manually import in MySQL Workbench:
1. Open `DATABASE_SCHEMA.sql`
2. Select all content
3. Execute against `feedback_system` database

### 1.3 Hash Passwords for Sample Data

The sample data includes users with placeholder passwords. For testing, you can use the hash for "password123":
```
$2a$10$4eIGlmQ/Vem0LIK5qeDz2OPST9/PgBkqquzi.Kk8KrWx3yXs8KHFa
```

Update the admin user:
```sql
UPDATE users 
SET password = '$2a$10$4eIGlmQ/Vem0LIK5qeDz2OPST9/PgBkqquzi.Kk8KrWx3yXs8KHFa'
WHERE email = 'admin@college.com';
```

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd Backend
```

### 2.2 Install Dependencies

```bash
npm install
```

This installs:
- express - Web server framework
- mysql2 - MySQL client
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cors - Cross-origin support

### 2.3 Configure Database Connection

Edit `Backend/config/db.js`:

```javascript
const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",           // Your MySQL username
  password: "admin",      // Your MySQL password
  database: "feedback_system"
});
```

Update `user` and `password` to match your MySQL configuration.

### 2.4 Test Backend

Run the server:

```bash
npm start
```

You should see:
```
Backend running on port 5000
MySQL Connected
```

Test the API:
```bash
curl http://localhost:5000/
# Response: { message: "Feedback System API running", success: true }
```

Keep the terminal open or start in a new terminal window.

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory

Open a new terminal window and navigate to:

```bash
cd Frontend/frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Start Development Server

```bash
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Step 4: Access the Application

### Landing Page
Open your browser and go to:
```
http://localhost:5173
```

You should see the Feedback System landing page with three main sections:
- Welcome message
- Key features
- Get Started buttons
- How it works guide

### Student Portal

1. Click **"Student Portal"** button
2. Register with:
   - Name: Your Name
   - Institutional ID: STU001 (or any unique ID)
   - Email: your-email@college.com
   - Password: Any password (min 6 chars)
3. After registration, you'll be logged in
4. You'll see the feedback form with:
   - Faculty dropdown (select Dr. Rajesh Kumar or others)
   - 5-star rating selector
   - Comments field
5. Submit feedback
6. Try submitting for the same faculty again → You'll get an error message: "You have already submitted feedback for this faculty"

### Admin Portal

1. Go back to landing page
2. Click **"Admin Portal"** button
3. Login with:
   - Email: `admin@college.com`
   - Password: `password123`
4. You'll see the Admin Dashboard with:
   - **Left Sidebar**: Navigation menu showing "All Feedback" and list of faculties
   - **Main Area**: All feedback in card view (completely anonymous)
   - **Faculty Detail**: Click any faculty to see:
     - Total feedback count
     - Average rating
     - Highest/Lowest ratings
     - Individual feedback (anonymous)

### Key Features to Test

✓ **Anonymous Feedback**: Notice that feedback shows NO student names, emails, or IDs
✓ **One Per Faculty**: Try submitting twice for same faculty - it's blocked
✓ **Rating Scale**: Use the 5-star selector and range slider
✓ **Status Tracking**: Student can see which faculties they've rated
✓ **Admin Analytics**: Admin sees statistics and trends

## Troubleshooting

### Issue: MySQL Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution**:
1. Verify MySQL is running:
   - Windows: Check Services (search "Services")
   - Mac: System Preferences → MySQL
   - Linux: `systemctl status mysql`
2. Check credentials in `Backend/config/db.js`
3. Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Issue: Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
1. Kill the process using port 5000:
   - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
   - Mac/Linux: `lsof -i :5000` then `kill -9 <PID>`
2. Or change the port in `Backend/index.js`

### Issue: Frontend Can't Connect to Backend

**Error**: CORS errors or "Connection refused"

**Solution**:
1. Ensure backend is running on port 5000
2. Check CORS configuration in `Backend/index.js`
3. Clear browser cache
4. Check browser console for detailed error

### Issue: Login Fails

**Error**: "Invalid email or password"

**Solution**:
1. Use exact credentials from sample data
2. Check if admin user password is hashed correctly
3. Verify database has users table with sample data
4. Run: `SELECT * FROM users;` to check

### Issue: Feedback Not Showing

**Error**: Admin dashboard shows "No feedback received yet"

**Solution**:
1. Ensure you submitted feedback as student
2. Check browser console for API errors
3. Verify feedback is in database: `SELECT * FROM feedbacks;`
4. Check admin token is valid
5. Restart both frontend and backend

## API Testing with cURL

Test the API directly:

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@college.com",
    "password": "password123",
    "institutional_id": "TEST123",
    "name": "Test Student",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@college.com",
    "password": "password123"
  }'
```

### Get Faculties (requires token)
```bash
curl -X GET http://localhost:5000/api/feedback/faculties \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Submit Feedback (requires token)
```bash
curl -X POST http://localhost:5000/api/feedback/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "faculty_id": 1,
    "rating": 5,
    "comments": "Excellent teaching!"
  }'
```

## Database Commands for Testing

```sql
-- View all users
SELECT id, email, institutional_id, name, role FROM users;

-- View all faculties
SELECT * FROM faculties;

-- View all feedback (with user info - admin only)
SELECT f.id, f.user_id, u.email, f.faculty_id, f.rating, f.comments, f.created_at
FROM feedbacks f
JOIN users u ON f.user_id = u.id;

-- View feedback count per faculty
SELECT fac.name, COUNT(*) as feedback_count, AVG(f.rating) as avg_rating
FROM feedbacks f
JOIN faculties fac ON f.faculty_id = fac.id
GROUP BY fac.id;

-- Check duplicate prevention constraint
SHOW CREATE TABLE feedbacks;
```

## Next Steps

1. **Customize**: Add your college's faculties to the database
2. **Styling**: Modify CSS files in `Frontend/frontend/src/styles/`
3. **Features**: Extend with email notifications, export functionality, etc.
4. **Deployment**: Follow production deployment guide in README.md

## Development Tips

### Hot Reload
- Frontend automatically reloads on code changes (Vite)
- Backend requires manual restart for code changes

### Debug Mode
Add logging to see what's happening:

```javascript
console.log("User ID:", req.user.id);
console.log("Feedback submission:", feedbackData);
```

### Browser DevTools
- F12 or Ctrl+Shift+I to open Developer Tools
- Network tab: See all API calls
- Console tab: See JavaScript errors
- Storage tab: See JWT tokens

### Testing Different Scenarios

**Scenario 1: Multiple students submitting feedback**
1. Register 3 different students
2. Each submits feedback for same faculty
3. Admin sees anonymous feedback from all 3
4. Cannot identify which student submitted what

**Scenario 2: Duplicate prevention**
1. Student logs in
2. Submits feedback for Dr. Kumar
3. Tries to submit again
4. Gets error: "You have already submitted feedback"

**Scenario 3: Admin analytics**
1. Admin logs in
2. Sees all feedback (completely anonymous)
3. Clicks on faculty name
4. Sees detailed stats and individual feedback

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review backend console output
3. Check browser console (F12 → Console tab)
4. Verify database connection
5. Check API responses in Network tab

---

**Setup Complete!** 🎉

You're ready to use the Feedback System. Start with the landing page at `http://localhost:5173`
