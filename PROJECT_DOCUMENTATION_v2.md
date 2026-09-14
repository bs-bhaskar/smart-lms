# Learning Management System (LMS) — Complete Project Documentation

**Document Version:** 2.0  
**Status:** Competition / Final Presentation Version  
**Project Type:** Full-Stack MERN Learning Management System

---

## 1. Executive Summary

The Learning Management System (LMS) is a full-stack web application designed to digitally manage academic activities in one centralized platform.

The system supports three primary roles:

- **Student**
- **Teacher**
- **Administrator**

The platform provides role-based authentication, course management, assessments, timetable management, learning resources, communication, personal study tools, an AI-powered Study Bot, and a **Parent QR / Student Report** feature.

The application is designed with a responsive interface so that important functionality can be accessed across desktop and mobile screen sizes.

---

## 2. Project Overview

### 2.1 Purpose

The main purpose of the LMS is to provide a centralized digital platform for managing teaching, learning, assessments, communication, and academic information.

Key goals include:

- Digital transformation of traditional educational management
- Centralized course and academic information
- Role-based access for students, teachers, and administrators
- Online assessments and result tracking
- Easy sharing of learning resources
- Communication between users
- AI-assisted study support
- Convenient parent access to student academic information through QR

### 2.2 Key Features

- **Multi-Role Authentication:** Separate student, teacher, and admin experiences
- **Course Management:** Course creation, assignment, viewing, and resource management
- **Assessment System:** MCQ and theory-based tests
- **Result Management:** Submission and performance tracking
- **Timetable Management:** Academic schedule organization
- **Resource Management:** Course learning materials and links
- **Communication:** Messaging, announcements, and course comments
- **AI Study Bot:** AI-assisted study support
- **Notes & Reminders:** Personal study organization
- **Resource Library:** Organized access to learning materials
- **Parent QR:** QR-based access to a student's academic report
- **Responsive UI:** Mobile and desktop-friendly interface

---

## 3. User Roles

### 3.1 Student

Students can:

- Register and log in
- View their dashboard
- View enrolled courses
- Access course resources
- View timetable
- Take available tests
- View test results
- Communicate through available messaging features
- Add personal notes
- Create reminders
- Use the AI Study Bot
- Access their resource library
- Display a Parent QR for sharing their academic report

### 3.2 Teacher

Teachers can:

- Log in using their account
- View their teaching dashboard
- View assigned courses
- Manage course resources
- Add course comments
- Create assessments
- Publish tests
- Grade theory submissions
- View student performance/results
- Send messages and announcements
- Manage their teaching timetable

### 3.3 Administrator

Administrators can manage major academic and user-level operations, including:

- Teacher account creation
- Student management
- User roles
- Course creation and assignment
- Student/teacher course assignment
- Timetable administration
- System-level result and user information

---

# 4. System Architecture

## 4.1 Technology Stack

### Frontend

- **React:** User interface
- **React Router DOM:** Client-side routing
- **Tailwind CSS:** Responsive styling
- **Axios:** API communication
- **React Icons:** UI icons
- **Vite:** Frontend development and build tool
- **qrcode.react:** QR code generation

### Backend

- **Node.js:** JavaScript runtime
- **Express.js:** Backend/API framework
- **MongoDB:** Database
- **Mongoose:** MongoDB ODM
- **JWT:** Authentication
- **bcryptjs:** Password hashing
- **Multer:** File upload handling
- **Nodemailer:** Email functionality
- **Groq / AI model API:** AI Study Bot integration

---

## 4.2 High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND — REACT                        │
├─────────────────────────────────────────────────────────────┤
│ Auth │ Student │ Teacher │ Admin │ Parent Report            │
│ Pages│ Pages   │ Pages   │ Pages │ Page                    │
├─────────────────────────────────────────────────────────────┤
│ Shared Components │ Context │ Axios API │ Routing           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND — NODE/EXPRESS                   │
├─────────────────────────────────────────────────────────────┤
│ Routes │ Controllers │ Middleware │ Services │ Utils         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
          ┌──────────────────┐   ┌────────────────────┐
          │ MongoDB/Mongoose │   │ External Services  │
          │ Users/Courses/   │   │ Email / AI         │
          │ Tests/Results/   │   │                    │
          │ Messages/etc.   │   └────────────────────┘
          └──────────────────┘
```

---

# 5. Detailed Features

## 5.1 Authentication System

### Registration

- Students can register through the registration flow.
- Teacher accounts are created through administration.
- Authentication uses user roles to provide the appropriate application experience.

### Login

The application supports role-based login and authentication using credentials associated with the user account.

### Password Management

The project includes:

- Forgot password flow
- Email OTP verification
- Password reset
- Change password functionality
- Show/hide password UI

### Authentication Flow

```text
User
  ↓
Enter Credentials
  ↓
Validate Input
  ↓
Verify User
  ↓
Check Role
  ↓
Generate JWT
  ↓
Authenticated Session
  ↓
Role Dashboard
```

---

# 6. Student Module

## 6.1 Student Dashboard

The dashboard provides students with a centralized view of their academic activity.

It includes:

- Today's classes
- Recent activities
- Course overview
- Quick actions
- AI Study Bot access
- Parent QR access

---

## 6.2 Course Management

Students can:

- View enrolled courses
- Read course information
- Access course resources
- View course-related content
- Participate in course comments where available

---

## 6.3 Timetable

The timetable module provides students with their academic schedule.

Features include:

- Personal timetable
- Day-wise organization
- Class information
- Responsive timetable UI

---

## 6.4 Assessment System

Students can:

- View available tests
- Open published assessments
- Answer MCQ and theory questions
- Submit assessments
- View available results

The assessment system supports automatic evaluation for applicable MCQ questions and teacher evaluation for theory-based responses.

---

# 7. Parent QR & Student Report

## 7.1 Overview

The **Parent QR** feature allows a student to share a QR code that can be scanned by a parent to open the student's academic report.

The QR system was added as an additional feature to make student information easier to access without requiring a separate parent login.

## 7.2 How It Works

```text
Student Dashboard
       ↓
Parent QR is displayed
       ↓
Parent scans QR
       ↓
Student Report URL opens
       ↓
Backend receives Student ID
       ↓
Student information is fetched
       ↓
Parent Report is displayed
```

## 7.3 QR Code

The QR code is generated on the student dashboard using `qrcode.react`.

The QR contains a URL pointing to the student's report page.

The QR does **not** need to store the complete academic report data itself. Instead, it contains the URL with the student's identifier.

Example flow:

```text
/parent-report/<studentId>
```

## 7.4 Parent Report

The standalone Parent Report page displays:

### Student Details

- Student name
- Registration number
- Email

### Enrolled Courses

- Course title
- Course description
- Teacher name

### Test Results

- Test title
- Course
- Marks
- Percentage
- Grading status

The Parent Report page is publicly accessible through the QR flow and is designed as a standalone page without the normal student/teacher/admin dashboard navigation.

## 7.5 Backend Endpoint

```text
GET /api/student/parent-report/:studentId
```

The backend uses the supplied student ID to retrieve the student and relevant academic information.

---

# 8. Teacher Module

## 8.1 Teacher Dashboard

Teachers can view:

- Teaching courses
- Scheduled classes
- Enrolled students
- Academic activity
- Performance-related information

## 8.2 Course Management

Teachers can:

- View assigned courses
- Upload course resources
- Share files/links
- Manage course comments
- Monitor student progress where supported

## 8.3 Assessment Tools

Teachers can:

- Create tests
- Add MCQ questions
- Add theory questions
- Set duration
- Set expiry
- Publish tests
- Grade theory submissions
- Review results

### Test Management Flow

```text
Teacher Creates Test
        ↓
Adds Questions
(MCQ / Theory)
        ↓
Sets Duration & Expiry
        ↓
Publishes Test
        ↓
Students Take Test
        ↓
MCQ Evaluation
        ↓
Teacher Grades Theory
        ↓
Results Available
```

## 8.4 Communication

Teacher communication features include:

- Messaging
- Announcements
- Message editing
- Course comments
- Student communication

---

# 9. Admin Module

## 9.1 User Management

Administrators can manage:

- Teacher creation
- Student records
- User roles
- User-related academic information

## 9.2 Course Administration

Admin operations include:

- Course creation
- Teacher assignment
- Student assignment
- Course editing
- Course-level management

## 9.3 Timetable Administration

Admin can manage:

- Class schedules
- Time slots
- Student/teacher timetable assignments
- Timetable-related operations

---

# 10. AI Study Bot

The LMS includes an AI-powered Study Bot to assist students with study-related activities.

The Study Bot provides an interactive AI-based interface inside the student experience.

It can be used as a study assistant for:

- Asking study-related questions
- Getting explanations
- Supporting learning
- Assisting with study notes and related tasks

The backend connects the application to an external AI model service.

---

# 11. Study Tools

## 11.1 Personal Notes

Students can maintain personal notes for organizing study information.

## 11.2 Reminders

The reminder feature helps students keep track of tasks and study deadlines.

## 11.3 Resource Library

The resource library provides an organized area for accessing learning resources.

---

# 12. Communication System

The application provides communication features for academic interaction.

Supported functionality includes:

- Messaging
- Teacher announcements
- Notifications where implemented
- Course comments
- Message management

---

# 13. Database Design

The backend uses MongoDB with Mongoose models.

Main entities include:

```text
User
Course
Timetable
Test
Submission
Message
Note
Reminder
```

## 13.1 User

Stores user information such as:

```javascript
{
  name,
  email,
  password,
  registrationNumber,
  role,
  emailVerified,
  otp,
  otpExpires,
  createdAt,
  updatedAt
}
```

Roles include:

```text
student
teacher
admin
```

## 13.2 Course

A course contains information such as:

```javascript
{
  title,
  description,
  teacher,
  students,
  resources,
  timetable,
  comments,
  createdAt,
  updatedAt
}
```

## 13.3 Test

A test contains:

```javascript
{
  title,
  description,
  course,
  questions,
  duration,
  published,
  expiryDate,
  createdBy,
  createdAt,
  updatedAt
}
```

Questions can support:

- MCQ
- Theory

## 13.4 Submission

Submissions connect students with tests and store assessment performance, including marks, maximum marks, percentage, grading state, and submission information.

---

# 14. API Overview

## Authentication

```text
POST /api/auth/login
POST /api/auth/register
```

## Student

```text
GET  /api/student/dashboard
GET  /api/student/profile
GET  /api/student/courses
GET  /api/student/timetable
GET  /api/student/parent-report/:studentId
```

## Teacher

```text
GET  /api/teacher/dashboard
GET  /api/teacher/courses
POST /api/teacher/upload-resource
POST /api/teacher/add-comment
GET  /api/teacher/messenger
POST /api/teacher/messenger
```

## Admin

```text
POST /api/admin/create-teacher
GET  /api/admin/teachers
GET  /api/admin/students
POST /api/admin/assign-course
POST /api/admin/assign-timetable
```

> The complete API surface is larger than this overview. These endpoints represent the main documented operations.

---

# 15. Parent QR API Flow

```text
GET /api/student/parent-report/:studentId
              ↓
        Read studentId
              ↓
        Find Student
              ↓
       Find Enrolled Courses
              ↓
        Find Submissions
              ↓
       Prepare Report Data
              ↓
       Return JSON Response
              ↓
       Parent Report Page
```

---

# 16. Frontend File Structure

```text
lms-client/
├── src/
│   ├── components/
│   │   └── shared/
│   │       ├── Navbar.jsx
│   │       ├── Sidebar.jsx
│   │       ├── Loader.jsx
│   │       └── ErrorBoundary.jsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── student/
│   │   ├── teacher/
│   │   ├── admin/
│   │   └── parent/
│   │       └── ParentReport.jsx
│   │
│   ├── routes/
│   ├── context/
│   ├── api/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

---

# 17. Backend File Structure

```text
lms-server/
├── controllers/
│   ├── adminController.js
│   ├── studentController.js
│   ├── teacherController.js
│   └── testController.js
│
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Timetable.js
│   ├── Test.js
│   ├── Submission.js
│   ├── Message.js
│   ├── Note.js
│   └── Reminder.js
│
├── routes/
│   ├── auth.js
│   ├── student.js
│   ├── teacher.js
│   └── admin.js
│
├── middleware/
├── utils/
├── services/
├── uploads/
├── App.js
├── setup-admin.js
└── package.json
```

---

# 18. Responsive Design

The frontend has been adapted for different screen sizes.

Responsive improvements include:

- Mobile-friendly navigation
- Responsive sidebar behavior
- Responsive dashboard cards
- Responsive forms
- Responsive tables
- Mobile-friendly course layouts
- Responsive teacher/admin pages
- Responsive Parent Report page
- Responsive QR display

The interface uses Tailwind CSS responsive utilities to adapt layouts across screen sizes.

---

# 19. Installation & Local Development

## Prerequisites

- Node.js
- npm
- MongoDB / MongoDB Atlas
- Git

## Backend Setup

```bash
cd lms-server
npm install
```

Create a `.env` file and configure the required backend environment variables.

Then start the server:

```bash
npm run dev
```

## Frontend Setup

```bash
cd lms-client
npm install
```

Configure the frontend API URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Then run:

```bash
npm run dev
```

---

# 20. Deployment

The project can be deployed using separate frontend and backend hosting.

Current project deployment:

```text
Frontend:
Vercel

Backend:
Render

Database:
MongoDB Atlas
```

The frontend uses an environment variable for the deployed API:

```env
VITE_API_BASE_URL=<backend-api-url>/api
```

---

# 21. Environment Variables

Typical backend configuration includes:

```env
PORT=5000
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<jwt-secret>

EMAIL_HOST=<smtp-host>
EMAIL_PORT=<smtp-port>
EMAIL_USER=<email>
EMAIL_PASS=<email-app-password>

GROQ_API_KEY=<ai-api-key>
```

Frontend:

```env
VITE_API_BASE_URL=<backend-api-url>/api
```

Actual secret values should never be committed to GitHub.

---

# 22. Testing & Quality Assurance

Testing should cover:

### Functional Testing

- Registration
- Login
- Password reset
- Course operations
- Test creation
- Test submission
- Result display
- Messaging
- Resource access
- AI Study Bot
- Parent QR scanning and report loading

### Role Testing

Verify that:

- Student sees student features
- Teacher sees teacher features
- Admin sees admin features
- Unauthorized users cannot access protected role features

### Responsive Testing

Test the interface on:

- Desktop
- Tablet
- Mobile

### QR Testing

The Parent QR should be tested by:

1. Opening the student dashboard
2. Displaying the QR
3. Scanning it with a phone
4. Opening the generated report URL
5. Confirming student details load
6. Confirming courses/results display when data exists

> When testing a locally running frontend, a QR containing `localhost` generally cannot be opened from another phone because `localhost` refers to the phone itself. The deployed frontend URL should be used for real phone testing.

---

# 23. Important Project Workflows

## 23.1 Course Assignment

```text
Admin
 ↓
Create Course
 ↓
Assign Teacher
 ↓
Assign Students
 ↓
Manage Timetable
 ↓
Course Available
```

## 23.2 Assessment

```text
Teacher
 ↓
Create Test
 ↓
Add Questions
 ↓
Publish
 ↓
Student Takes Test
 ↓
Submit
 ↓
Evaluation
 ↓
Result
```

## 23.3 Parent Report

```text
Student
 ↓
Dashboard
 ↓
Parent QR
 ↓
Parent Scans
 ↓
Student Report
 ↓
Student + Courses + Results
```

---

# 24. Security & Access Control

The project uses role-based authentication and protected application routes.

Implemented security-related concepts include:

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based authorization
- Protected routes
- Environment variables for secrets
- Mongoose-based database interaction
- Input/error handling in API operations

Security configuration should be reviewed before any production-scale deployment.

---

# 25. Future Enhancements

Possible future improvements include:

- Dedicated parent login/account system
- Advanced parent dashboard
- Real-time chat
- Video conferencing
- Mobile application
- Advanced analytics
- AI-powered personalized recommendations
- Push notifications
- Improved reporting and attendance management
- Redis caching
- Docker containerization
- CI/CD pipeline
- Swagger/OpenAPI documentation

---

# 26. Presentation / Demo Flow

For a college competition demonstration, the recommended flow is:

```text
1. Problem Statement
        ↓
2. Project Introduction
        ↓
3. User Roles
        ↓
4. Student Dashboard
        ↓
5. Course & Timetable
        ↓
6. Assessment & Results
        ↓
7. AI Study Bot
        ↓
8. Teacher Module
        ↓
9. Admin Module
        ↓
10. Parent QR Demo
        ↓
11. Technology Stack
        ↓
12. Future Scope
```

### Highlight During Demo

The **Parent QR** can be presented as a distinctive feature:

> “A student can display a Parent QR from the dashboard. A parent can scan it using a phone and directly access a standalone student report containing student information, enrolled courses, and assessment performance.”

---

# 27. Key Achievements

- Role-based LMS architecture
- Student, Teacher, and Admin modules
- Course management
- Online assessment system
- Result tracking
- Timetable management
- Learning resource management
- Communication features
- AI Study Bot
- Personal notes and reminders
- Responsive interface
- Parent QR and Student Report feature
- Frontend/backend separation
- MongoDB-based data management
- Deployable web application architecture

---

# 28. Conclusion

The Learning Management System provides a centralized digital platform for managing important academic activities.

The project combines course management, assessments, timetables, resources, communication, study tools, AI assistance, and parent-oriented academic access in one application.

The addition of the **Parent QR and Student Report** feature extends the platform beyond student/teacher/admin workflows and provides a simple way for parents to access relevant academic information.

The modular MERN architecture also provides a foundation for future improvements such as dedicated parent accounts, mobile applications, advanced analytics, real-time communication, and additional AI capabilities.

---

## Document Information

**Document Version:** 2.0  
**Project:** Learning Management System (LMS)  
**Status:** Competition / Presentation Version  
**Prepared For:** LMS Development Team
