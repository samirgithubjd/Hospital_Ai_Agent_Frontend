# Hospital AI Agent - Frontend

A modern, responsive hospital AI dashboard built with Next.js 16, TypeScript, Tailwind CSS, and integrated with a backend API.

## 🎯 Features

- **Modern Dark UI**: Premium dark-themed dashboard with slate and blue color palette
- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **JWT Authentication**: Secure login with JWT token management and protected routes
- **Real-time Data**: Integrated with backend API for calls, patients, and appointments
- **Interactive Dashboard**: Call statistics, appointment charts, and real-time notifications
- **Patient Management**: Grid view of patients with emergency indicators
- **Call Logs**: Comprehensive call history with filtering and search
- **Appointment Scheduling**: Appointment management with status tracking
- **AI Settings**: Configurable AI parameters and diagnostics
- **User Settings**: Profile management and preferences
- **Responsive Sidebar**: Collapsible navigation with mobile menu
- **Toast Notifications**: Error and success feedback

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Backend API running at `http://localhost:5000/api`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔐 Authentication

### Login Flow

1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: admin@hospital.com (or any email)
   - Password: password123 (or any password)
3. Backend validates at `POST /api/auth/login` and returns JWT token
4. Token is stored in secure cookie (`auth_token`)
5. Token automatically attached to all API requests via interceptors
6. Redirect to dashboard on successful login

### Request Structure

- **Method**: POST
- **Endpoint**: `/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@hospital.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "1",
      "email": "admin@hospital.com",
      "name": "Admin User"
    }
  }
  ```

### API Token Management

- Tokens are stored in `auth_token` cookie (httpOnly recommended in production)
- Token persists across page refreshes
- On 401 response, token is automatically cleared and user redirected to login
- Use `useAuth()` hook to access current user and logout

## 📡 API Integration

### Available Endpoints

All endpoints require the JWT token in the `Authorization` header as `Bearer {token}`:

#### Calls
- `GET /api/calls` - List all calls
  - Response: `{ calls: Call[], total: number, completed: number, missed: number, ongoing: number }`
- `GET /api/calls/:id` - Get specific call
  - Response: `{ id, patientName, phoneNumber, callTime, duration, status, recordingUrl, transcript }`

#### Patients
- `GET /api/patients` - List all patients
  - Response: `Patient[]`
- `GET /api/patients/:id` - Get specific patient
  - Response: `{ id, name, age, phone, email, isEmergency, symptoms, lastCallDate }`

#### Appointments
- `GET /api/appointments` - List all appointments
  - Response: `{ appointments: Appointment[], total: number, pending: number, confirmed: number }`
- `GET /api/appointments/:id` - Get specific appointment
  - Response: `{ id, appointmentTime, doctorName, reason, status, patientId }`

### Axios Client Configuration

The API client is configured in `lib/api/client.ts`:
- **Base URL**: `http://localhost:5000/api` (from `NEXT_PUBLIC_API_URL` env var)
- **Interceptors**: Automatically attach JWT token to all requests
- **Error Handling**: 401 errors trigger logout and redirect to login

## 📁 Project Structure

```
app/
├── (auth)/
│   └── login/
│       └── page.tsx           # Login page
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx           # Main dashboard
│   ├── calls/
│   │   ├── page.tsx           # Calls list
│   │   └── [id]/
│   │       └── page.tsx       # Call details
│   ├── patients/
│   │   ├── page.tsx           # Patients list
│   │   └── [id]/
│   │       └── page.tsx       # Patient details
│   ├── appointments/
│   │   └── page.tsx           # Appointments list
│   ├── ai-settings/
│   │   └── page.tsx           # AI configuration
│   └── settings/
│       └── page.tsx           # User settings
├── layout.tsx                 # Root layout with providers
└── globals.css               # Global dark theme styles

components/
├── ui/
│   ├── card.tsx              # Card component
│   ├── button.tsx            # Button variants
│   ├── badge.tsx             # Status badges
│   ├── table.tsx             # Data tables
│   ├── input.tsx             # Input fields
│   ├── switch.tsx            # Toggle switches
│   ├── select.tsx            # Dropdowns
│   ├── tabs.tsx              # Tab navigation
│   └── skeleton.tsx          # Loading skeletons
└── layout/
    ├── sidebar.tsx           # Navigation sidebar
    └── header.tsx            # Top header with user menu

lib/
├── api/
│   ├── client.ts             # Axios client with interceptors
│   ├── auth.ts               # Token management
│   ├── endpoints.ts          # Login endpoint
│   ├── calls.ts              # Calls API
│   ├── patients.ts           # Patients API
│   └── appointments.ts       # Appointments API
├── auth-context.tsx          # Auth provider and useAuth hook
└── utils.ts                  # Utility functions

middleware.ts                 # Route protection middleware
```

## 🎨 Styling

- **Framework**: Tailwind CSS v4
- **Theme**: Dark theme with slate and blue colors
- **Colors**:
  - Background: `#0F172A` (slate-900)
  - Cards: `#1E293B` (slate-800)
  - Accent: `#0EA5E9` (blue-500)
  - Success: `#10B981` (green-500)
  - Warning: `#F59E0B` (amber-500)
  - Error: `#EF4444` (red-500)

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Tailwind Configuration

- Configured in `tailwind.config.ts`
- Custom color palette extending default Tailwind colors
- Dark mode enabled globally

## 🧪 Testing with Backend

### Test Login Flow

1. Start backend: `npm start` (in backend directory)
2. Start frontend: `npm run dev`
3. Navigate to `http://localhost:3000/login`
4. Enter test credentials
5. Check browser console for API requests
6. Should redirect to dashboard on success

### Monitor API Calls

- Open Developer Tools (F12)
- Go to Network tab
- Login and watch for:
  - `POST /api/auth/login` (should return 2xx with token)
  - `GET /api/calls` (should return call data)
  - `GET /api/patients` (should return patient data)
  - `GET /api/appointments` (should return appointment data)

### Verify Token Attachment

```javascript
// In browser console
fetch('http://localhost:5000/api/calls', {
  headers: {
    'Authorization': `Bearer ${document.cookie.split('auth_token=')[1]}`
  }
})
```

## 🔐 Route Protection

- All routes except `/login` are protected by middleware
- Middleware checks for `auth_token` cookie
- Missing token redirects to login with returnUrl
- Invalid token triggers 401 and redirects to login

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: > 1024px (lg)

## 🐛 Debugging

### Common Issues

**1. API Connection Failed**
- Ensure backend is running at `http://localhost:5000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend CORS settings allow `http://localhost:3000`

**2. Login Failed**
- Check backend `/auth/login` endpoint exists
- Verify backend returns `{ token, user }` object
- Check browser console for specific error

**3. Token Not Persisting**
- Verify `auth_token` cookie is set (DevTools → Application → Cookies)
- Check if browser allows cookies from localhost
- Ensure backend sets cookie with credentials

**4. Routes Not Protected**
- Verify `middleware.ts` is in root folder
- Check middleware matches correct paths
- Ensure `auth_token` cookie name matches

## 📚 Component Usage

### Using the Card Component

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Using the Button Component

```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary">Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
```

### Using the useAuth Hook

```tsx
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.name}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🚀 Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## 📝 Environment Setup

### Production Recommendations

1. Use HTTPS for all API calls
2. Set `httpOnly` flag on auth cookies (backend configuration)
3. Implement CORS properly on backend
4. Use secure JWT secret on backend
5. Add rate limiting on login endpoint
6. Implement token refresh mechanism
7. Add logging and monitoring

## 📄 License

MIT

## 👥 Support

For issues or questions, please check:
1. Backend API is running and accessible
2. Environment variables are correctly set
3. Browser console for error messages
4. Network tab for API request details
