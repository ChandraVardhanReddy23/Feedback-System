# Hybrid Anonymous Feedback System

A comprehensive college feedback application that enables students to submit anonymous feedback about faculty while maintaining complete anonymity to faculty members. Only administrators can verify submissions and view student identities.

## Features

### ✓ Core Features
- **Anonymous Feedback**: Faculty cannot see who submitted feedback - only administrators can verify
- **One Feedback Per Faculty**: Each student can submit only ONE feedback per faculty per session
- **Student Authentication**: Institutional ID and email-based login and registration
- **Role-Based Access**: Separate portals for students and admins
- **Duplicate Prevention**: Backend enforces one submission per student per faculty
- **Resubmission Blocking**: Frontend prevents resubmission with clear messaging

### ✓ Backend Features
- **Secure Authentication**: JWT tokens with bcrypt password hashing
- **RESTful API**: Clean, modular API routes
- **Database Integrity**: Unique constraints and foreign keys
- **Error Handling**: Comprehensive error handling middleware
- **Input Validation**: Server-side validation for all inputs

### ✓ Frontend Features
- **Modern UI**: Built with React (Vite) with responsive design
- **Real-time Status**: Shows which faculties user has submitted feedback for
- **Interactive Rating**: 5-point rating scale with star selection
- **Landing Page**: Informative homepage with feature showcase
- **Admin Dashboard**: Comprehensive analytics and feedback viewing

## Project Structure

```
feedback-system/
├── Backend/
│   ├── index.js                          # Main server entry point
│   ├── package.json                      # Backend dependencies
│   ├── config/
│   │   └── db.js                         # MySQL database configuration
│   ├── models/
│   │   ├── User.js                       # User model and queries
│   │   ├── Faculty.js                    # Faculty model and queries
│   │   ├── Feedback.js                   # Feedback model (anonymous to admins)
│   │   └── FeedbackStatus.js             # Duplicate prevention tracking
│   ├── middleware/
│   │   ├── auth.js                       # JWT verification and role checks
│   │   └── errorHandler.js               # Centralized error handling
│   ├── utils/
│   │   └── auth.js                       # Password hashing and JWT utilities
│   └── routes/
│       ├── authRoutes.js                 # Login, register, profile
│       ├── feedbackRoutes.js             # Feedback submission and retrieval
│       └── adminRoutes.js                # Admin feedback viewing
│
├── Frontend/
│   └── frontend/
│       ├── package.json                  # Frontend dependencies
│       ├── vite.config.js                # Vite configuration
│       ├── index.html                    # HTML entry point
│       └── src/
│           ├── App.jsx                   # Main app with routing
│           ├── App.css                   # Global styles
│           ├── main.jsx                  # React DOM render
│           ├── pages/
│           │   ├── StudentLogin.jsx      # Student login/register
│           │   ├── AdminLogin.jsx        # Admin login
│           │   ├── AdminDashboard.jsx    # Admin feedback dashboard
│           │   └── LandingPage.jsx       # Home page
│           ├── components/
│           │   └── feedbackForm.jsx      # Student feedback form
│           ├── styles/
│           │   ├── StudentLogin.css
│           │   ├── AdminLogin.css
│           │   ├── FeedbackForm.css
│           │   ├── AdminDashboard.css
│           │   └── LandingPage.css
│           └── assets/                   # Images and assets
│
└── DATABASE_SCHEMA.sql                   # Complete database setup
```

## Technology Stack

### Backend
- **Node.js + Express.js** - Server framework
- **MySQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MySQL Server
- npm or yarn

### Backend Setup

1. **Install dependencies**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure database**
   - Create MySQL database: `CREATE DATABASE feedback_system;`
   - Run the schema: Import `DATABASE_SCHEMA.sql` into MySQL
   - Update `Backend/config/db.js` with your MySQL credentials

3. **Create .env file** (optional, for production)
   ```
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=feedback_system
   ```

4. **Start backend server**
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd Frontend/frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## API Documentation

### Authentication Routes (`/api/auth`)

#### Register Student
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@college.com",
  "password": "password123",
  "institutional_id": "STU001",
  "name": "Student Name",
  "role": "student"
}

Response: { success: true, token: "jwt_token", user: {...} }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@college.com",
  "password": "password123"
}

Response: { success: true, token: "jwt_token", user: {...} }
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer {token}

Response: { success: true, user: {...} }
```

### Feedback Routes (`/api/feedback`)

#### Get All Faculties
```
GET /api/feedback/faculties
Authorization: Bearer {token}

Response: { success: true, faculties: [...] }
```

#### Get Feedback Status
```
GET /api/feedback/status
Authorization: Bearer {token}

Response: { 
  success: true,
  status: [
    { id: 1, name: "Dr. Name", has_feedback: true, ... },
    { id: 2, name: "Prof. Name", has_feedback: false, ... }
  ]
}
```

#### Submit Feedback (One per faculty)
```
POST /api/feedback/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "faculty_id": 1,
  "rating": 5,
  "comments": "Excellent teaching..."
}

Response: { success: true, message: "Feedback submitted", feedback_id: 123 }
```

#### Get My Feedbacks
```
GET /api/feedback/my-feedbacks
Authorization: Bearer {token}

Response: { success: true, feedbacks: [...] }
```

### Admin Routes (`/api/admin`)

#### Get All Feedback (Anonymous)
```
GET /api/admin/feedback
Authorization: Bearer {admin_token}

Response: { 
  success: true,
  feedbacks: [
    {
      id: 1,
      faculty_id: 1,
      faculty_name: "Dr. Name",
      rating: 5,
      comments: "Great!",
      created_at: "2024-01-19T10:00:00Z"
    }
  ]
}

Note: NO student_id, email, or name is included!
```

#### Get Faculty Feedback (Anonymous)
```
GET /api/admin/feedback/faculty/{faculty_id}
Authorization: Bearer {admin_token}

Response: {
  success: true,
  faculty: { id, name, department, email },
  feedbacks: [...]
}
```

#### Get Faculty Statistics
```
GET /api/admin/statistics/faculty/{faculty_id}
Authorization: Bearer {admin_token}

Response: {
  success: true,
  statistics: {
    total_feedbacks: 25,
    average_rating: 4.2,
    min_rating: 2,
    max_rating: 5
  }
}
```

## Anonymous Feedback Design

### How It Works
1. **Student submits feedback** → `user_id` and `feedback_id` linked in database
2. **Faculty cannot see feedback** → Feedback only shows: rating, comments, timestamp, department
3. **Admin can see all details** → Admin can verify but typically doesn't reveal identities
4. **Duplicate prevention** → UNIQUE(user_id, faculty_id) ensures one submission per faculty

### Database Security
```sql
-- Feedback table enforces anonymity in admin views
SELECT 
  id,
  faculty_id,
  rating,
  comments,
  created_at
FROM feedbacks
WHERE faculty_id = ?
-- Note: user_id is NOT returned to faculty or non-admin admins
```

## Key Security Features

### 1. Authentication & Authorization
- JWT tokens with 7-day expiration
- bcryptjs password hashing (10 salt rounds)
- Role-based access control (student vs admin)
- Protected routes require valid tokens

### 2. Input Validation
- Email format validation
- Password length (minimum 6 characters)
- Rating range (1-5)
- Comments length (max 1000 chars)
- Institutional ID uniqueness

### 3. Duplicate Prevention
- UNIQUE constraint: `(user_id, faculty_id)`
- Backend checks before submission
- Frontend prevents form submission for existing feedback

### 4. Data Privacy
- Feedback visible to admins without student details
- Faculty see only aggregated stats (not individual feedback sources)
- All timestamps preserved for audit trails

## Testing the System

### Test Credentials

**Admin Account:**
```
Email: admin@college.com
Password: password123 (hash this with bcrypt in production)
Role: admin
```

**Student Account:**
```
Email: student1@college.com
Password: password123
ID: STU001
Role: student
```

### Test Flow

1. **Student Registration/Login**
   - Go to http://localhost:5173
   - Click "Student Portal"
   - Register with institutional ID
   - Login with credentials

2. **Submit Feedback**
   - Click "Submit Feedback"
   - Select a faculty
   - Rate on 5-star scale
   - Add comments (optional)
   - Submit
   - Try submitting again (should be blocked)

3. **Admin View**
   - Go to http://localhost:5173/admin-login
   - Login with admin credentials
   - View all feedback (completely anonymous)
   - Click on specific faculty to see detailed feedback
   - View statistics

## Performance Considerations

### Database Indexes
- `users`: email, institutional_id, role
- `faculties`: name, department
- `feedbacks`: faculty_id, created_at, user_id

### Query Optimization
- Uses JOINs efficiently
- Indexes on frequently queried fields
- Limits data returned from queries

### Frontend Optimization
- React component lazy loading (Vite)
- CSS modules for scoped styling
- Efficient state management

## Production Deployment

### Environment Variables
Create a `.env` file:
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-very-secret-key-change-this
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=feedback_system
```

### Security Checklist
- [ ] Change JWT_SECRET
- [ ] Use HTTPS
- [ ] Set secure cookies
- [ ] Implement CORS properly
- [ ] Use environment variables
- [ ] Enable MySQL authentication
- [ ] Set up database backups
- [ ] Add rate limiting
- [ ] Enable CSRF protection

### Deployment Steps
1. Build frontend: `npm run build`
2. Deploy frontend to static hosting (Netlify, Vercel, AWS S3)
3. Deploy backend to server (Heroku, AWS EC2, DigitalOcean)
4. Configure MySQL database on cloud provider
5. Update API base URL in frontend

## Troubleshooting

### Common Issues

**1. Database Connection Error**
- Verify MySQL is running
- Check credentials in `config/db.js`
- Ensure database exists

**2. CORS Errors**
- Check CORS configuration in `index.js`
- Verify frontend URL in CORS whitelist
- Clear browser cache

**3. Token Expired**
- User needs to re-login
- Token expires after 7 days
- Implement refresh tokens for production

**4. Duplicate Feedback Error**
- Unique constraint prevents multiple submissions
- User sees "already submitted" message
- This is expected behavior - feature, not bug!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## Future Enhancements

- [ ] Email notifications for admins
- [ ] Feedback export (PDF/CSV)
- [ ] Advanced analytics charts
- [ ] Feedback response from faculty
- [ ] Anonymous messaging between admin and faculty
- [ ] Mobile app (React Native)
- [ ] Dark mode UI
- [ ] Multi-language support
- [ ] Anonymous feedback editing window
- [ ] Bulk student import

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check the documentation
2. Review the troubleshooting section
3. Create a GitHub issue
4. Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: Production Ready
