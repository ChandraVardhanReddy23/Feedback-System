# Architecture & Security Documentation

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React/Vite)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Student      │  │ Admin        │  │ Landing         │   │
│  │ Portal       │  │ Dashboard    │  │ Page            │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘   │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   HTTP/REST API │
                    │  (Axios Client) │
                    └────────┬────────┘
                             │
┌─────────────────────────────▼────────────────────────────────┐
│                  Backend (Node.js/Express)                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Auth Routes        Feedback Routes   Admin Routes  │    │
│  │ ┌─────────────┐   ┌────────────┐   ┌────────────┐ │    │
│  │ │ Register    │   │ Submit     │   │ View       │ │    │
│  │ │ Login       │   │ Get Status │   │ Statistics │ │    │
│  │ │ Profile     │   │ My Feedback│   │ Faculty    │ │    │
│  │ └─────────────┘   └────────────┘   └────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Middleware                                          │    │
│  │ ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │    │
│  │ │ Auth        │  │ Error       │  │ CORS       │  │    │
│  │ │ Verification│  │ Handler     │  │ Handler    │  │    │
│  │ └─────────────┘  └─────────────┘  └────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Models (Database Queries)                           │    │
│  │ ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │    │
│  │ │ User        │  │ Faculty      │  │ Feedback   │  │    │
│  │ │ Operations  │  │ Operations   │  │ Operations │  │    │
│  │ └─────────────┘  └──────────────┘  └────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────┬───────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────┐
│   MySQL Database         │
│  ┌────────────────────┐  │
│  │ Users Table        │  │
│  │ Faculties Table    │  │
│  │ Feedbacks Table    │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

### Data Flow

#### Student Feedback Submission Flow

```
1. Student Login
   ├─ Frontend sends email + password
   ├─ Backend validates credentials
   ├─ Backend generates JWT token
   └─ Frontend stores token in localStorage

2. Load Feedback Form
   ├─ Frontend fetches faculties (with token)
   ├─ Frontend fetches feedback status (with token)
   ├─ Backend checks user's previous submissions
   └─ Frontend shows available faculties and submitted status

3. Submit Feedback
   ├─ Frontend validates form
   ├─ Frontend sends: faculty_id, rating, comments (with token)
   ├─ Backend validates token → extracts user_id
   ├─ Backend checks duplicate (user_id + faculty_id)
   ├─ Backend inserts feedback (stores user_id separately)
   └─ Frontend shows success message

4. Admin Views Feedback
   ├─ Admin logs in with admin role
   ├─ Frontend fetches all feedback (with admin token)
   ├─ Backend returns feedback WITHOUT user details
   ├─ Admin sees: rating, comments, faculty, timestamp
   └─ Admin cannot see: student name, email, institutional ID
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY,              -- User unique ID
  email VARCHAR(255) UNIQUE,       -- Email (unique)
  password VARCHAR(255),           -- Bcrypt hashed
  institutional_id VARCHAR(100),   -- College/University ID
  name VARCHAR(255),               -- Full name
  role ENUM('student','admin'),    -- Role-based access
  created_at TIMESTAMP,            -- Registration date
  updated_at TIMESTAMP             -- Last updated
);

KEY: email (for login)
KEY: institutional_id (for registration check)
KEY: role (for permission checks)
```

### Faculties Table
```sql
CREATE TABLE faculties (
  id INT PRIMARY KEY,              -- Faculty unique ID
  name VARCHAR(255),               -- Faculty name
  department VARCHAR(255),         -- Department
  email VARCHAR(255),              -- Faculty email
  created_at TIMESTAMP,            -- Created date
  updated_at TIMESTAMP             -- Last updated
);

KEY: name, department (for searching)
```

### Feedbacks Table
```sql
CREATE TABLE feedbacks (
  id INT PRIMARY KEY,              -- Feedback unique ID
  user_id INT (FK to users),       -- Student who submitted (NOT shown to faculty)
  faculty_id INT (FK to faculties),-- Faculty being reviewed
  rating INT (1-5),                -- Rating
  comments LONGTEXT,               -- Comments
  created_at TIMESTAMP,            -- Submission date
  updated_at TIMESTAMP             -- Last updated
);

UNIQUE: (user_id, faculty_id)      -- ONE feedback per student per faculty
KEY: faculty_id (for viewing by faculty ID)
KEY: created_at (for sorting)

SECURITY: faculty cannot query with user_id
          only admins can see user_id
```

## Authentication & Authorization

### JWT Token Structure

```javascript
{
  id: 1,                           // User ID
  email: "user@college.com",       // Email
  role: "student",                 // Role: student or admin
  institutional_id: "STU001",      // Institutional ID
  iat: 1642521600,                 // Issued at
  exp: 1643126400                  // Expires in 7 days
}
```

### Token Flow

```
1. User logs in with email + password
   ↓
2. Backend verifies password (bcrypt compare)
   ↓
3. Backend generates JWT with user info
   ↓
4. Frontend stores in localStorage
   ↓
5. Frontend includes in Authorization header: "Bearer {token}"
   ↓
6. Backend verifies token on protected routes
   ↓
7. Backend extracts user info from token
   ↓
8. Backend checks user role (student vs admin)
   ↓
9. Route handler processes request with user context
```

### Role-Based Access Control

```javascript
// Student Routes
/api/feedback/faculties          → verifyToken + isStudent
/api/feedback/status             → verifyToken + isStudent
/api/feedback/submit             → verifyToken + isStudent
/api/feedback/my-feedbacks       → verifyToken + isStudent
/api/feedback/update/:id         → verifyToken + isStudent

// Admin Routes
/api/admin/feedback              → verifyToken + isAdmin
/api/admin/feedback/faculty/:id  → verifyToken + isAdmin
/api/admin/statistics/:id        → verifyToken + isAdmin
/api/admin/faculties             → verifyToken + isAdmin
```

## Security Features

### 1. Password Security

**Bcryptjs Implementation**
```javascript
// Registration
const hashedPassword = await bcrypt.hash(password, 10);
// Stores: $2a$10$salt$hash

// Login
const isValid = await bcrypt.compare(password, hashedPassword);
// Safely compares plaintext with hash
```

**Benefits**:
- Irreversible hashing (cannot decrypt)
- Salting prevents rainbow table attacks
- Adaptive cost factor increases over time
- Even if database leaked, passwords are safe

### 2. JWT Authentication

**Token Security**:
- Signed with secret key
- Expires in 7 days (short-lived)
- Stored in localStorage (not secure for XSS)
- Included in Authorization header (not in URL)

**Better: For production**
```javascript
// Use HTTP-only cookies instead
res.cookie('token', token, {
  httpOnly: true,      // Not accessible to JavaScript
  secure: true,        // HTTPS only
  sameSite: 'strict'   // CSRF protection
});
```

### 3. Input Validation

```javascript
// Email validation
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Password minimum length
if (password.length < 6) throw Error;

// Rating range
if (rating < 1 || rating > 5) throw Error;

// Comments max length
if (comments.length > 1000) throw Error;

// Institutional ID exists
SELECT * FROM users WHERE institutional_id = ?
```

### 4. SQL Injection Prevention

**Using Parameterized Queries**
```javascript
// ❌ UNSAFE - Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✓ SAFE - Parameterized query
const query = "SELECT * FROM users WHERE email = ?";
db.query(query, [email], callback);
// Parameter is escaped automatically
```

### 5. Anonymous Feedback Design

**Database Level**
```sql
-- What admins see (only for verifying user eligibility)
SELECT id, user_id, faculty_id, rating, comments, created_at
FROM feedbacks WHERE faculty_id = ?;

-- What faculty see (if given access)
SELECT id, rating, comments, created_at
FROM feedbacks WHERE faculty_id = ?;
-- user_id is NOT included
```

**Application Level**
```javascript
// Admin viewing feedback
const anonymousFeedbacks = feedbacks.map((fb) => ({
  id: fb.id,
  faculty_id: fb.faculty_id,
  rating: fb.rating,
  comments: fb.comments,
  created_at: fb.created_at
  // user_id NOT included
}));
```

### 6. Duplicate Prevention

**Database Constraint**
```sql
UNIQUE KEY unique_feedback_per_user_faculty (user_id, faculty_id)
```

**Application Check**
```javascript
Feedback.checkDuplicate(userId, facultyId, (err, hasFeedback) => {
  if (hasFeedback) {
    return res.status(409).json({
      message: "You have already submitted feedback for this faculty"
    });
  }
  // Proceed with submission
});
```

**Frontend Prevention**
```javascript
{feedbackStatus[selectedFaculty] && (
  <button disabled>Already submitted</button>
)}
```

### 7. CORS Protection

```javascript
app.use(cors({
  origin: 'http://localhost:5173',    // Only this origin
  credentials: true,                   // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 8. Error Handling

**Prevents Information Leakage**
```javascript
// ❌ BAD - Exposes database details
res.status(500).json({ error: err.message });

// ✓ GOOD - Generic message
res.status(500).json({ 
  success: false,
  message: "Internal Server Error" 
});
```

## Performance Optimization

### Database Indexes

```sql
-- Users table indexes
INDEX idx_email (email);              -- For login queries
INDEX idx_institutional_id (institutional_id);  -- For registration check
INDEX idx_role (role);                -- For permission checks

-- Faculties table indexes
INDEX idx_name (name);                -- For faculty search
INDEX idx_department (department);    -- For filtering

-- Feedbacks table indexes
UNIQUE unique_feedback_per_user_faculty (user_id, faculty_id);
INDEX idx_faculty_id (faculty_id);    -- For viewing by faculty
INDEX idx_created_at (created_at);    -- For sorting/pagination
```

### Query Optimization

```javascript
// Get feedback for faculty (using JOIN)
SELECT f.id, f.rating, f.comments, f.created_at
FROM feedbacks f
WHERE f.faculty_id = ?
ORDER BY f.created_at DESC;

// Benefits:
// - No N+1 queries
// - Uses index on faculty_id
// - Uses index on created_at for sorting
// - Returns only needed fields
```

### Frontend Optimization

```javascript
// Lazy load components
const FeedbackForm = lazy(() => import('./FeedbackForm'));

// Prevent unnecessary re-renders
const memoizedComponent = useMemo(() => {...}, [dependency]);

// Debounce input
const debouncedSearch = useCallback(
  debounce((value) => search(value), 300),
  []
);
```

## Deployment Checklist

### Security

- [ ] Change JWT_SECRET to strong random string
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS/SSL certificates
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable CSRF protection
- [ ] Add security headers (Helmet.js)
- [ ] Use environment variables (not hardcoded secrets)
- [ ] Set database user with minimal permissions

### Performance

- [ ] Enable database query caching
- [ ] Set up CDN for static assets
- [ ] Implement API response caching
- [ ] Add database connection pooling
- [ ] Set up monitoring/logging
- [ ] Configure database backups
- [ ] Use load balancer for scaling

### Compliance

- [ ] GDPR compliance (data privacy)
- [ ] User consent for data storage
- [ ] Data retention policies
- [ ] Audit logging
- [ ] Access control logs

## Monitoring & Logging

### Error Logging
```javascript
console.error('Error:', {
  timestamp: new Date(),
  userId: req.user?.id,
  endpoint: req.path,
  method: req.method,
  error: err.message,
  stack: err.stack
});
```

### Access Logging
```javascript
console.log('Request:', {
  timestamp: new Date(),
  userId: req.user?.id,
  endpoint: req.path,
  method: req.method,
  statusCode: res.statusCode
});
```

## Backup & Recovery

```bash
# MySQL Backup
mysqldump -u root -p feedback_system > backup_$(date +%Y%m%d_%H%M%S).sql

# MySQL Restore
mysql -u root -p feedback_system < backup_20240119_120000.sql
```

---

**This architecture ensures security, scalability, and maintainability!**
