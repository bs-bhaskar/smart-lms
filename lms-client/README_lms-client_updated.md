# 🎓 Smart Learn LMS — Frontend (React)

The frontend application of Smart Learn LMS, a role-based Learning Management System built with React 18, Vite, Tailwind CSS, and Axios.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.5.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.3-38B2AC)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Table of Contents

- [Features](#-features)
- [Parent QR & Student Report](#-parent-qr--student-report)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Components](#-components)
- [State Management](#-state-management)
- [Routing](#-routing)
- [API Integration](#-api-integration)
- [Styling](#-styling)
- [Build & Deploy](#-build--deploy)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional interface with orange theme
- **Role-Based Navigation**: Dynamic menus based on user role
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: User-friendly error messages and boundaries

### 👨‍🎓 Student Features
- **Dashboard**: Today's classes, recent activities, and quick actions
- **Course Management**: View enrolled courses with resources
- **Timetable**: Card-based schedule with expandable details
- **Assessment**: Take tests and view results
- **Study Bot**: AI assistant for notes and reminders
- **Messaging**: View teacher announcements
- **Profile Management**: Update personal information

### 👨‍🏫 Teacher Features
- **Teaching Dashboard**: Scheduled classes and student overview
- **Course Management**: Upload resources and manage content
- **Assessment Tools**: Create and grade tests
- **Messenger**: Send messages to students
- **Timetable**: View teaching schedule
- **Student Analytics**: Track student progress

### 👨‍💼 Admin Features
- **User Management**: Create and manage teacher accounts
- **Course Administration**: Assign courses and timetables
- **System Monitoring**: View analytics and reports
- **Profile Management**: Manage student and teacher profiles

### 🔒 Authentication
- **Multi-Role Login**: Single form for all user types
- **Password Management**: Forgot password, reset, and change
- **Session Management**: JWT-based authentication
- **Route Protection**: Role-based access control

## 📌 Current Project Status

The frontend currently includes the responsive Student, Teacher, and Admin interfaces, role-based routing, AI Study Bot, and the Parent QR / Student Report flow.

**Live deployment**
- Frontend: `https://smart-lms-three.vercel.app/`
- Backend API: `https://smart-lms-kbqd.onrender.com/api`

> Note: The project is in the final testing / competition-presentation phase. Some backend-side authorization and unfinished admin functionality are documented as future fixes rather than being presented as completed features.

## 📱 Parent QR & Student Report

The Student Dashboard provides a **Parent Access QR code**. The QR contains a public frontend URL for the logged-in student's report.

### Flow

```text
Student Dashboard
      ↓
Parent Access QR
      ↓
Scan QR from phone
      ↓
/parent-report/:studentId
      ↓
Backend fetches student report
      ↓
Standalone Parent Report page
```

### What parents can view

- Student name, email, and registration number
- Enrolled courses
- Course teacher information
- Test / assessment results
- Marks, percentage, submission date, and grading status

### Frontend route

```text
/parent-report/:studentId
```

This route is intentionally placed outside the authenticated dashboard layout, so parents see a standalone report instead of the Student / Teacher / Admin sidebar.

### QR generation

The Student Dashboard uses `QRCodeCanvas` from `qrcode.react`:

```jsx
const parentReportUrl = user?.id
  ? `${window.location.origin}/parent-report/${user.id}`
  : '';
```

The QR therefore automatically uses the current frontend origin. On the deployed site, it points to the Vercel application.

### Important local-development note

If the QR is generated while running the frontend on `localhost`, the QR contains a `localhost` URL. Scanning that QR from a phone will point to the phone's own localhost and normally will not open the developer's PC.

For a real phone demo, use the deployed Vercel URL or configure a LAN-accessible development URL.

## 🛠 Tech Stack

### Core Technologies
- **React 18.2.0** - Modern UI library with hooks
- **React Router DOM 6.22.3** - Client-side routing
- **Vite 4.5.0** - Fast build tool and dev server
- **Tailwind CSS 3.4.3** - Utility-first CSS framework

### Additional Libraries
- **Axios 1.4.0** - HTTP client for API communication
- **React Icons 5.5.0** - Comprehensive icon library
- **React Context** - State management for authentication
- **qrcode.react** - Generates the student Parent Access QR code

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Error Boundaries** - React error handling

## ⚡ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
git clone https://github.com/bs-bhaskar/smart-lms.git
cd smart-lms/lms-client
npm install
cp .env.example .env
nano .env
```

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/                 # Reusable components
│   └── shared/                # Shared components
│       ├── Navbar.jsx         # Navigation bar
│       ├── Sidebar.jsx        # Sidebar navigation
│       ├── Loader.jsx         # Loading spinner
│       └── ErrorBoundary.jsx  # Error handling
├── pages/                     # Page components
│   ├── auth/                  # Authentication pages
│   │   ├── Login.jsx          # Login form
│   │   ├── Register.jsx       # Student registration
│   │   ├── ForgotPassword.jsx # Password reset
│   │   ├── ResetPassword.jsx  # Password reset form
│   │   └── ChangePassword.jsx # Change password
│   ├── student/               # Student pages
│   │   ├── Dashboard.jsx      # Student dashboard
│   │   ├── Courses.jsx        # Course management
│   │   ├── Timetable.jsx      # Personal timetable
│   │   ├── Profile.jsx        # Student profile
│   │   ├── StudyBot.jsx       # AI study assistant
│   │   ├── Messages.jsx       # Teacher messages
│   │   ├── Tests.jsx          # Available tests
│   │   └── Results.jsx        # Test results
│   ├── parent/                # Public parent report
│   │   └── ParentReport.jsx  # Standalone student report
│   ├── teacher/               # Teacher pages
│   │   ├── Dashboard.jsx      # Teacher dashboard
│   │   ├── Courses.jsx        # Course management
│   │   ├── AddMaterial.jsx    # Resource upload
│   │   ├── Messenger.jsx      # Student messaging
│   │   ├── Profile.jsx        # Teacher profile
│   │   ├── Tests.jsx          # Test management
│   │   └── Results.jsx        # Grade management
│   └── admin/                 # Admin pages
│       ├── Dashboard.jsx      # Admin dashboard
│       ├── CreateTeacher.jsx  # Teacher creation
│       ├── ManageProfiles.jsx # User management
│       ├── UploadResources.jsx # Resource management
│       ├── AssignCourses.jsx  # Course assignment
│       ├── AssignTimetables.jsx # Timetable assignment
│       └── Results.jsx        # System analytics
├── routes/                    # Route protection
│   ├── PrivateRoute.jsx       # Authentication guard
│   ├── TeacherRoute.jsx       # Teacher access control
│   └── AdminRoute.jsx         # Admin access control
├── context/                   # React context
│   └── AuthContext.jsx        # Authentication state
├── api/                       # API configuration
│   └── axios.js               # Axios instance
├── App.jsx                    # Main app component
├── main.jsx                   # App entry point
└── index.css                  # Global styles
```

## 🧩 Components

### Shared Components

#### Navbar
- **Purpose**: Main navigation bar with role-based menu
- **Features**: Logo, navigation links, logout button
- **Props**: None (uses AuthContext)

#### Sidebar
- **Purpose**: Side navigation for authenticated users
- **Features**: Role-based menu items, active state
- **Props**: None (uses AuthContext and useLocation)

#### Loader
- **Purpose**: Loading spinner component
- **Features**: Centered spinner with optional text
- **Props**: `text` (optional)

#### ErrorBoundary
- **Purpose**: React error boundary for error handling
- **Features**: Catches JavaScript errors, displays fallback UI
- **Props**: `children`

### Page Components

#### Authentication Pages
- **Login**: Multi-role login with email/registration number
- **Register**: Student self-registration
- **ForgotPassword**: Email-based password reset
- **ResetPassword**: OTP verification and password reset
- **ChangePassword**: In-app password modification

#### Student Pages
- **Dashboard**: Overview with today's classes and activities
- **Courses**: Enrolled courses with resources and comments
- **Timetable**: Personal schedule with card-based UI
- **Profile**: Personal information and settings
- **StudyBot**: AI assistant for notes and reminders
- **Messages**: Teacher announcements and notifications
- **Tests**: Available tests with expiry information
- **Results**: Test results and performance history

#### Parent Report Page

- **ParentReport**: Public, standalone student academic report opened from the Parent QR code
- **Data source**: Fetches report data from the backend using the student ID in the URL

### Teacher Pages
- **Dashboard**: Teaching overview with scheduled classes
- **Courses**: Course management with resource upload
- **AddMaterial**: File and link upload interface
- **Messenger**: Student communication system
- **Profile**: Teacher information and settings
- **Tests**: Test creation and management
- **Results**: Student grading and analytics

#### Admin Pages
- **Dashboard**: System overview and management
- **CreateTeacher**: Teacher account creation
- **ManageProfiles**: User management interface
- **UploadResources**: System-wide resource management
- **AssignCourses**: Course assignment interface
- **AssignTimetables**: Timetable management
- **Results**: System analytics and reports

## 🔄 State Management

### Authentication Context
```javascript
{
  user: User object,
  role: 'student' | 'teacher' | 'admin',
  token: JWT token,
  loading: boolean,
  login: function,
  logout: function,
  updateUser: function
}
```

### Local State
- **useState**: Component-level state management
- **useEffect**: Side effects and API calls
- **Custom hooks**: Reusable state logic

### State Patterns
- **Loading states**: Consistent loading indicators
- **Error handling**: User-friendly error messages

## 🛣 Routing

### Route Structure
```javascript
// Public routes
/login
/register
/forgot-password
/reset-password

// Public parent report
/parent-report/:studentId

// Protected routes
/student/dashboard
/student/courses
/student/timetable
/student/profile
/student/studybot
/student/messages
/student/tests
/student/results

/teacher/dashboard
/teacher/courses
/teacher/add-material
/teacher/messenger
/teacher/profile
/teacher/tests
/teacher/results

/admin/dashboard
/admin/create-teacher
/admin/manage-profiles
/admin/upload-resources
/admin/assign-courses
/admin/assign-timetables
/admin/results
```

### Route Protection
- **PrivateRoute**: Requires authentication
- **TeacherRoute**: Requires teacher role
- **AdminRoute**: Requires admin role
- **Automatic redirects**: Based on user role

## 🔌 API Integration

### Axios Configuration
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lmsToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lmsToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Patterns
- **Consistent error handling**: Centralized error management
- **Loading states**: Automatic loading indicators
- **API error handling**: Centralized Axios response handling
- **Authenticated requests**: JWT attached through Axios interceptor

## 🎨 Styling

### Tailwind CSS
- **Utility-first**: Rapid UI development
- **Responsive design**: Mobile-first approach
- **Custom theme**: Orange color scheme
- **Component classes**: Reusable style patterns

### Design System
```css
:root {
  --color-orange: #ff6b35;
  --color-orange-dark: #e55a2b;
}

.btn-primary {
  @apply bg-orange text-white px-4 py-2 rounded hover:bg-orange-dark transition;
}

.card {
  @apply bg-white rounded-xl shadow p-6;
}
```

### Responsive Design
- **Mobile-first**: Base styles for mobile
- **Tablet**: Medium breakpoint styles
- **Desktop**: Large breakpoint styles
- **Accessibility**: WCAG compliant design

## 🚀 Build & Deploy

### Development
```bash
npm run dev
npm run lint
npm run format  # if configured in package.json
```

### Production Build
```bash
npm run build
npm run preview
npm run analyze  # if configured in package.json
```

### Deployment Options

#### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

#### Static Hosting
```bash
npm run build
npx serve dist
```

### Environment Variables
```env
# Development
VITE_API_BASE_URL=http://localhost:5000/api

# Production
VITE_API_BASE_URL=https://smart-lms-kbqd.onrender.com/api
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Make your changes
6. Run tests: `npm test  # if configured in package.json`
7. Submit a pull request

### Code Style
- Use ESLint and Prettier
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

### Testing
```bash
npm test  # if configured in package.json
npm run test:coverage  # if configured in package.json
npm run test:watch  # if configured in package.json
```

## 🧪 Parent QR Testing

1. Log in as a student.
2. Open **Student Dashboard**.
3. Confirm the **Parent Access** QR is visible.
4. Scan the QR using a phone.
5. Confirm `/parent-report/:studentId` opens without login.
6. Verify student details, courses, and results shown by the backend.
7. Test an invalid student ID and confirm a suitable error state is displayed.

## 📊 Performance

### Optimization Techniques
- **Code splitting**: Route-based code splitting
- **Lazy loading**: Component lazy loading
- **Image optimization**: Optimized image loading
- **Bundle analysis**: Regular bundle size monitoring

### Performance Notes
Performance depends on the deployed frontend, backend response time, device, and network conditions. Use Lighthouse and the browser DevTools for final production measurements.

## 🔒 Security

### Security Measures
- **Input validation**: Client-side validation
- **XSS prevention**: React's built-in protection
- **HTTPS in production**: Frontend and backend are deployed over HTTPS

### Best Practices
- **Environment variables**: Secure configuration
- **Error handling**: No sensitive data in errors
- **Authentication**: Secure token management
- **File uploads**: Type and size validation

## 📈 Analytics

### User Analytics
- **Page views**: Track user navigation
- **Feature usage**: Monitor feature adoption
- **Error tracking**: Monitor application errors
- **Performance monitoring**: Track load times

### Implementation

Application-level error handling is provided through React error boundaries and Axios response handling. External analytics can be added later if required.

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

#### API Connection Issues
```bash
echo $VITE_API_BASE_URL
curl http://localhost:5000/api/health
```

#### Styling Issues
```bash
npm run build  # rebuild Tailwind/Vite output
# Hard refresh: Ctrl+Shift+R
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)

### Tools
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## 🎤 Competition Demo Flow

A concise frontend demo can follow this order:

1. Student login and dashboard
2. Responsive navigation on desktop/mobile
3. Courses, timetable, tests, and results
4. AI Study Bot
5. Parent Access QR → scan → standalone Parent Report
6. Teacher dashboard and assessment workflow
7. Admin dashboard and management features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using React and Tailwind CSS**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/lms-project?style=social)](https://github.com/bs-bhaskar/smart-lms/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/lms-project)](https://github.com/bs-bhaskar/smart-lms/issues)

</div> 