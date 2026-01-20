# Feedback System

Anonymous feedback collection system for college faculty evaluation. Students submit confidential ratings and comments; faculty anonymity is enforced at all levels.

## Quick Start

### Prerequisites
- Node.js v14+
- MySQL 5.7+
- npm

### Setup

**Backend:**
```bash
cd Backend
npm install
# Configure Backend/config/db.js with your MySQL credentials
npm start
# Runs on http://localhost:5000
```

**Frontend:**
```bash
cd Frontend/frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

**Database:**
```bash
mysql -u root -p < DATABASE_SCHEMA.sql
```

## Tech Stack

- Backend: Node.js, Express, MySQL
- Frontend: React 19, Vite
- Auth: JWT + bcryptjs
- HTTP Client: Axios

## Key Features

- Student login with institutional ID
- One feedback submission per student per faculty (enforced)
- 5-point rating scale with optional comments
- Complete anonymity (faculty can't see student identity)
- Admin dashboard for feedback review and statistics
- Role-based access control

## Project Structure

```
Backend/
├── config/db.js (MySQL connection)
├── models/ (User, Faculty, Feedback, FeedbackStatus)
├── routes/ (auth, feedback, admin)
└── middleware/ (authentication, error handling)

Frontend/frontend/src/
├── pages/ (Landing, StudentLogin, AdminLogin, AdminDashboard)
├── components/ (feedbackForm)
└── styles/
```

## API Reference

**Auth**: POST `/api/auth/register`, `/api/auth/login`, GET `/api/auth/profile`

**Feedback**: GET `/api/feedback/faculties`, `/api/feedback/status`; POST `/api/feedback/submit`

**Admin**: GET `/api/admin/feedback`, `/api/admin/feedback/faculty/{id}`, `/api/admin/statistics/faculty/{id}`

See SYSTEM_OVERVIEW.md for complete API documentation.

## Testing

**Admin**: Email `admin@college.com` / Password `password123`

**Student**: Email `student1@college.com` / Password `password123` / ID `STU001`

## Known Limitations

- No feedback editing after submission
- No faculty responses
- No email notifications
- Manual database setup required
- One token refresh window (7 days)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| DB connection fails | Verify MySQL running, check config/db.js credentials |
| CORS errors | Check index.js CORS config, verify frontend URL in whitelist |
| Duplicate feedback error | Expected behavior - one submission per faculty enforced |
| Token expired | Re-login required (7-day expiration) |

## Production

Set environment variables:
```
PORT=5000
JWT_SECRET=your-secret-key
DB_HOST=your-host
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=feedback_system
```

Then build and deploy frontend (`npm run build`) and backend separately.

## Documentation

- [SETUP.md](SETUP.md) - Detailed setup instructions
- [DATABASE_SCHEMA.sql](DATABASE_SCHEMA.sql) - DB structure

