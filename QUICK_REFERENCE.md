# Quick Reference Guide

## 🎯 Essential URLs

| Purpose | URL |
|---------|-----|
| Landing Page | http://localhost:5173 |
| Student Portal | http://localhost:5173/student-login |
| Admin Portal | http://localhost:5173/admin-login |
| Feedback Form | http://localhost:5173/feedback |
| Backend API | http://localhost:5000 |

## 👤 Test Accounts

### Admin
```
Email:    admin@college.com
Password: password123
Role:     admin
```

### Students
```
Email:    student1@college.com
Password: password123
ID:       STU001

Email:    student2@college.com
Password: password123
ID:       STU002

Email:    student3@college.com
Password: password123
ID:       STU003
```

## 🚀 Commands to Run

### First Time Setup

```bash
# 1. Import database schema
mysql -u root -p feedback_system < DATABASE_SCHEMA.sql

# 2. Install and start backend
cd Backend
npm install
npm start

# 3. In new terminal, install and start frontend
cd Frontend/frontend
npm install
npm run dev
```

### Daily Development

```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend
cd Frontend/frontend
npm run dev
```

## 📊 Key API Endpoints

### Authentication
```
POST /api/auth/register        - Register new student
POST /api/auth/login           - Login student/admin
GET  /api/auth/profile         - Get profile (requires token)
```

### Student Feedback
```
GET  /api/feedback/faculties           - Get all faculties
GET  /api/feedback/status              - Get submission status
POST /api/feedback/submit              - Submit feedback
GET  /api/feedback/my-feedbacks        - Get my feedbacks
PUT  /api/feedback/update/:id          - Update feedback
DELETE /api/feedback/delete/:id        - Delete feedback
```

### Admin
```
GET  /api/admin/feedback                    - All feedback (anonymous)
GET  /api/admin/feedback/faculty/:id        - Faculty feedback
GET  /api/admin/statistics/faculty/:id      - Faculty stats
GET  /api/admin/faculties                   - All faculties
POST /api/admin/faculties                   - Create faculty
PUT  /api/admin/faculties/:id               - Update faculty
DELETE /api/admin/faculties/:id             - Delete faculty
```

## 🔑 Important Features

### Anonymous Feedback
- Faculty **cannot** see who submitted feedback
- Admins **can** verify but typically don't reveal identities
- Feedback shows: rating, comments, timestamp, department
- Feedback hides: student name, email, institutional ID

### Duplicate Prevention
- Each student can submit **ONE** feedback per faculty
- Backend enforces with UNIQUE(user_id, faculty_id)
- Frontend shows clear message on duplicate attempt
- Resubmission automatically blocked

### Rating System
- 1-5 star scale
- Visual star selector in UI
- Range slider alternative
- Required field

## 📁 Important Files

### Backend
- `Backend/index.js` - Main server file
- `Backend/config/db.js` - Database configuration
- `Backend/routes/feedbackRoutes.js` - Feedback API
- `Backend/routes/adminRoutes.js` - Admin API
- `Backend/utils/auth.js` - Authentication logic

### Frontend
- `Frontend/frontend/src/App.jsx` - Main app with routing
- `Frontend/frontend/src/pages/StudentLogin.jsx` - Student login/register
- `Frontend/frontend/src/pages/AdminDashboard.jsx` - Admin dashboard
- `Frontend/frontend/src/components/feedbackForm.jsx` - Feedback form

## 🐛 Troubleshooting Quick Fixes

### Backend won't start
```bash
# Kill process on port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000, kill -9 PID

# Check MySQL running
mysql -u root -p -e "SELECT 1"

# Check database exists
mysql -u root -p -e "USE feedback_system; SELECT COUNT(*) FROM users;"
```

### Frontend CORS errors
```bash
# Clear browser cache: Ctrl+Shift+Del
# Restart both frontend and backend
# Check backend is running: curl http://localhost:5000
```

### Login fails
```sql
-- Check user exists
SELECT * FROM users WHERE email = 'admin@college.com';

-- Check password is hashed (starts with $2a$)
SELECT password FROM users WHERE email = 'admin@college.com';
```

### No feedback showing in admin
```sql
-- Check feedback was inserted
SELECT COUNT(*) FROM feedbacks;

-- Check link between user and feedback
SELECT u.name, f.rating, f.comments FROM feedbacks f
JOIN users u ON f.user_id = u.id;

-- Check faculty exists
SELECT * FROM faculties;
```

## 🔐 Security Tips

### Development
- ✓ Use test credentials provided
- ✓ Don't expose JWT tokens
- ✓ Keep database running locally only
- ✓ Use .env.example for reference

### Production
- ✓ Change JWT_SECRET
- ✓ Use strong passwords
- ✓ Enable HTTPS
- ✓ Set up database backups
- ✓ Use environment variables
- ✓ Implement rate limiting
- ✓ Enable security headers

## 📝 Database Quick Queries

```sql
-- View all users
SELECT id, email, name, role FROM users;

-- View all faculties
SELECT * FROM faculties;

-- View all feedback (with student info)
SELECT u.name, u.email, f.rating, f.comments, f.created_at
FROM feedbacks f
JOIN users u ON f.user_id = u.id;

-- View feedback count per faculty
SELECT fac.name, COUNT(*) as count, AVG(f.rating) as avg_rating
FROM feedbacks f
JOIN faculties fac ON f.faculty_id = fac.id
GROUP BY fac.id;

-- Check if user submitted feedback for faculty
SELECT * FROM feedbacks 
WHERE user_id = 1 AND faculty_id = 1;

-- Count submissions per student
SELECT u.name, COUNT(*) as submissions
FROM feedbacks f
JOIN users u ON f.user_id = u.id
GROUP BY u.id;
```

## 🧪 Test Scenarios

### Scenario 1: Student Feedback Flow
1. Go to http://localhost:5173/student-login
2. Click "Register here"
3. Fill form and register
4. You're logged in automatically
5. Click feedback in navigation or go to /feedback
6. Select a faculty
7. Rate (1-5) and add comments
8. Submit
9. Try submitting again → Get error

### Scenario 2: Admin View
1. Go to http://localhost:5173/admin-login
2. Use admin@college.com / password123
3. See all feedback (completely anonymous)
4. Click on a faculty name
5. See detailed feedback and statistics
6. Notice: NO student names, emails, or IDs shown

### Scenario 3: Multiple Students
1. Register student A
2. Submit feedback for Dr. Kumar
3. Logout
4. Register student B
5. Submit feedback for Dr. Kumar
6. Login as admin
7. See 2 feedbacks for Dr. Kumar
8. Cannot see who submitted

## 📊 Performance Tips

### Frontend
- Vite hot reload: Changes auto-apply
- Check Network tab for API calls
- Use React DevTools for component debugging
- Clear localStorage if stuck: `localStorage.clear()`

### Backend
- Add `console.log` for debugging
- Check MySQL performance: `SHOW STATUS LIKE 'Slow_queries';`
- Monitor active connections: `SHOW PROCESSLIST;`

### Database
- Optimize queries with EXPLAIN: `EXPLAIN SELECT * FROM feedbacks;`
- Check indexes: `SHOW INDEX FROM feedbacks;`
- Monitor table size: `SELECT TABLE_NAME, ROUND(((data_length + index_length) / 1024 / 1024), 2) FROM information_schema.tables;`

## 🎓 Learning Resources

### For JWT Understanding
- How JWT works: Generate → Store → Send → Verify
- Token contains: header.payload.signature
- Payload includes: user info, expiry time
- Server verifies signature to trust token

### For Database Design
- Why UNIQUE(user_id, faculty_id)? Prevents duplicates at DB level
- Why separate user_id from feedback? Maintains anonymity
- Why indexes? Speed up queries on large datasets

### For React Patterns
- Hooks: useState for state, useEffect for side effects
- Routing: BrowserRouter wraps app, Routes contains Route elements
- HTTP: axios for API calls, headers for authorization

## 🚀 Deployment Notes

### Before Production
1. [ ] Change JWT_SECRET
2. [ ] Update database credentials
3. [ ] Enable HTTPS
4. [ ] Set up environment variables
5. [ ] Configure CORS properly
6. [ ] Set up logging
7. [ ] Add monitoring
8. [ ] Test thoroughly

### Deployment Platforms
- **Backend**: Heroku, AWS EC2, DigitalOcean, Railway
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Database**: AWS RDS, DigitalOcean Managed DB, Heroku Postgres

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Kill process or change port |
| CORS error | Verify backend running, check origin |
| MySQL connection failed | Start MySQL, check credentials |
| Login fails | Verify user exists, check password hash |
| No feedback showing | Check database populated, verify query |
| Token expired | Login again, implement refresh tokens |
| Can't register | Check institutional_id unique, try different email |

## 🔍 Debugging Checklist

- [ ] Backend running? `curl http://localhost:5000`
- [ ] Frontend running? http://localhost:5173 loads?
- [ ] MySQL running? `mysql -u root -p` connects?
- [ ] Database exists? `USE feedback_system;` works?
- [ ] Tables created? `SHOW TABLES;` shows tables?
- [ ] Sample data inserted? `SELECT COUNT(*) FROM users;`
- [ ] Token valid? Check localStorage in DevTools
- [ ] API endpoint correct? Check Network tab
- [ ] Middleware working? Check console logs
- [ ] User role correct? Check JWT payload in jwt.io

---

**Keep this guide handy for quick reference during development!** 📚
