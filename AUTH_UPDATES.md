# Authentication System Updates

## Overview
Updated the authentication system to support the new API endpoints and payload formats for patient registration, admin/doctor creation, and unified login.

## Changes Made

### 1. **lib/api/endpoints.ts**

#### Updated Login Payload
```typescript
export interface LoginPayload {
    contact: string; // email or phone number
    password: string;
}
```
Changed from separate `email` and `phone` fields to a single `contact` field.

#### New Payload Interfaces
- **SignUpPatientPayload**: For patient registration
- **CreateAdminPayload**: For admin account creation
- **CreateDoctorPayload**: For doctor account creation

#### New API Functions
1. **login()** - Universal login for all user types
   - Payload: `{ contact: string, password: string }`
   - Endpoint: `POST /api/auth/login`

2. **signUpPatient()** - Patient registration
   - Endpoint: `POST /api/auth/register`
   - Payload includes: email, username, password, firstName, lastName, phone, age, medicalHistory

3. **createAdmin()** - Create admin account (requires auth token)
   - Endpoint: `POST /api/admin/create-admin`
   - Payload includes: email, password, firstName, lastName, phone

4. **createDoctor()** - Create doctor account (requires auth token)
   - Endpoint: `POST /api/admin/create-doctor`
   - Payload includes: email, password, firstName, lastName, phone, specialization, department, licenseNumber, city, experience, mobileNumber

### 2. **app/(auth)/login/page.tsx**

#### Updated Login Flow
- Removed role selection buttons (role is now determined by the backend)
- Removed separate email/phone state, now using single `contact` field
- Updated `handleSignIn()` to use unified login payload
- Login now redirects based on the user role returned from the backend

#### Updated Sign-Up Flow
- Updated `handleSignUp()` to match new SignUpPatientPayload structure
- Confirmed all required fields are sent correctly

#### Removed
- Role state variable (`role`)
- Role selection UI component
- Old login credentials comments (updated to reflect new test credentials)

## API Endpoints Reference

### Patient Registration
```
POST /api/auth/register
{
    "email": "patient@hospital.com",
    "username": "patient_user",
    "password": "patient123",
    "confirmPassword": "patient123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "age": 30,
    "medicalHistory": "None"
}
```

### Admin Creation
```
POST /api/admin/create-admin
Authorization: Bearer <admin_token>
{
    "email": "admin2@hospital.com",
    "password": "admin456",
    "firstName": "Sarah",
    "lastName": "Admin",
    "phone": "+1-555-123-4567"
}
```

### Doctor Creation
```
POST /api/admin/create-doctor
Authorization: Bearer <admin_token>
{
    "email": "doctor@hospital.com",
    "password": "doctor123",
    "firstName": "James",
    "lastName": "Smith",
    "phone": "+1-555-987-6543",
    "specialization": "Cardiology",
    "department": "Cardiology Department",
    "licenseNumber": "LIC123456",
    "city": "New York",
    "experience": 10,
    "mobileNumber": "+1-555-111-2222"
}
```

### Universal Login
```
POST /api/auth/login
{
    "contact": "admin@hospital.com",
    "password": "admin123"
}
```

## Test Credentials
- **Admin**: admin@hospital.com / admin123
- **Doctor**: doctor@hospital.com / doctor123
- **Patient**: patient@hospital.com / patient123

## Role-Based Routing
After successful login, users are redirected based on their role:
- Admin → `/dashboard`
- Doctor → `/doctor/dashboard`
- Patient → `/patient/dashboard`

## Authentication Token Management
- Tokens are stored in cookies with 7-day expiration
- User role and ID are also stored for middleware checks
- Token is automatically sent with all API requests via the client
