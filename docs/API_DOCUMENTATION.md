# EduManage Pro - Complete API Documentation

## Overview
This document provides comprehensive API documentation for EduManage Pro, including all endpoints, request/response formats, authentication, error handling, and implementation status.

**Last Updated**: February 26, 2026  
**API Version**: v1  
**Status**: Production Ready

## Base URL
- **Production**: `https://api.edumanage.pro/v1`
- **Staging**: `https://staging-api.edumanage.pro/v1`
- **Development**: `http://localhost:5000/api/v1`

## Authentication

### JWT Token Authentication
All API endpoints require JWT token authentication except for public endpoints.

#### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Tenant-ID: <tenant_id>
```

#### Token Format
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "teacher",
  "tenant_id": "tenant_123",
  "exp": 1640995200,
  "iat": 1640908800
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "refresh_token_here"
}
```

#### Response
```json
{
  "access_token": "new_access_token",
  "refresh_token": "new_refresh_token",
  "expires_in": 3600
}
```

## Error Handling

### Standard Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ],
    "timestamp": "2024-01-01T12:00:00Z",
    "request_id": "req_123456"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Endpoints

### Authentication

All authentication endpoints include comprehensive validation, rate limiting, and security features.

#### Register
```http
POST /auth/register
Content-Type: application/json
Rate Limit: 3 requests per hour

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "SecurePass123",
  "role": "teacher",
  "phone": "+91-9876543210",
  "institutionId": "inst_123"
}
```

**Password Requirements:**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "teacher",
      "plan": "basic",
      "institutionId": "inst_123"
    },
    "accessToken": "jwt_access_token_here",
    "refreshToken": "jwt_refresh_token_here",
    "expiresIn": "7d"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json
Rate Limit: 5 requests per 15 minutes

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "teacher",
      "plan": "basic",
      "institutionId": "inst_123",
      "lastLogin": "2026-02-26T10:30:00Z"
    },
    "accessToken": "jwt_access_token_here",
    "refreshToken": "jwt_refresh_token_here",
    "expiresIn": "7d"
  }
}
```

#### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json
Rate Limit: 10 requests per 15 minutes

{
  "refreshToken": "jwt_refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token",
    "expiresIn": "7d"
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Change Password
```http
POST /auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json
Rate Limit: 3 requests per hour

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

#### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### Verify Reset Token
```http
POST /auth/verify-reset-token
Content-Type: application/json

{
  "token": "reset_token_from_email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "teacher",
      "plan": "basic",
      "permissions": [
        "attendance.mark",
        "attendance.view",
        "notes.create",
        "homework.assign"
      ],
      "modules": ["DASHBOARD", "STUDENTS", "ATTENDANCE"],
      "phone": "+91-9876543210",
      "institutionId": "inst_123",
      "status": "active",
      "lastLogin": "2026-02-26T10:30:00Z",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  }
}
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+91-9876543211",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": {
    "theme": "dark",
    "language": "en"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Smith",
      "email": "user@example.com",
      "phone": "+91-9876543211",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

**Security Features:**
- JWT token-based authentication with access and refresh tokens
- Password hashing using bcrypt
- Token expiration and rotation
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Secure token storage (hashed refresh tokens)
- Account status verification
- Role-based access control (RBAC)
- Permission-based authorization

### Users

#### Get Current User
```http
GET /users/me
Authorization: Bearer <token>
```

#### Response
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "teacher",
  "tenant_id": "tenant_123",
  "profile": {
    "phone": "+91-9876543210",
    "address": "123 Main St, Mumbai"
  },
  "permissions": [
    "attendance.mark",
    "notes.create",
    "homework.assign"
  ]
}
```

#### Update User
```http
PUT /users/{user_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+91-9876543210",
  "address": "456 New St, Delhi"
}
```

### Students

#### Get Students
```http
GET /students?class_id=class_123&section_id=section_456&page=1&limit=20
Authorization: Bearer <token>
```

#### Response
```json
{
  "students": [
    {
      "id": "student_123",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "class_id": "class_123",
      "section_id": "section_456",
      "roll_number": "A001",
      "parent_id": "parent_789"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

#### Create Student
```http
POST /students
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Bob Smith",
  "email": "bob@example.com",
  "class_id": "class_123",
  "section_id": "section_456",
  "roll_number": "A002",
  "parent_id": "parent_790"
}
```

### Attendance

#### Mark Attendance
```http
POST /attendance/mark
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-01-01",
  "class_id": "class_123",
  "section_id": "section_456",
  "records": [
    {
      "student_id": "student_123",
      "status": "present",
      "remarks": "On time"
    },
    {
      "student_id": "student_124",
      "status": "absent",
      "remarks": "Sick leave"
    }
  ]
}
```

#### Get Attendance
```http
GET /attendance?class_id=class_123&section_id=section_456&date=2024-01-01
Authorization: Bearer <token>
```

#### Response
```json
{
  "attendance": [
    {
      "student_id": "student_123",
      "student_name": "Alice Johnson",
      "status": "present",
      "remarks": "On time",
      "marked_by": "teacher_456",
      "marked_at": "2024-01-01T09:00:00Z"
    }
  ],
  "summary": {
    "total_students": 30,
    "present": 28,
    "absent": 2,
    "percentage": 93.33
  }
}
```

### Notes & Homework

#### Create Note
```http
POST /notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction to Algebra",
  "content": "Today we learned about basic algebraic equations...",
  "class_id": "class_123",
  "section_id": "section_456",
  "subject_id": "subject_789",
  "attachments": [
    {
      "name": "algebra_basics.pdf",
      "url": "https://s3.amazonaws.com/edumanage/algebra_basics.pdf",
      "size": 1024000
    }
  ]
}
```

#### Get Notes
```http
GET /notes?class_id=class_123&subject_id=subject_789&page=1&limit=10
Authorization: Bearer <token>
```

#### Create Homework
```http
POST /homework
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Algebra Assignment",
  "description": "Complete exercises 1-10 from Chapter 2",
  "class_id": "class_123",
  "section_id": "section_456",
  "subject_id": "subject_789",
  "due_date": "2024-01-08T23:59:59Z",
  "max_marks": 100,
  "attachments": [
    {
      "name": "assignment.pdf",
      "url": "https://s3.amazonaws.com/edumanage/assignment.pdf"
    }
  ]
}
```

#### Submit Homework
```http
POST /homework/{homework_id}/submit
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "submission_text": "Here is my solution...",
  "attachments": [file1.jpg, file2.pdf]
}
```

### Fees & Payments

#### Create Invoice
```http
POST /fees/invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "student_id": "student_123",
  "items": [
    {
      "description": "Tuition Fee - January 2024",
      "amount": 5000,
      "tax": 900
    }
  ],
  "due_date": "2024-01-31T23:59:59Z"
}
```

#### Get Invoices
```http
GET /fees/invoices?student_id=student_123&status=pending
Authorization: Bearer <token>
```

#### Initiate Payment
```http
POST /fees/invoices/{invoice_id}/pay
Authorization: Bearer <token>
Content-Type: application/json

{
  "payment_method": "upi",
  "amount": 5900
}
```

#### Response
```json
{
  "payment_id": "payment_123",
  "order_id": "order_456",
  "payment_url": "https://razorpay.com/pay/order_456",
  "expires_at": "2024-01-01T12:30:00Z"
}
```

### Notifications

#### Send Notification
```http
POST /notifications/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Parent-Teacher Meeting",
  "message": "PTM scheduled for tomorrow at 3 PM",
  "recipients": [
    {
      "type": "parent",
      "ids": ["parent_123", "parent_456"]
    }
  ],
  "channels": ["email", "sms", "push"],
  "priority": "high"
}
```

#### Get Notifications
```http
GET /notifications?user_id=user_123&read=false&page=1&limit=20
Authorization: Bearer <token>
```

### Reports

#### Get Student Report
```http
GET /reports/student/{student_id}?academic_year=2023-24
Authorization: Bearer <token>
```

#### Response
```json
{
  "student": {
    "id": "student_123",
    "name": "Alice Johnson",
    "class": "10-A",
    "roll_number": "A001"
  },
  "academic_summary": {
    "attendance_percentage": 95.5,
    "total_homework": 45,
    "submitted_homework": 43,
    "average_marks": 85.2
  },
  "subjects": [
    {
      "name": "Mathematics",
      "marks": 88,
      "grade": "A",
      "attendance": 96
    }
  ]
}
```

## WebSocket Events

### Connection
```javascript
const socket = io('wss://api.edumanage.pro', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

### Events

#### Attendance Updates
```javascript
socket.on('attendance:marked', (data) => {
  console.log('Attendance marked:', data);
  // {
  //   class_id: 'class_123',
  //   section_id: 'section_456',
  //   date: '2024-01-01',
  //   student_id: 'student_123',
  //   status: 'present'
  // }
});
```

#### New Homework
```javascript
socket.on('homework:created', (data) => {
  console.log('New homework:', data);
  // {
  //   id: 'homework_123',
  //   title: 'Algebra Assignment',
  //   due_date: '2024-01-08T23:59:59Z'
  // }
});
```

#### PTM Updates
```javascript
socket.on('ptm:updated', (data) => {
  console.log('PTM updated:', data);
  // {
  //   slot_id: 'slot_123',
  //   status: 'booked',
  //   parent_id: 'parent_456'
  // }
});
```

## Rate Limiting

### Limits
- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour
- **Bulk operations**: 10 requests per minute

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640908800
```

## Pagination

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field
- `order`: Sort order (asc/desc)

### Response Format
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

## Filtering

### Query Parameters
- `field=value`: Exact match
- `field__gt=value`: Greater than
- `field__lt=value`: Less than
- `field__contains=value`: Contains
- `field__in=value1,value2`: In list

### Example
```
GET /students?class_id=class_123&attendance__gt=90&name__contains=John
```

## SDK Examples

### JavaScript/Node.js
```javascript
const EduManageAPI = require('@edumanage/api-client');

const client = new EduManageAPI({
  baseURL: 'https://api.edumanage.pro/v1',
  token: 'your_jwt_token'
});

// Get students
const students = await client.students.list({
  class_id: 'class_123',
  page: 1,
  limit: 20
});

// Mark attendance
await client.attendance.mark({
  date: '2024-01-01',
  class_id: 'class_123',
  records: [...]
});
```

### Python
```python
from edumanage_api import EduManageClient

client = EduManageClient(
    base_url='https://api.edumanage.pro/v1',
    token='your_jwt_token'
)

# Get students
students = client.students.list(
    class_id='class_123',
    page=1,
    limit=20
)

# Mark attendance
client.attendance.mark(
    date='2024-01-01',
    class_id='class_123',
    records=[...]
)
```

## Testing

### Postman Collection
Import the provided Postman collection to test all endpoints.

### cURL Examples
```bash
# Login
curl -X POST https://api.edumanage.pro/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","tenant_id":"tenant_123"}'

# Get students
curl -X GET https://api.edumanage.pro/v1/students \
  -H "Authorization: Bearer your_jwt_token" \
  -H "X-Tenant-ID: tenant_123"
```

## Changelog

### v1.0.0 (2024-01-01)
- Initial API release
- Authentication endpoints
- User management
- Attendance tracking
- Notes and homework
- Fees and payments

### v1.1.0 (2024-02-01)
- Added WebSocket support
- Enhanced filtering options
- Improved error handling
- Added bulk operations

## Support

### Documentation
- [API Reference](https://docs.edumanage.pro/api)
- [SDK Documentation](https://docs.edumanage.pro/sdk)
- [Tutorials](https://docs.edumanage.pro/tutorials)

### Contact
- **API Support**: api-support@edumanage.pro
- **Developer Forum**: https://forum.edumanage.pro
- **Status Page**: https://status.edumanage.pro

## New Endpoints Added (Latest Updates)

### Dashboard Endpoints ✅
```http
GET /api/v1/dashboard
GET /api/v1/dashboard/student
GET /api/v1/dashboard/teacher
GET /api/v1/dashboard/parent
GET /api/v1/dashboard/admin
GET /api/v1/dashboard/quick-stats
```

**Description**: Role-based dashboard data with quick stats, schedules, and notifications.

**Response Example**:
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "student_123",
      "name": "John Doe",
      "class": "Grade 10",
      "section": "A"
    },
    "quickStats": {
      "attendance": "95%",
      "pendingAssignments": 2,
      "feeStatus": "Paid",
      "unreadMessages": 3
    },
    "todaySchedule": [...],
    "pendingAssignments": [...],
    "notifications": [...]
  }
}
```

### Theme & Preferences Endpoints ✅
```http
GET /api/v1/theme/user
PUT /api/v1/theme/user
GET /api/v1/theme/system
PUT /api/v1/theme/system
GET /api/v1/theme/available
GET /api/v1/theme/tokens
```

**Description**: User theme preferences and system branding configuration.

**Update Theme Request**:
```json
{
  "theme": "dark",
  "colorScheme": "blue",
  "fontSize": "medium",
  "language": "en",
  "notifications": {
    "email": true,
    "sms": true,
    "push": true
  },
  "accessibility": {
    "highContrast": false,
    "reducedMotion": false
  }
}
```

### Tenant Management Endpoints ✅
```http
GET /api/v1/tenants
POST /api/v1/tenants
GET /api/v1/tenants/:id
PUT /api/v1/tenants/:id
DELETE /api/v1/tenants/:id
```

**Description**: Multi-tenant management for school/institution administration.

### PTM (Parent-Teacher Meeting) Endpoints ✅
```http
GET /api/v1/ptm/slots
POST /api/v1/ptm/slots
GET /api/v1/ptm/slots/:id
PUT /api/v1/ptm/slots/:id
DELETE /api/v1/ptm/slots/:id
POST /api/v1/ptm/slots/:id/book
PUT /api/v1/ptm/slots/:id/cancel
POST /api/v1/ptm/slots/:id/video-meeting
POST /api/v1/ptm/slots/:id/reminder
POST /api/v1/ptm/reminders/automated
GET /api/v1/ptm/statistics
PUT /api/v1/ptm/slots/:id/complete
```

**Description**: Complete PTM slot management, booking, video meetings, and automated reminders.

**Book PTM Slot Request**:
```json
{
  "studentId": "student_123",
  "notes": "Discuss academic progress"
}
```

**Response**:
```json
{
  "success": true,
  "message": "PTM slot booked successfully",
  "data": {
    "_id": "slot_123",
    "teacherId": {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@school.com"
    },
    "date": "2026-03-15T00:00:00Z",
    "startTime": "14:00",
    "endTime": "14:30",
    "status": "booked",
    "bookedBy": "parent_123",
    "studentId": "student_123",
    "bookingNotes": "Discuss academic progress",
    "bookedAt": "2026-02-26T10:00:00Z"
  }
}
```

**Schedule Video Meeting Request**:
```json
{
  "provider": "jitsi",
  "enableRecording": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Video meeting scheduled successfully",
  "data": {
    "_id": "slot_123",
    "videoMeeting": {
      "conferenceId": "conf_123",
      "meetingUrl": "https://meet.jit.si/ptm-slot-123",
      "meetingId": "ptm-slot-123",
      "provider": "jitsi"
    },
    "status": "booked"
  }
}
```

**Send Automated Reminders Request**:
```json
{
  "hoursBeforeMeeting": 24
}
```

**Response**:
```json
{
  "success": true,
  "message": "5 reminders sent successfully",
  "data": {
    "count": 5
  }
}
```

**Get PTM Statistics Response**:
```json
{
  "success": true,
  "data": {
    "total": 150,
    "available": 45,
    "booked": 80,
    "completed": 20,
    "cancelled": 5,
    "withVideoMeeting": 60,
    "remindersSent": 75
  }
}
```

**Permissions**:
- Create/Update/Delete Slots: Admin, Teacher, Principal
- Book Slots: All authenticated users
- Video Meeting: Admin, Teacher, Principal
- Statistics: Admin, Teacher, Principal

---

### Admissions Management Endpoints ✅
```http
GET /api/v1/admissions/applications
POST /api/v1/admissions/applications
GET /api/v1/admissions/applications/:id
PUT /api/v1/admissions/applications/:id
POST /api/v1/admissions/applications/:id/review
POST /api/v1/admissions/applications/:id/approve
POST /api/v1/admissions/applications/:id/reject
POST /api/v1/admissions/entrance-tests
GET /api/v1/admissions/entrance-tests/:id/results
POST /api/v1/admissions/merit-lists
GET /api/v1/admissions/merit-lists/:id
GET /api/v1/admissions/seats
POST /api/v1/admissions/seats
GET /api/v1/admissions/criteria
POST /api/v1/admissions/criteria
```

**Description**: Complete admission management with entrance tests and merit list generation.

**Create Application Request**:
```json
{
  "studentName": "John Doe",
  "dateOfBirth": "2010-05-15",
  "gender": "Male",
  "email": "john.doe@email.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "previousSchool": "ABC School",
  "classAppliedFor": "6",
  "guardianName": "Jane Doe",
  "guardianPhone": "+1234567890",
  "guardianEmail": "jane.doe@email.com"
}
```

**Create Entrance Test Request**:
```json
{
  "title": "Class 6 Entrance Test 2026",
  "description": "Mathematics and English assessment",
  "classLevel": "6",
  "date": "2026-03-20T09:00:00Z",
  "duration": 120,
  "totalMarks": 100,
  "passingMarks": 40,
  "subjects": [
    {
      "name": "Mathematics",
      "marks": 50
    },
    {
      "name": "English",
      "marks": 50
    }
  ]
}
```

**Generate Merit List Request**:
```json
{
  "entranceTestId": "test_123",
  "classLevel": "6",
  "totalSeats": 50,
  "criteria": {
    "minimumPercentage": 40,
    "weightage": {
      "entranceTest": 70,
      "previousAcademics": 30
    }
  }
}
```

**Merit List Response**:
```json
{
  "success": true,
  "data": {
    "_id": "merit_123",
    "entranceTestId": "test_123",
    "classLevel": "6",
    "totalSeats": 50,
    "generatedAt": "2026-03-21T10:00:00Z",
    "students": [
      {
        "rank": 1,
        "applicationId": "app_123",
        "studentName": "John Doe",
        "totalScore": 95.5,
        "entranceTestScore": 95,
        "previousAcademicScore": 97,
        "status": "selected"
      }
    ],
    "statistics": {
      "totalApplicants": 120,
      "selected": 50,
      "waitlisted": 20,
      "rejected": 50
    }
  }
}
```

**Permissions**: Super Admin, School Admin, Principal

---

### Enhanced Fee & Payment Endpoints ✅
```http
POST /api/v1/fees/invoices
GET /api/v1/fees/invoices
GET /api/v1/fees/invoices/:id
PUT /api/v1/fees/invoices/:id
DELETE /api/v1/fees/invoices/:id
POST /api/v1/fees/invoices/:id/pay
POST /api/v1/fees/payments/verify
GET /api/v1/fees/payments/:id/receipt
```

**Description**: Invoice-based fee management with Razorpay payment gateway integration.

**Initiate Payment Response**:
```json
{
  "success": true,
  "data": {
    "payment_id": "pay_123",
    "order_id": "order_456",
    "payment_url": "https://razorpay.com/pay/order_456",
    "expires_at": "2024-01-01T12:30:00Z"
  }
}
```

### Report Endpoints ✅
```http
GET /api/v1/reports/student/:student_id
GET /api/v1/reports/attendance
GET /api/v1/reports/fees
```

**Description**: Comprehensive reporting system for students, attendance, and fees.

**Student Report Response**:
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "student_123",
      "name": "Alice Johnson",
      "class": "10-A",
      "roll_number": "A001"
    },
    "academic_summary": {
      "attendance_percentage": 95.5,
      "total_homework": 45,
      "submitted_homework": 43,
      "average_marks": 85.2
    },
    "subjects": [...]
  }
}
```

## Implementation Status Summary

### ✅ Fully Implemented (300+ endpoints)
- Authentication & Authorization (JWT, 2FA, OAuth, Biometric)
- User Management (Students, Teachers, Parents, Staff)
- Role-Based Access Control (RBAC)
- Attendance Tracking (Basic & Advanced)
- Notes & Homework Management
- Fees & Invoicing (Multiple Payment Gateways)
- Payment Gateway Integration (Stripe, PayU, Razorpay)
- Installment & Scholarship Management
- Fee Reminders (Email/SMS)
- PTM Management (Video Meetings, Automated Reminders)
- Admissions Management (Entrance Tests, Merit Lists)
- Online Examination System (Proctoring, Plagiarism Detection)
- Question Bank Management
- Video Conferencing (Jitsi, Zoom)
- Group Chat & File Sharing
- Dashboard (All Roles, Customizable Widgets)
- Real-time Dashboard Updates (WebSocket)
- Theme & Preferences
- Tenant Management
- Reports & Analytics
- Library Management
- Transport Management (GPS Tracking, Route Optimization, Fuel Management)
- ID Card Generation & Verification
- Notifications (Email, SMS, Push)
- File Management
- Support Tickets

### Key Features
- ✅ JWT Authentication with refresh tokens
- ✅ Two-Factor Authentication (TOTP, SMS, Email)
- ✅ OAuth Integration (Google, Microsoft)
- ✅ Biometric Authentication (WebAuthn)
- ✅ Multi-tenant architecture
- ✅ Role-based permissions (RBAC)
- ✅ Payment gateway integration (Stripe, PayU, Razorpay)
- ✅ Real-time notifications (WebSocket)
- ✅ GPS tracking & route optimization
- ✅ AI-powered proctoring
- ✅ Plagiarism detection
- ✅ Video conferencing integration
- ✅ Customizable dashboard widgets
- ✅ Comprehensive error handling
- ✅ Input validation & sanitization
- ✅ Rate limiting
- ✅ Pagination support
- ✅ File upload/download
- ✅ Multi-language support
- ✅ Theme customization
- ✅ Accessibility features

## Quick Start

### 1. Authentication
```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get current user
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Get Dashboard
```bash
curl -X GET http://localhost:5000/api/v1/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Mark Attendance
```bash
curl -X POST http://localhost:5000/api/v1/attendance/mark \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-01",
    "class_id": "class_123",
    "records": [
      {"student_id": "student_123", "status": "present"}
    ]
  }'
```

### 4. Create Invoice & Process Payment
```bash
# Create invoice
curl -X POST http://localhost:5000/api/v1/fees/invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "student_123",
    "items": [
      {"description": "Tuition Fee", "amount": 5000, "tax": 900}
    ],
    "due_date": "2024-01-31"
  }'

# Initiate payment
curl -X POST http://localhost:5000/api/v1/fees/invoices/invoice_123/pay \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "upi",
    "amount": 5900
  }'
```

## Environment Setup

Required environment variables:
```env
# Server
PORT=5000
NODE_ENV=development
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/edumanage

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Related Documentation
- **Frontend Integration**: See `FRONTEND_INTEGRATION_GUIDE.md`
- **Backend Setup**: See `backend/SETUP_GUIDE.md`
- **Implementation Summary**: See `API_IMPLEMENTATION_SUMMARY.md`
- **UI/UX Guidelines**: See `UI_UX_GUIDELINES.md`
- **Architecture**: See `ARCHITECTURE_OVERVIEW.md`
- **Troubleshooting**: See `TROUBLESHOOTING_GUIDE.md`

## Support
- **API Support**: api-support@edumanage.pro
- **Developer Forum**: https://forum.edumanage.pro
- **Status Page**: https://status.edumanage.pro


---

## Library Management

### Book Management

#### List Books
```http
GET /library/books?page=1&limit=20&search=physics&category=Science&status=Active
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by title, author, or ISBN
- `category` (optional): Filter by category
- `status` (optional): Filter by status (Active, Inactive, Damaged, Lost)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "book_123",
      "isbn": "978-3-16-148410-0",
      "title": "Physics Fundamentals",
      "author": "John Doe",
      "publisher": "Education Press",
      "publishedYear": 2023,
      "category": "Science",
      "language": "English",
      "totalCopies": 5,
      "availableCopies": 3,
      "location": {
        "shelf": "A1",
        "rack": "R2",
        "floor": "Ground"
      },
      "price": 500,
      "status": "Active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### Add Book
```http
POST /library/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "isbn": "978-3-16-148410-0",
  "title": "Physics Fundamentals",
  "author": "John Doe",
  "publisher": "Education Press",
  "publishedYear": 2023,
  "category": "Science",
  "language": "English",
  "totalCopies": 5,
  "location": {
    "shelf": "A1",
    "rack": "R2",
    "floor": "Ground"
  },
  "price": 500,
  "description": "Comprehensive physics textbook"
}
```

**Permissions**: Librarian, School Admin, Super Admin

#### Get Book Details
```http
GET /library/books/:id
```

#### Update Book
```http
PUT /library/books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "totalCopies": 7,
  "price": 550,
  "status": "Active"
}
```

**Permissions**: Librarian, School Admin, Super Admin

#### Delete Book
```http
DELETE /library/books/:id
Authorization: Bearer <token>
```

**Permissions**: Librarian, School Admin, Super Admin

**Note**: Cannot delete books with active issues.

---

### Issue Management

#### Issue Book
```http
POST /library/issues
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "book_123",
  "userId": "user_456",
  "userType": "Student",
  "daysAllowed": 14
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "issue_789",
    "book": {
      "_id": "book_123",
      "title": "Physics Fundamentals",
      "author": "John Doe"
    },
    "user": {
      "_id": "user_456",
      "name": "Jane Smith"
    },
    "issueDate": "2024-01-01T10:00:00Z",
    "dueDate": "2024-01-15T10:00:00Z",
    "status": "Issued"
  }
}
```

**Permissions**: Librarian, School Admin, Super Admin

#### Return Book
```http
PUT /library/issues/:id/return
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "issue_789",
    "returnDate": "2024-01-14T15:30:00Z",
    "status": "Returned",
    "fine": 0,
    "fineStatus": "None"
  }
}
```

**Note**: Fine is automatically calculated if book is returned after due date.

**Permissions**: Librarian, School Admin, Super Admin

#### Get Issue History
```http
GET /library/issues?page=1&limit=20&userId=user_456&status=Issued
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `userId` (optional): Filter by user
- `status` (optional): Filter by status (Issued, Returned, Overdue, Lost)

#### Get Overdue Books
```http
GET /library/issues/overdue
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "issue_789",
      "book": {
        "title": "Physics Fundamentals"
      },
      "user": {
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "dueDate": "2024-01-15T10:00:00Z",
      "fine": 50,
      "daysOverdue": 10
    }
  ]
}
```

**Permissions**: Librarian, School Admin, Super Admin

#### Pay Fine
```http
PUT /library/issues/:id/pay-fine
Authorization: Bearer <token>
```

---

### Reservation Management

#### Reserve Book
```http
POST /library/reservations/:bookId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "reservation_123",
    "book": {
      "_id": "book_123",
      "title": "Physics Fundamentals"
    },
    "user": {
      "_id": "user_456",
      "name": "Jane Smith"
    },
    "reservationDate": "2024-01-01T10:00:00Z",
    "expiryDate": "2024-01-08T10:00:00Z",
    "status": "Active"
  }
}
```

#### Cancel Reservation
```http
DELETE /library/reservations/:id
Authorization: Bearer <token>
```

---

### Library Statistics

#### Get Statistics
```http
GET /library/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBooks": 1500,
    "availableBooks": 1200,
    "issuedBooks": 250,
    "overdueBooks": 15,
    "totalReservations": 30
  }
}
```

**Permissions**: Librarian, School Admin, Super Admin

---

## Communication Services

### SMS Notifications

The system includes SMS notification capabilities via Twilio integration:

**Features:**
- Attendance alerts to parents
- Fee payment reminders
- Exam notifications
- Homework notifications
- Emergency alerts
- OTP sending for verification

**Configuration:**
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Push Notifications

Firebase Cloud Messaging integration for mobile app notifications:

**Features:**
- Device-specific notifications
- Topic-based broadcasting
- Multicast messaging
- Predefined templates
- Emergency alerts

**Configuration:**
```env
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/serviceAccount.json
```

---

## Data Export

### Export Data
```http
POST /exports
Authorization: Bearer <token>
Content-Type: application/json

{
  "requestedData": ["personal", "academic", "financial"],
  "format": "xlsx",
  "filters": {
    "academicYear": "2023-24",
    "classId": "class_123"
  }
}
```

**Supported Formats:**
- `csv` - Comma-separated values
- `xlsx` - Excel spreadsheet
- `pdf` - PDF document
- `json` - JSON format

**Data Types:**
- `personal` - Student personal information
- `academic` - Academic records and results
- `financial` - Fee and payment records
- `attendance` - Attendance records
- `communication` - Notifications and messages
- `all` - All available data

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "export_123",
    "status": "processing",
    "format": "xlsx",
    "requestedData": ["personal", "academic"],
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

**Note**: Export is processed asynchronously. Check status or wait for notification when complete.

---

## Implementation Status

### Completed Endpoints: 162+

| Category | Endpoints | Status |
|----------|-----------|--------|
| Authentication | 9 | ✅ |
| Students | 10+ | ✅ |
| Teachers | 10+ | ✅ |
| Parents | 8+ | ✅ |
| Attendance | 8 | ✅ |
| Advanced Attendance | 15+ | ✅ |
| Fees & Payments | 12 | ✅ |
| Homework | 10 | ✅ |
| Exams & Grades | 10 | ✅ |
| Online Exams | 15+ | ✅ |
| Dashboard | 6 | ✅ |
| Real-time Dashboard | 6 | ✅ |
| Theme | 5 | ✅ |
| Tenants | 6 | ✅ |
| PTM | 6 | ✅ |
| Admissions | 8 | ✅ |
| Reports | 6 | ✅ |
| Library | 13 | ✅ |
| Transport | 25+ | ✅ |
| ID Cards | 6 | ✅ |
| Notifications | 8+ | ✅ |
| Settings | 12+ | ✅ |

### Total: 162+ Endpoints Operational

---

## Rate Limiting

All API endpoints are rate-limited to prevent abuse:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **File Upload**: 20 requests per 15 minutes

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640908800
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Support

For API support and questions:
- **Documentation**: This file
- **Backend Status**: `/docs/BACKEND_STATUS.md`
- **Setup Guide**: `/backend/SETUP_GUIDE.md`
- **Integration Guide**: `/docs/FRONTEND_INTEGRATION_GUIDE.md`

---

**Last Updated**: December 2024  
**Version**: 1.0.0


---

## Online Examination System

### Exam Management (Teachers/Admins)

#### Create Online Exam
```http
POST /online-exams
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mathematics Mid-Term Exam",
  "description": "Mid-term examination for Grade 10",
  "subject": "subject_id",
  "class": "class_id",
  "section": "section_id",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What is 2 + 2?",
      "options": [
        { "text": "3", "isCorrect": false },
        { "text": "4", "isCorrect": true },
        { "text": "5", "isCorrect": false }
      ],
      "points": 1,
      "difficulty": "easy"
    },
    {
      "type": "short-answer",
      "question": "Explain Pythagoras theorem",
      "points": 5,
      "difficulty": "medium"
    }
  ],
  "duration": 60,
  "passingMarks": 40,
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T12:00:00Z",
  "settings": {
    "shuffleQuestions": true,
    "shuffleOptions": true,
    "showResultsImmediately": false,
    "preventCopyPaste": true,
    "detectTabSwitch": true,
    "maxTabSwitches": 3,
    "autoSubmitOnTimeEnd": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Exam created successfully",
  "data": {
    "_id": "exam_123",
    "title": "Mathematics Mid-Term Exam",
    "totalMarks": 6,
    "status": "draft"
  }
}
```

#### List Exams
```http
GET /online-exams?classId=class_123&status=published&page=1&limit=20
```

#### Get Exam Details
```http
GET /online-exams/:id
```

#### Update Exam
```http
PUT /online-exams/:id
```

#### Delete Exam
```http
DELETE /online-exams/:id
```

#### Publish Exam
```http
POST /online-exams/:id/publish
```

---

### Student Exam Taking

#### Start Exam
```http
POST /online-exams/:id/start
Authorization: Bearer <student_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission": "submission_123",
    "exam": {
      "_id": "exam_123",
      "title": "Mathematics Mid-Term Exam",
      "duration": 60,
      "totalMarks": 100,
      "questions": [
        {
          "_id": "q1",
          "type": "multiple-choice",
          "question": "What is 2 + 2?",
          "options": [
            { "text": "3" },
            { "text": "4" },
            { "text": "5" }
          ],
          "points": 1
        }
      ]
    },
    "startedAt": "2024-01-15T10:05:00Z",
    "timeRemaining": 3600
  }
}
```

**Note**: Correct answers are not included in the response.

#### Save Answer
```http
POST /online-exams/submissions/:submissionId/answer
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "questionId": "q1",
  "answer": "4",
  "timeTaken": 15
}
```

#### Submit Exam
```http
POST /online-exams/submissions/:submissionId/submit
Authorization: Bearer <student_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Exam submitted successfully",
  "data": {
    "_id": "submission_123",
    "score": 85,
    "percentage": 85,
    "status": "graded",
    "autoGraded": true,
    "submittedAt": "2024-01-15T11:30:00Z"
  }
}
```

#### Record Tab Switch (Proctoring)
```http
POST /online-exams/submissions/:submissionId/tab-switch
Authorization: Bearer <student_token>
```

---

### Grading (Teachers/Admins)

#### Get Exam Submissions
```http
GET /online-exams/:examId/submissions
Authorization: Bearer <teacher_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "submission_123",
      "student": {
        "_id": "student_456",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "score": 85,
      "percentage": 85,
      "status": "graded",
      "submittedAt": "2024-01-15T11:30:00Z",
      "timeTaken": 3000
    }
  ]
}
```

#### Get Submission Details
```http
GET /online-exams/submissions/:submissionId
```

#### Manual Grade Question
```http
POST /online-exams/submissions/:submissionId/grade
Authorization: Bearer <teacher_token>
Content-Type: application/json

{
  "questionId": "q2",
  "score": 4,
  "feedback": "Good explanation, but missing one key point"
}
```

---

### Plagiarism Detection

#### Check Single Submission
```http
POST /online-exams/submissions/:submissionId/plagiarism
Authorization: Bearer <teacher_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "checked": true,
    "score": 35.5,
    "matches": [
      {
        "studentId": "student_789",
        "similarity": 78.5,
        "matchedText": "the quick brown fox jumps over..."
      }
    ],
    "checkedAt": "2024-01-15T12:00:00Z"
  }
}
```

**Plagiarism Score Interpretation**:
- 0-30%: Low similarity (acceptable)
- 31-60%: Medium similarity (review recommended)
- 61-100%: High similarity (likely plagiarism)

#### Bulk Plagiarism Check
```http
POST /online-exams/:examId/plagiarism/bulk
Authorization: Bearer <teacher_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "submissionId": "sub_123",
      "studentId": "student_456",
      "plagiarismScore": 35.5,
      "matches": 2
    },
    {
      "submissionId": "sub_124",
      "studentId": "student_457",
      "plagiarismScore": 15.2,
      "matches": 0
    }
  ]
}
```

---

### Statistics & Results

#### Get Exam Statistics
```http
GET /online-exams/:id/statistics
Authorization: Bearer <teacher_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 50,
    "submitted": 48,
    "graded": 45,
    "pending": 5,
    "averageScore": 75.5,
    "highestScore": 98,
    "lowestScore": 45,
    "passRate": 90
  }
}
```

#### Get Student Results
```http
GET /online-exams/student/results
Authorization: Bearer <student_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "submission_123",
      "exam": {
        "_id": "exam_123",
        "title": "Mathematics Mid-Term Exam",
        "totalMarks": 100
      },
      "score": 85,
      "percentage": 85,
      "grade": "A",
      "submittedAt": "2024-01-15T11:30:00Z"
    }
  ]
}
```

---

## Online Exam Features

### Question Types Supported
1. **Multiple Choice**: Single correct answer from options
2. **True/False**: Boolean questions
3. **Short Answer**: Brief text responses
4. **Essay**: Long-form text responses
5. **Fill in the Blank**: Complete the sentence
6. **Matching**: Match items from two lists

### Automated Grading
- **Objective Questions**: Automatically graded (MCQ, True/False)
- **Subjective Questions**: Require manual grading (Short Answer, Essay)
- **Partial Grading**: Teachers can award partial marks
- **Instant Results**: For fully objective exams

### Proctoring Features
- **Tab Switch Detection**: Monitors when students leave exam tab
- **Violation Tracking**: Records all suspicious activities
- **Webcam Requirement**: Optional webcam monitoring
- **Copy-Paste Prevention**: Blocks copy-paste operations
- **Auto-Submit**: Automatically submits when time expires

### Plagiarism Detection Algorithms
1. **Jaccard Similarity**: Measures word overlap
2. **Cosine Similarity**: Measures vector angle
3. **Levenshtein Distance**: Measures edit distance
4. **Structural Analysis**: Compares answer structure

### Security Features
- Time-bound access control
- One-time submission enforcement
- Answer encryption in transit
- Audit trail for all actions
- Violation reporting

---

**Last Updated**: December 2024  
**Total Online Exam Endpoints**: 15+


---

## Transport Management

### Vehicle Management

#### Create Vehicle
```http
POST /transport/vehicles
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicleNumber": "DL01AB1234",
  "vehicleType": "Bus",
  "capacity": 50,
  "manufacturer": "Tata Motors",
  "model": "Starbus",
  "year": 2023,
  "registrationDate": "2023-01-15",
  "insuranceDetails": {
    "policyNumber": "INS123456",
    "provider": "HDFC ERGO",
    "expiryDate": "2024-12-31",
    "amount": 50000
  },
  "fitnessDetails": {
    "certificateNumber": "FIT789",
    "expiryDate": "2024-06-30"
  },
  "pollutionDetails": {
    "certificateNumber": "POL456",
    "expiryDate": "2024-03-31"
  },
  "driver": "driver_id",
  "gpsEnabled": true,
  "gpsDeviceId": "GPS123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "data": {
    "_id": "vehicle_id",
    "vehicleNumber": "DL01AB1234",
    "vehicleType": "Bus",
    "capacity": 50,
    "status": "Active",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

**Permissions**: Super Admin, School Admin, Transport Manager

#### Get All Vehicles
```http
GET /transport/vehicles?page=1&limit=10&status=Active&vehicleType=Bus
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "vehicle_id",
      "vehicleNumber": "DL01AB1234",
      "vehicleType": "Bus",
      "capacity": 50,
      "status": "Active",
      "driver": {
        "_id": "driver_id",
        "name": "John Doe"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

#### Get Vehicle by ID
```http
GET /transport/vehicles/:id
Authorization: Bearer <token>
```

#### Update Vehicle
```http
PUT /transport/vehicles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Maintenance",
  "driver": "new_driver_id"
}
```

#### Delete Vehicle
```http
DELETE /transport/vehicles/:id
Authorization: Bearer <token>
```

**Note**: Cannot delete vehicles assigned to active routes.

---

### Route Management

#### Create Route
```http
POST /transport/routes
Authorization: Bearer <token>
Content-Type: application/json

{
  "routeName": "North Campus Route",
  "routeNumber": "R001",
  "vehicle": "vehicle_id",
  "driver": "driver_id",
  "stops": [
    {
      "stopName": "Main Gate",
      "location": {
        "latitude": 28.7041,
        "longitude": 77.1025
      },
      "arrivalTime": "07:00",
      "departureTime": "07:05",
      "sequence": 1
    },
    {
      "stopName": "Market Square",
      "location": {
        "latitude": 28.7141,
        "longitude": 77.1125
      },
      "arrivalTime": "07:15",
      "departureTime": "07:20",
      "sequence": 2
    }
  ],
  "startTime": "06:30",
  "endTime": "08:30",
  "distance": 25,
  "fare": 1500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Route created successfully",
  "data": {
    "_id": "route_id",
    "routeName": "North Campus Route",
    "routeNumber": "R001",
    "status": "Active",
    "stops": [...]
  }
}
```

**Permissions**: Super Admin, School Admin, Transport Manager

#### Get All Routes
```http
GET /transport/routes?page=1&limit=10&status=Active
Authorization: Bearer <token>
```

#### Get Route by ID
```http
GET /transport/routes/:id
Authorization: Bearer <token>
```

#### Update Route
```http
PUT /transport/routes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Inactive",
  "fare": 1800
}
```

#### Delete Route
```http
DELETE /transport/routes/:id
Authorization: Bearer <token>
```

**Note**: Cannot delete routes with active student assignments.

---

### Student Transport Assignment

#### Assign Student to Route
```http
POST /transport/assignments
Authorization: Bearer <token>
Content-Type: application/json

{
  "student": "student_id",
  "route": "route_id",
  "pickupStop": "Main Gate",
  "dropStop": "School Campus",
  "fare": 1500,
  "startDate": "2024-01-01",
  "emergencyContact": {
    "name": "Parent Name",
    "phone": "+919876543210",
    "relation": "Father"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student assigned to route successfully",
  "data": {
    "_id": "assignment_id",
    "student": {...},
    "route": {...},
    "status": "Active"
  }
}
```

**Permissions**: Super Admin, School Admin, Transport Manager

**Validation**:
- Checks route capacity before assignment
- Prevents duplicate active assignments for same student

#### Get Student Transports
```http
GET /transport/assignments?page=1&limit=10&status=Active&routeId=route_id&studentId=student_id
Authorization: Bearer <token>
```

#### Update Student Transport
```http
PUT /transport/assignments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Inactive",
  "endDate": "2024-12-31"
}
```

#### Delete Student Transport
```http
DELETE /transport/assignments/:id
Authorization: Bearer <token>
```

---

### Trip Management

#### Create Trip
```http
POST /transport/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "route": "route_id",
  "vehicle": "vehicle_id",
  "driver": "driver_id",
  "date": "2024-01-15",
  "tripType": "Pickup"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trip created successfully",
  "data": {
    "_id": "trip_id",
    "route": {...},
    "status": "Scheduled",
    "tripType": "Pickup"
  }
}
```

**Permissions**: Super Admin, School Admin, Transport Manager, Driver

#### Start Trip
```http
PUT /transport/trips/:id/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "startOdometer": 12500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trip started successfully",
  "data": {
    "_id": "trip_id",
    "status": "InProgress",
    "startTime": "2024-01-15T07:00:00Z",
    "startOdometer": 12500
  }
}
```

#### Mark Attendance
```http
PUT /transport/trips/:id/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "student": "student_id",
  "stop": "Main Gate",
  "status": "Boarded"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "_id": "trip_id",
    "attendance": [
      {
        "student": "student_id",
        "stop": "Main Gate",
        "status": "Boarded",
        "boardingTime": "2024-01-15T07:05:00Z"
      }
    ]
  }
}
```

**Attendance Status Options**: Boarded, Absent, Left

#### Complete Trip
```http
PUT /transport/trips/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "endOdometer": 12550,
  "fuelUsed": 15,
  "remarks": "Trip completed successfully"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trip completed successfully",
  "data": {
    "_id": "trip_id",
    "status": "Completed",
    "endTime": "2024-01-15T08:30:00Z",
    "endOdometer": 12550,
    "fuelUsed": 15
  }
}
```

#### Get Trips
```http
GET /transport/trips?page=1&limit=10&status=InProgress&routeId=route_id&date=2024-01-15&tripType=Pickup
Authorization: Bearer <token>
```

---

### Vehicle Maintenance

#### Schedule Maintenance
```http
POST /transport/maintenance
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicle": "vehicle_id",
  "maintenanceType": "Routine",
  "description": "Regular service and oil change",
  "scheduledDate": "2024-02-01",
  "cost": 5000,
  "serviceProvider": "ABC Motors",
  "nextServiceDate": "2024-05-01"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Maintenance scheduled successfully",
  "data": {
    "_id": "maintenance_id",
    "vehicle": {...},
    "maintenanceType": "Routine",
    "status": "Scheduled"
  }
}
```

**Maintenance Types**: Routine, Repair, Inspection, Emergency

**Permissions**: Super Admin, School Admin, Transport Manager

#### Update Maintenance
```http
PUT /transport/maintenance/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Completed",
  "completedDate": "2024-02-01",
  "cost": 5500
}
```

#### Get Maintenance Records
```http
GET /transport/maintenance?page=1&limit=10&status=Scheduled&vehicleId=vehicle_id&maintenanceType=Routine
Authorization: Bearer <token>
```

#### Delete Maintenance
```http
DELETE /transport/maintenance/:id
Authorization: Bearer <token>
```

---

### GPS Tracking & Live Location ✅

#### Update Vehicle Location
```http
PUT /transport/vehicles/:id/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "speed": 45,
  "heading": 180,
  "timestamp": "2026-02-26T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle location updated successfully",
  "data": {
    "_id": "vehicle_123",
    "vehicleNumber": "BUS-001",
    "currentLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "speed": 45,
      "heading": 180,
      "lastUpdated": "2026-02-26T10:30:00Z"
    }
  }
}
```

**Permissions**: Super Admin, School Admin, Transport Manager, Driver

#### Get Vehicle Location
```http
GET /transport/vehicles/:id/location
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle location fetched successfully",
  "data": {
    "vehicleNumber": "BUS-001",
    "currentLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "speed": 45,
      "heading": 180,
      "lastUpdated": "2026-02-26T10:30:00Z"
    },
    "driver": {
      "firstName": "John",
      "lastName": "Driver",
      "phone": "+1234567890"
    }
  }
}
```

**Permissions**: All authenticated users

#### Track Route
```http
GET /transport/routes/:id/track
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Route tracking data fetched successfully",
  "data": {
    "route": {
      "_id": "route_123",
      "routeName": "Route A - Morning",
      "vehicle": {
        "vehicleNumber": "BUS-001"
      }
    },
    "currentLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "speed": 45,
      "lastUpdated": "2026-02-26T10:30:00Z"
    },
    "stops": [
      {
        "stopName": "Main Street",
        "latitude": 40.7150,
        "longitude": -74.0070,
        "arrivalTime": "08:00"
      }
    ],
    "estimatedArrival": {
      "stopName": "Main Street",
      "distance": "2.50",
      "estimatedMinutes": 5,
      "estimatedTime": "2026-02-26T10:35:00Z"
    }
  }
}
```

**Permissions**: All authenticated users

#### Get Parent Tracking Info
```http
GET /transport/tracking/parent/:studentId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Parent tracking info fetched successfully",
  "data": {
    "student": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "route": {
      "name": "Route A - Morning",
      "vehicleNumber": "BUS-001",
      "driver": {
        "name": "John Driver",
        "phone": "+1234567890"
      }
    },
    "currentLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "speed": 45,
      "lastUpdated": "2026-02-26T10:30:00Z"
    },
    "studentStop": {
      "stopName": "Main Street",
      "latitude": 40.7150,
      "longitude": -74.0070
    },
    "estimatedArrival": {
      "stopName": "Main Street",
      "distance": "2.50",
      "estimatedMinutes": 5,
      "estimatedTime": "2026-02-26T10:35:00Z"
    }
  }
}
```

**Permissions**: Parent, Guardian, Super Admin, School Admin

---

### Route Optimization ✅

#### Optimize Route
```http
GET /transport/routes/:id/optimize
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Route optimization completed successfully",
  "data": {
    "originalStops": [
      {
        "stopName": "Stop A",
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    ],
    "optimizedStops": [
      {
        "stopName": "Stop B",
        "latitude": 40.7150,
        "longitude": -74.0070
      }
    ],
    "totalDistance": "25.50",
    "estimatedTime": 51,
    "savings": {
      "distance": 0,
      "time": 0
    }
  }
}
```

**Description**: Uses nearest neighbor algorithm to optimize route stops for minimum distance.

**Permissions**: Super Admin, School Admin, Transport Manager

#### Apply Optimized Route
```http
PUT /transport/routes/:id/apply-optimization
Authorization: Bearer <token>
Content-Type: application/json

{
  "optimizedStops": [
    {
      "stopName": "Stop B",
      "latitude": 40.7150,
      "longitude": -74.0070,
      "arrivalTime": "08:00",
      "departureTime": "08:05"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Optimized route applied successfully",
  "data": {
    "_id": "route_123",
    "routeName": "Route A - Morning",
    "stops": [...]
  }
}
```

**Permissions**: Super Admin, School Admin, Transport Manager

---

### Fuel Management ✅

#### Record Fuel Entry
```http
POST /transport/fuel
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicleId": "vehicle_123",
  "date": "2026-02-26",
  "quantity": 50,
  "cost": 4500,
  "odometerReading": 15000,
  "fuelType": "Diesel",
  "station": "Shell Gas Station"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Fuel entry recorded successfully",
  "data": {
    "date": "2026-02-26T00:00:00Z",
    "quantity": 50,
    "cost": 4500,
    "odometerReading": 15000,
    "fuelType": "Diesel",
    "station": "Shell Gas Station",
    "pricePerLiter": 90
  }
}
```

**Permissions**: Super Admin, School Admin, Transport Manager, Driver

#### Get Fuel History
```http
GET /transport/fuel/vehicle/:vehicleId?page=1&limit=20&startDate=2026-01-01&endDate=2026-02-26
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Fuel history fetched successfully",
  "data": [
    {
      "date": "2026-02-26T00:00:00Z",
      "quantity": 50,
      "cost": 4500,
      "odometerReading": 15000,
      "fuelType": "Diesel",
      "station": "Shell Gas Station",
      "pricePerLiter": 90
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 3
  }
}
```

**Permissions**: Super Admin, School Admin, Transport Manager

#### Get Fuel Analytics
```http
GET /transport/fuel/vehicle/:vehicleId/analytics?period=month
Authorization: Bearer <token>
```

**Query Parameters**:
- `period`: week, month, year, all

**Response:**
```json
{
  "success": true,
  "message": "Fuel analytics fetched successfully",
  "data": {
    "vehicle": {
      "id": "vehicle_123",
      "vehicleNumber": "BUS-001",
      "vehicleType": "Bus"
    },
    "period": "month",
    "analytics": {
      "totalEntries": 8,
      "totalQuantity": "400.00",
      "totalCost": "36000.00",
      "avgPricePerLiter": "90.00",
      "mileage": "12.50",
      "avgCostPerEntry": "4500.00"
    }
  }
}
```

**Description**: Provides comprehensive fuel consumption analytics including mileage calculation.

**Permissions**: Super Admin, School Admin, Transport Manager

#### Get Fuel Summary
```http
GET /transport/fuel/summary?startDate=2026-01-01&endDate=2026-02-26
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Fuel summary fetched successfully",
  "data": {
    "totalVehicles": 25,
    "vehiclesWithFuelData": 20,
    "totalFuelConsumed": "8000.00",
    "totalFuelCost": "720000.00",
    "avgCostPerVehicle": "36000.00",
    "avgFuelPerVehicle": "400.00"
  }
}
```

**Permissions**: Super Admin, School Admin, Transport Manager

---

### Statistics & Reports

#### Get Transport Statistics
```http
GET /transport/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Transport statistics fetched successfully",
  "data": {
    "vehicles": {
      "total": 25,
      "active": 20,
      "inactive": 5
    },
    "routes": {
      "total": 15,
      "active": 12,
      "inactive": 3
    },
    "students": {
      "total": 500,
      "active": 480,
      "inactive": 20
    },
    "trips": {
      "today": 30
    },
    "maintenance": {
      "pending": 5
    }
  }
}
```

**Permissions**: Super Admin, School Admin, Transport Manager

#### Get Vehicle Utilization
```http
GET /transport/utilization?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle utilization fetched successfully",
  "data": [
    {
      "vehicle": {
        "_id": "vehicle_id",
        "vehicleNumber": "DL01AB1234"
      },
      "totalTrips": 60,
      "totalDistance": 1500,
      "totalFuel": 450
    }
  ]
}
```

**Permissions**: Super Admin, School Admin, Transport Manager

---

## Transport Management Features

**Vehicle Management**:
- Complete fleet tracking
- Insurance and fitness certificate management
- GPS device integration support
- Driver assignment
- Status tracking (Active, Inactive, Maintenance, Retired)

**Route Management**:
- Multiple stops with GPS coordinates
- Arrival and departure times
- Distance and fare tracking
- Capacity management
- Driver and vehicle assignment

**Trip Management**:
- Real-time trip tracking
- Trip status (Scheduled, InProgress, Completed, Cancelled)
- Student attendance marking
- Odometer and fuel tracking
- Trip type (Pickup, Drop)

**Maintenance Management**:
- Scheduled maintenance tracking
- Maintenance types (Routine, Repair, Inspection, Emergency)
- Cost tracking
- Service provider management
- Next service date reminders

**GPS Tracking** ✅:
- Real-time vehicle location updates
- Location history tracking
- Route tracking with ETA calculation
- Parent live tracking for students
- Speed and heading monitoring

**Route Optimization** ✅:
- AI-based route optimization
- Nearest neighbor algorithm
- Distance and time calculation
- Apply optimized routes
- Savings analysis

**Fuel Management** ✅:
- Fuel entry recording
- Fuel history tracking
- Fuel analytics (weekly, monthly, yearly)
- Fuel consumption reports
- Cost per vehicle analysis
- Mileage calculation

**Analytics**:
- Comprehensive statistics
- Vehicle utilization reports
- Trip history
- Maintenance history
- Fuel consumption analytics

---

**Last Updated**: February 2026  
**Total Transport Endpoints**: 39+

**New Endpoints**:
```http
# GPS Tracking
PUT /transport/vehicles/:id/location
GET /transport/vehicles/:id/location
GET /transport/routes/:id/track
GET /transport/tracking/parent/:studentId

# Route Optimization
GET /transport/routes/:id/optimize
PUT /transport/routes/:id/apply-optimization

# Fuel Management
POST /transport/fuel
GET /transport/fuel/vehicle/:vehicleId
GET /transport/fuel/vehicle/:vehicleId/analytics?period=month
GET /transport/fuel/summary
```

---

## ID Card Management

### Generate Student ID Card
```http
GET /id-cards/student/:studentId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "student_id",
      "admissionNumber": "2024001",
      "fullName": "John Doe",
      "class": "10",
      "section": "A",
      "photo": "photo_url"
    },
    "institution": {
      "name": "ABC School",
      "logo": "logo_url",
      "address": "123 Main St"
    },
    "qrCode": "data:image/png;base64,...",
    "barcode": "2024001",
    "cardNumber": "ID-2024001",
    "issueDate": "2024-01-15T10:00:00Z",
    "validUntil": "2025-01-15T10:00:00Z"
  }
}
```

**Permissions**: Super Admin, School Admin, Principal, Teacher

### Generate My ID Card
```http
GET /id-cards/me
Authorization: Bearer <token>
```

**Response:** Same as above (based on user role)

**Permissions**: All authenticated users

### Verify ID Card
```http
POST /id-cards/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "qrData": "{\"id\":\"user_id\",\"name\":\"John Doe\",...}"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "reason": "ID card is valid",
    "data": {
      "id": "user_id",
      "name": "John Doe",
      "role": "student",
      "institution": "ABC School",
      "photo": "photo_url",
      "validUntil": "2025-01-15T10:00:00Z"
    }
  }
}
```

**Permissions**: All authenticated users

### Generate Bulk ID Cards
```http
POST /id-cards/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "userIds": ["user_id_1", "user_id_2", "user_id_3"],
  "userType": "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 ID cards generated successfully",
  "data": [
    {
      "student": {...},
      "qrCode": "...",
      "barcode": "..."
    }
  ]
}
```

**Permissions**: Super Admin, School Admin

### Get ID Card Template
```http
GET /id-cards/template
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "layout": "standard",
    "orientation": "portrait",
    "size": "cr80",
    "colors": {
      "primary": "#3b82f6",
      "secondary": "#64748b"
    },
    "fields": {
      "showPhoto": true,
      "showQRCode": true,
      "showBarcode": true
    }
  }
}
```

**Permissions**: Super Admin, School Admin

---

## Real-time Dashboard

### Refresh User Dashboard
```http
POST /realtime/dashboard/refresh
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard refreshed successfully",
  "data": {
    "statistics": {...},
    "recentActivities": [...],
    "notifications": [...]
  }
}
```

**Note**: Also broadcasts real-time update via WebSocket to user

**Permissions**: All authenticated users

### Refresh Institution Dashboard
```http
POST /realtime/dashboard/refresh/institution
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Institution dashboard refreshed successfully",
  "data": {
    "totalStudents": 500,
    "totalTeachers": 50,
    "attendance": {...},
    "fees": {...}
  }
}
```

**Note**: Broadcasts real-time update via WebSocket to all institution users

**Permissions**: Super Admin, School Admin

### Update Attendance Statistics
```http
POST /realtime/dashboard/stats/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-01-15",
  "present": 450,
  "absent": 50,
  "percentage": 90
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance statistics updated successfully"
}
```

**Note**: Broadcasts update via WebSocket to institution

**Permissions**: Super Admin, School Admin, Teacher

### Update Fee Statistics
```http
POST /realtime/dashboard/stats/fees
Authorization: Bearer <token>
Content-Type: application/json

{
  "totalCollected": 500000,
  "totalPending": 100000,
  "collectionRate": 83.3
}
```

**Permissions**: Super Admin, School Admin, Accountant

### Update Exam Statistics
```http
POST /realtime/dashboard/stats/exams
Authorization: Bearer <token>
Content-Type: application/json

{
  "totalExams": 10,
  "completed": 7,
  "upcoming": 3,
  "averageScore": 75
}
```

**Permissions**: Super Admin, School Admin, Teacher

### Send Custom Statistics Update
```http
POST /realtime/dashboard/stats/custom
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id",
  "statsData": {
    "customMetric": 100,
    "anotherMetric": "value"
  }
}
```

**Permissions**: Super Admin, School Admin

---

## Real-time Features

**WebSocket Events**:
- `dashboard:update` - Dashboard data updated
- `statistics:update` - Statistics updated
- `attendance:update` - Attendance marked
- `fee:payment_received` - Fee payment received
- `exam:published` - Exam published
- `notification:new` - New notification

**Connection**:
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});

// Listen for dashboard updates
socket.on('dashboard:update', (data) => {
  console.log('Dashboard updated:', data);
  // Update UI with new data
});

// Listen for statistics updates
socket.on('statistics:update', (data) => {
  console.log('Statistics updated:', data);
});
```

---

**Last Updated**: December 2024  
**Total ID Card Endpoints**: 6  
**Total Real-time Dashboard Endpoints**: 6


---

## Advanced Proctoring System

### Start Proctoring Session
```http
POST /proctoring/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "exam": "exam_id",
  "student": "student_id",
  "browserInfo": {
    "userAgent": "Mozilla/5.0...",
    "platform": "Win32",
    "language": "en-US"
  },
  "ipAddress": "192.168.1.1",
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "city": "Mumbai",
    "country": "India"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Proctoring session started successfully",
  "data": {
    "_id": "session_123",
    "exam": {...},
    "student": {...},
    "startTime": "2024-01-01T10:00:00Z",
    "status": "active",
    "riskScore": 0
  }
}
```

### Record Violation
```http
POST /proctoring/sessions/:sessionId/violations
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "tab_switch",
  "severity": "medium",
  "description": "Student switched to another tab",
  "screenshot": "https://s3.amazonaws.com/screenshots/img123.jpg",
  "aiConfidence": 0.95
}
```

### Analyze Screenshot
```http
POST /proctoring/sessions/:sessionId/screenshots
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageUrl": "https://s3.amazonaws.com/screenshots/img123.jpg",
  "timestamp": "2024-01-01T10:05:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Screenshot analyzed successfully",
  "data": {
    "facesDetected": 1,
    "attentionScore": 85,
    "suspiciousObjects": [],
    "emotions": {
      "neutral": 0.7,
      "focused": 0.2,
      "confused": 0.1
    },
    "confidence": 0.92
  }
}
```

### End Proctoring Session
```http
PUT /proctoring/sessions/:sessionId/end
Authorization: Bearer <token>
```

### Get Proctoring Sessions
```http
GET /proctoring/sessions?status=active&examId=exam_123&page=1&limit=20
Authorization: Bearer <token>
```

### Get Session Details
```http
GET /proctoring/sessions/:sessionId
Authorization: Bearer <token>
```

### Get Proctoring Statistics
```http
GET /proctoring/statistics?examId=exam_123
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSessions": 50,
    "activeSessions": 5,
    "completedSessions": 40,
    "flaggedSessions": 5,
    "totalViolations": 25,
    "averageRiskScore": 15.5,
    "violationsByType": {
      "tab_switch": 10,
      "face_not_detected": 8,
      "multiple_faces": 3,
      "looking_away": 4
    }
  }
}
```

### Update Webcam Status
```http
PUT /proctoring/sessions/:sessionId/webcam
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active"
}
```

---

## Question Bank Management

### Create Question
```http
POST /question-bank
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Mathematics",
  "topic": "Algebra",
  "subtopic": "Linear Equations",
  "difficulty": "medium",
  "questionType": "mcq",
  "question": "Solve for x: 2x + 5 = 15",
  "options": [
    { "text": "5", "isCorrect": true },
    { "text": "10", "isCorrect": false },
    { "text": "7.5", "isCorrect": false },
    { "text": "2.5", "isCorrect": false }
  ],
  "explanation": "Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5",
  "marks": 1,
  "timeLimit": 60,
  "tags": ["algebra", "equations", "basic"],
  "bloomsTaxonomy": "apply"
}
```

### Get Questions
```http
GET /question-bank?subject=Mathematics&difficulty=medium&page=1&limit=20
Authorization: Bearer <token>
```

### Get Question by ID
```http
GET /question-bank/:questionId
Authorization: Bearer <token>
```

### Update Question
```http
PUT /question-bank/:questionId
Authorization: Bearer <token>
Content-Type: application/json

{
  "difficulty": "hard",
  "marks": 2
}
```

### Delete Question
```http
DELETE /question-bank/:questionId
Authorization: Bearer <token>
```

### Bulk Create Questions
```http
POST /question-bank/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "questions": [
    {...},
    {...}
  ]
}
```

### Get Random Questions
```http
GET /question-bank/random?count=10&subject=Mathematics&difficulty=medium
Authorization: Bearer <token>
```

### Get Questions for Exam
```http
POST /question-bank/exam
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Mathematics",
  "topics": ["Algebra", "Geometry"],
  "difficultyDistribution": {
    "easy": 5,
    "medium": 10,
    "hard": 5
  },
  "totalQuestions": 20
}
```

### Get Question Statistics
```http
GET /question-bank/statistics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 500,
    "bySubject": {
      "Mathematics": 150,
      "Science": 120,
      "English": 100
    },
    "byDifficulty": {
      "easy": 200,
      "medium": 200,
      "hard": 100
    },
    "byType": {
      "mcq": 300,
      "short_answer": 150,
      "essay": 50
    },
    "totalUsage": 1500
  }
}
```

### Duplicate Question
```http
POST /question-bank/:questionId/duplicate
Authorization: Bearer <token>
```

### Archive Question
```http
PUT /question-bank/:questionId/archive
Authorization: Bearer <token>
```

### Get Subjects
```http
GET /question-bank/subjects
Authorization: Bearer <token>
```

### Get Topics by Subject
```http
GET /question-bank/subjects/:subject/topics
Authorization: Bearer <token>
```

---

## Video Conferencing

### Create Conference
```http
POST /video-conferencing
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mathematics Class - Grade 10",
  "description": "Regular class session",
  "type": "class",
  "provider": "jitsi",
  "scheduledStartTime": "2024-01-15T10:00:00Z",
  "scheduledEndTime": "2024-01-15T11:00:00Z",
  "maxParticipants": 50,
  "settings": {
    "enableVideo": true,
    "enableAudio": true,
    "enableChat": true,
    "enableScreenShare": true,
    "enableRecording": false,
    "waitingRoom": false,
    "muteOnEntry": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video conference created successfully",
  "data": {
    "_id": "conference_123",
    "title": "Mathematics Class - Grade 10",
    "meetingId": "abc123def456",
    "meetingUrl": "https://meet.jit.si/abc123def456-mathematics-class-grade-10",
    "status": "scheduled"
  }
}
```

### Get Conferences
```http
GET /video-conferencing?status=scheduled&type=class&page=1&limit=20
Authorization: Bearer <token>
```

### Get Conference Details
```http
GET /video-conferencing/:conferenceId
Authorization: Bearer <token>
```

### Start Conference
```http
PUT /video-conferencing/:conferenceId/start
Authorization: Bearer <token>
```

### End Conference
```http
PUT /video-conferencing/:conferenceId/end
Authorization: Bearer <token>
```

### Join Conference
```http
POST /video-conferencing/:conferenceId/join
Authorization: Bearer <token>
```

### Leave Conference
```http
POST /video-conferencing/:conferenceId/leave
Authorization: Bearer <token>
```

### Cancel Conference
```http
PUT /video-conferencing/:conferenceId/cancel
Authorization: Bearer <token>
```

### Get Conference Statistics
```http
GET /video-conferencing/statistics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "scheduled": 20,
    "active": 5,
    "ended": 70,
    "cancelled": 5,
    "totalDuration": 5000,
    "totalParticipants": 2500,
    "byType": {
      "class": 60,
      "meeting": 25,
      "ptm": 10,
      "webinar": 5
    },
    "byProvider": {
      "jitsi": 80,
      "zoom": 15,
      "internal": 5
    }
  }
}
```

---

## Group Chat

### Create Chat Room
```http
POST /group-chat/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Grade 10-A Class Group",
  "description": "Group chat for Grade 10-A students and teachers",
  "type": "class",
  "avatar": "https://s3.amazonaws.com/avatars/class10a.jpg",
  "members": [
    {
      "user": "user_123",
      "role": "admin"
    },
    {
      "user": "user_456",
      "role": "member"
    }
  ],
  "settings": {
    "allowMemberInvite": true,
    "allowFileSharing": true,
    "allowReactions": true,
    "muteNotifications": false
  }
}
```

### Get Chat Rooms
```http
GET /group-chat/rooms?type=class&userId=user_123&page=1&limit=20
Authorization: Bearer <token>
```

### Get Room Details
```http
GET /group-chat/rooms/:roomId
Authorization: Bearer <token>
```

### Send Message
```http
POST /group-chat/rooms/:roomId/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello everyone!",
  "type": "text",
  "replyTo": "message_id"
}
```

### Get Messages
```http
GET /group-chat/rooms/:roomId/messages?page=1&limit=50&before=2024-01-01T12:00:00Z
Authorization: Bearer <token>
```

### Add Member
```http
POST /group-chat/rooms/:roomId/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_789"
}
```

### Remove Member
```http
DELETE /group-chat/rooms/:roomId/members/:userId
Authorization: Bearer <token>
```

### Mark as Read
```http
PUT /group-chat/rooms/:roomId/read
Authorization: Bearer <token>
```

### Delete Message
```http
DELETE /group-chat/rooms/:roomId/messages/:messageId
Authorization: Bearer <token>
```

### Add Reaction
```http
POST /group-chat/rooms/:roomId/messages/:messageId/reactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "emoji": "👍"
}
```

### Archive Room
```http
PUT /group-chat/rooms/:roomId/archive
Authorization: Bearer <token>
```

---

## File Sharing

### Upload File
```http
POST /file-sharing/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <file>,
  "description": "Assignment submission",
  "sharedWith": [
    {
      "userId": "user_123",
      "permission": "view"
    }
  ],
  "chatRoom": "room_id",
  "tags": ["assignment", "mathematics"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "_id": "file_123",
    "name": "assignment.pdf",
    "originalName": "Math_Assignment_1.pdf",
    "fileType": "application/pdf",
    "size": 1024000,
    "url": "https://s3.amazonaws.com/files/assignment.pdf",
    "category": "document",
    "uploadedBy": {...}
  }
}
```

### Get Files
```http
GET /file-sharing?category=document&uploadedBy=user_123&page=1&limit=20
Authorization: Bearer <token>
```

### Get Files Shared With Me
```http
GET /file-sharing/shared-with-me?category=image&page=1&limit=20
Authorization: Bearer <token>
```

### Get File Details
```http
GET /file-sharing/:fileId
Authorization: Bearer <token>
```

### Share File
```http
POST /file-sharing/:fileId/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "users": [
    {
      "userId": "user_456",
      "permission": "download"
    },
    {
      "userId": "user_789",
      "permission": "view"
    }
  ]
}
```

### Revoke Access
```http
DELETE /file-sharing/:fileId/share/:userId
Authorization: Bearer <token>
```

### Download File
```http
GET /file-sharing/:fileId/download
Authorization: Bearer <token>
```

### Delete File
```http
DELETE /file-sharing/:fileId
Authorization: Bearer <token>
```

### Get File Statistics
```http
GET /file-sharing/statistics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 500,
    "totalSize": 5242880000,
    "totalDownloads": 2500,
    "totalViews": 5000,
    "byCategory": {
      "document": 300,
      "image": 150,
      "video": 30,
      "audio": 20
    },
    "byType": {
      "application/pdf": 200,
      "image/jpeg": 100,
      "video/mp4": 30
    }
  }
}
```

### Update File Metadata
```http
PUT /file-sharing/:fileId/metadata
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description",
  "tags": ["updated", "tags"],
  "isPublic": false
}
```

---

## Updated Implementation Status

### Completed Endpoints: 240+

| Category | Endpoints | Status |
|----------|-----------|--------|
| Authentication | 9 | ✅ |
| Students | 10+ | ✅ |
| Teachers | 10+ | ✅ |
| Parents | 8+ | ✅ |
| Attendance | 8 | ✅ |
| Advanced Attendance | 15+ | ✅ |
| Fees & Payments | 12 | ✅ |
| Payment Gateway | 9 | ✅ |
| Installments | 8 | ✅ |
| Scholarships | 11 | ✅ |
| Fee Reminders | 4 | ✅ |
| Homework | 10 | ✅ |
| Exams & Grades | 10 | ✅ |
| Online Exams | 15+ | ✅ |
| Advanced Proctoring | 8 | ✅ |
| Question Bank | 14 | ✅ |
| Video Conferencing | 9 | ✅ |
| Group Chat | 11 | ✅ |
| File Sharing | 10 | ✅ |
| Dashboard | 6 | ✅ |
| Real-time Dashboard | 6 | ✅ |
| Theme | 5 | ✅ |
| Tenants | 6 | ✅ |
| PTM | 6 | ✅ |
| Admissions | 8 | ✅ |
| Reports | 6 | ✅ |
| Library | 13 | ✅ |
| Transport | 25+ | ✅ |
| ID Cards | 6 | ✅ |
| Notifications | 8+ | ✅ |
| Settings | 12+ | ✅ |

### Total: 240+ Endpoints Operational

---

**Last Updated**: December 2024  
**Version**: 1.0.0
**Backend Completion**: 99.8%


---

## Two-Factor Authentication (2FA)

### Setup TOTP
```http
POST /2fa/totp/setup
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "TOTP setup initiated. Scan QR code with authenticator app",
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "backupCodes": [
      "A1B2C3D4",
      "E5F6G7H8",
      "I9J0K1L2"
    ]
  }
}
```

### Verify and Enable TOTP
```http
POST /2fa/totp/verify-enable
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "123456"
}
```

### Verify TOTP
```http
POST /2fa/totp/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "123456"
}
```

### Send SMS OTP
```http
POST /2fa/otp/sms
Authorization: Bearer <token>
Content-Type: application/json

{
  "phoneNumber": "+919876543210"
}
```

### Send Email OTP
```http
POST /2fa/otp/email
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Verify OTP
```http
POST /2fa/otp/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "otp": "123456",
  "type": "sms"
}
```

### Get 2FA Status
```http
GET /2fa/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "method": "totp",
    "lastUsed": "2024-01-01T10:00:00Z",
    "backupCodesRemaining": 8
  }
}
```

### Disable 2FA
```http
POST /2fa/disable
Authorization: Bearer <token>
```

### Regenerate Backup Codes
```http
POST /2fa/backup-codes/regenerate
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Backup codes regenerated successfully",
  "data": {
    "backupCodes": [
      "A1B2C3D4",
      "E5F6G7H8",
      "I9J0K1L2",
      "M3N4O5P6",
      "Q7R8S9T0",
      "U1V2W3X4",
      "Y5Z6A7B8",
      "C9D0E1F2",
      "G3H4I5J6",
      "K7L8M9N0"
    ]
  }
}
```

---

## OAuth Integration

### Get Google Auth URL
```http
GET /oauth/google/url?state=random_state
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
    "state": "random_state"
  }
}
```

### Google OAuth Callback
```http
GET /oauth/google/callback?code=authorization_code&tenant=tenant_id
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_123",
      "email": "user@gmail.com",
      "name": "John Doe",
      "role": "student"
    },
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "isNewUser": false
  }
}
```

### Get Microsoft Auth URL
```http
GET /oauth/microsoft/url?state=random_state
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=...",
    "state": "random_state"
  }
}
```

### Microsoft OAuth Callback
```http
GET /oauth/microsoft/callback?code=authorization_code&tenant=tenant_id
```

### Link OAuth Account
```http
POST /oauth/link
Authorization: Bearer <token>
Content-Type: application/json

{
  "provider": "google",
  "code": "authorization_code"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account linked successfully",
  "data": {
    "_id": "oauth_account_123",
    "provider": "google",
    "email": "user@gmail.com",
    "displayName": "John Doe"
  }
}
```

### Unlink OAuth Account
```http
DELETE /oauth/unlink/:provider
Authorization: Bearer <token>
```

### Get Linked Accounts
```http
GET /oauth/linked
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "oauth_account_123",
      "provider": "google",
      "email": "user@gmail.com",
      "displayName": "John Doe",
      "createdAt": "2024-01-01T10:00:00Z"
    },
    {
      "_id": "oauth_account_456",
      "provider": "microsoft",
      "email": "user@outlook.com",
      "displayName": "John Doe",
      "createdAt": "2024-01-02T10:00:00Z"
    }
  ]
}
```

---

## Biometric Authentication

### Register Biometric Credential
```http
POST /biometric/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "fingerprint",
  "credentialId": "credential_unique_id",
  "publicKey": "base64_encoded_public_key",
  "deviceInfo": {
    "deviceId": "device_123",
    "deviceName": "iPhone 13",
    "platform": "iOS",
    "osVersion": "15.0"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Biometric credential registered successfully",
  "data": {
    "_id": "credential_123",
    "type": "fingerprint",
    "deviceInfo": {
      "deviceName": "iPhone 13",
      "platform": "iOS"
    },
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

### Generate Authentication Challenge
```http
POST /biometric/challenge
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "challenge": "base64_encoded_challenge",
    "credentials": [
      {
        "id": "credential_unique_id",
        "type": "fingerprint",
        "deviceInfo": {
          "deviceName": "iPhone 13",
          "platform": "iOS"
        }
      }
    ]
  }
}
```

### Verify Biometric Authentication
```http
POST /biometric/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "credentialId": "credential_unique_id",
  "challenge": "base64_encoded_challenge",
  "signature": "base64_encoded_signature",
  "authenticatorData": "base64_encoded_authenticator_data"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Biometric authentication successful"
}
```

### Get User Credentials
```http
GET /biometric/credentials
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "credential_123",
      "type": "fingerprint",
      "deviceInfo": {
        "deviceName": "iPhone 13",
        "platform": "iOS",
        "osVersion": "15.0"
      },
      "isActive": true,
      "lastUsed": "2024-01-01T10:00:00Z",
      "createdAt": "2023-12-01T10:00:00Z"
    },
    {
      "_id": "credential_456",
      "type": "face_id",
      "deviceInfo": {
        "deviceName": "iPad Pro",
        "platform": "iOS",
        "osVersion": "15.2"
      },
      "isActive": true,
      "lastUsed": "2024-01-02T10:00:00Z",
      "createdAt": "2023-12-15T10:00:00Z"
    }
  ]
}
```

### Revoke Credential
```http
PUT /biometric/credentials/:credentialId/revoke
Authorization: Bearer <token>
```

### Delete Credential
```http
DELETE /biometric/credentials/:credentialId
Authorization: Bearer <token>
```

### Get Biometric Statistics
```http
GET /biometric/statistics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 140,
    "inactive": 10,
    "byType": {
      "fingerprint": 80,
      "face_id": 50,
      "touch_id": 20
    },
    "byPlatform": {
      "iOS": 100,
      "Android": 40,
      "Windows": 10
    }
  }
}
```

---

## Updated Implementation Status

### Completed Endpoints: 264+

| Category | Endpoints | Status |
|----------|-----------|--------|
| Authentication | 9 | ✅ |
| Two-Factor Auth | 10 | ✅ |
| OAuth | 7 | ✅ |
| Biometric Auth | 7 | ✅ |
| Students | 10+ | ✅ |
| Teachers | 10+ | ✅ |
| Parents | 8+ | ✅ |
| Attendance | 8 | ✅ |
| Advanced Attendance | 15+ | ✅ |
| Fees & Payments | 12 | ✅ |
| Payment Gateway | 9 | ✅ |
| Installments | 8 | ✅ |
| Scholarships | 11 | ✅ |
| Fee Reminders | 4 | ✅ |
| Homework | 10 | ✅ |
| Exams & Grades | 10 | ✅ |
| Online Exams | 15+ | ✅ |
| Advanced Proctoring | 8 | ✅ |
| Question Bank | 14 | ✅ |
| Video Conferencing | 9 | ✅ |
| Group Chat | 11 | ✅ |
| File Sharing | 10 | ✅ |
| Dashboard | 6 | ✅ |
| Real-time Dashboard | 6 | ✅ |
| Theme | 5 | ✅ |
| Tenants | 6 | ✅ |
| PTM | 6 | ✅ |
| Admissions | 8 | ✅ |
| Reports | 6 | ✅ |
| Library | 13 | ✅ |
| Transport | 25+ | ✅ |
| ID Cards | 6 | ✅ |
| Notifications | 8+ | ✅ |
| Settings | 12+ | ✅ |

### Total: 264+ Endpoints Operational

---

## Authentication Flow Examples

### Complete 2FA Setup Flow
```javascript
// 1. Setup TOTP
const setupResponse = await fetch('/api/v1/2fa/totp/setup', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { secret, qrCode, backupCodes } = setupResponse.data;

// 2. User scans QR code with authenticator app

// 3. Verify and enable
const verifyResponse = await fetch('/api/v1/2fa/totp/verify-enable', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    token: '123456' // From authenticator app
  })
});

// 4. Save backup codes securely
console.log('Backup codes:', backupCodes);
```

### OAuth Login Flow
```javascript
// 1. Get authorization URL
const urlResponse = await fetch('/api/v1/oauth/google/url');
const { url } = urlResponse.data;

// 2. Redirect user to Google
window.location.href = url;

// 3. Handle callback (on your callback URL)
const params = new URLSearchParams(window.location.search);
const code = params.get('code');

const loginResponse = await fetch(`/api/v1/oauth/google/callback?code=${code}&tenant=${tenantId}`);
const { user, accessToken, refreshToken } = loginResponse.data;

// 4. Store tokens and redirect to dashboard
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
```

### Biometric Authentication Flow
```javascript
// 1. Register credential (on device with biometric support)
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: new Uint8Array(32),
    rp: { name: "EduManage Pro" },
    user: {
      id: new Uint8Array(16),
      name: "user@example.com",
      displayName: "John Doe"
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }]
  }
});

await fetch('/api/v1/biometric/register', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'fingerprint',
    credentialId: credential.id,
    publicKey: btoa(String.fromCharCode(...new Uint8Array(credential.response.publicKey))),
    deviceInfo: {
      deviceName: navigator.userAgent,
      platform: navigator.platform
    }
  })
});

// 2. Authenticate with biometric
const challengeResponse = await fetch('/api/v1/biometric/challenge', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { challenge } = challengeResponse.data;

const assertion = await navigator.credentials.get({
  publicKey: {
    challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
    allowCredentials: [{
      id: credential.rawId,
      type: 'public-key'
    }]
  }
});

await fetch('/api/v1/biometric/verify', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    credentialId: credential.id,
    challenge: challenge,
    signature: btoa(String.fromCharCode(...new Uint8Array(assertion.response.signature))),
    authenticatorData: btoa(String.fromCharCode(...new Uint8Array(assertion.response.authenticatorData)))
  })
});
```

---

**Last Updated**: December 2024  
**Version**: 1.0.0
**Backend Completion**: 99.9%


---

## Dashboard Widgets (Customizable Dashboard)

### Create Widget
```http
POST /dashboard/widgets
Authorization: Bearer <token>
Content-Type: application/json

{
  "widgetType": "attendance_summary",
  "title": "My Attendance",
  "position": {
    "x": 0,
    "y": 0
  },
  "size": {
    "width": 4,
    "height": 4
  },
  "settings": {
    "showPercentage": true,
    "period": "30days"
  },
  "refreshInterval": 300000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Widget created successfully",
  "data": {
    "_id": "widget_123",
    "widgetType": "attendance_summary",
    "title": "My Attendance",
    "position": { "x": 0, "y": 0 },
    "size": { "width": 4, "height": 4 },
    "isVisible": true,
    "order": 0
  }
}
```

### Get User Widgets
```http
GET /dashboard/widgets
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "widget_123",
      "widgetType": "attendance_summary",
      "title": "My Attendance",
      "position": { "x": 0, "y": 0 },
      "size": { "width": 4, "height": 4 },
      "isVisible": true,
      "order": 0
    },
    {
      "_id": "widget_456",
      "widgetType": "fee_status",
      "title": "Fee Status",
      "position": { "x": 4, "y": 0 },
      "size": { "width": 4, "height": 4 },
      "isVisible": true,
      "order": 1
    }
  ]
}
```

### Get Widget by ID
```http
GET /dashboard/widgets/:widgetId
Authorization: Bearer <token>
```

### Update Widget
```http
PUT /dashboard/widgets/:widgetId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "settings": {
    "showPercentage": false
  }
}
```

### Delete Widget
```http
DELETE /dashboard/widgets/:widgetId
Authorization: Bearer <token>
```

### Update Widget Position
```http
PUT /dashboard/widgets/:widgetId/position
Authorization: Bearer <token>
Content-Type: application/json

{
  "position": {
    "x": 4,
    "y": 0
  }
}
```

### Update Widget Size
```http
PUT /dashboard/widgets/:widgetId/size
Authorization: Bearer <token>
Content-Type: application/json

{
  "size": {
    "width": 6,
    "height": 4
  }
}
```

### Reorder Widgets
```http
POST /dashboard/widgets/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "widgetOrders": [
    { "widgetId": "widget_123", "order": 0 },
    { "widgetId": "widget_456", "order": 1 },
    { "widgetId": "widget_789", "order": 2 }
  ]
}
```

### Toggle Widget Visibility
```http
PUT /dashboard/widgets/:widgetId/toggle
Authorization: Bearer <token>
```

### Get Widget Data
```http
GET /dashboard/widgets/:widgetId/data
Authorization: Bearer <token>
```

**Response (Attendance Summary Widget):**
```json
{
  "success": true,
  "data": {
    "widget": {
      "_id": "widget_123",
      "widgetType": "attendance_summary",
      "title": "My Attendance"
    },
    "data": {
      "total": 30,
      "present": 28,
      "absent": 1,
      "late": 1,
      "percentage": "93.33"
    }
  }
}
```

**Response (Fee Status Widget):**
```json
{
  "success": true,
  "data": {
    "widget": {
      "_id": "widget_456",
      "widgetType": "fee_status",
      "title": "Fee Status"
    },
    "data": {
      "totalDue": 5000,
      "overdue": 1,
      "upcoming": 2,
      "paid": 3
    }
  }
}
```

### Get Widget Templates
```http
GET /dashboard/widgets/templates/list
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "template_123",
      "name": "Attendance Summary",
      "widgetType": "attendance_summary",
      "description": "Shows attendance statistics for the last 30 days",
      "icon": "calendar-check",
      "category": "academic",
      "defaultSize": {
        "width": 4,
        "height": 4
      },
      "roles": ["student", "teacher", "parent"]
    },
    {
      "_id": "template_456",
      "name": "Fee Status",
      "widgetType": "fee_status",
      "description": "Displays current fee status and pending payments",
      "icon": "dollar-sign",
      "category": "financial",
      "defaultSize": {
        "width": 4,
        "height": 4
      },
      "roles": ["student", "parent", "accountant"]
    }
  ]
}
```

### Create Widget Template
```http
POST /dashboard/widgets/templates
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Custom Widget",
  "widgetType": "custom",
  "description": "Custom widget for specific needs",
  "icon": "star",
  "category": "general",
  "defaultSettings": {
    "customField": "value"
  },
  "defaultSize": {
    "width": 4,
    "height": 4
  },
  "roles": ["admin"]
}
```

### Reset Dashboard to Default
```http
POST /dashboard/widgets/reset
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard reset to default",
  "data": [
    {
      "_id": "widget_new_123",
      "widgetType": "attendance_summary",
      "title": "Attendance Summary",
      "order": 0
    },
    {
      "_id": "widget_new_456",
      "widgetType": "fee_status",
      "title": "Fee Status",
      "order": 1
    }
  ]
}
```

---

## Available Widget Types

### Academic Widgets
1. **attendance_summary** - Attendance statistics and percentage
2. **upcoming_exams** - List of upcoming examinations
3. **recent_grades** - Recently published grades
4. **homework_pending** - Pending homework assignments
5. **class_schedule** - Today's class schedule
6. **performance_chart** - Academic performance visualization

### Financial Widgets
7. **fee_status** - Fee payment status and dues
8. **quick_stats** - Quick financial statistics

### Communication Widgets
9. **announcements** - Recent announcements
10. **notifications** - Unread notifications
11. **messages** - Recent messages

### General Widgets
12. **calendar** - Calendar with events
13. **recent_activities** - Recent user activities
14. **todo_list** - Personal todo list
15. **weather** - Weather information
16. **student_list** - List of students (for teachers)
17. **teacher_list** - List of teachers (for admin)
18. **transport_status** - Transport tracking
19. **library_books** - Library book status
20. **analytics** - Custom analytics
21. **custom** - Custom widget type

---

## Widget Configuration Examples

### Attendance Summary Widget
```json
{
  "widgetType": "attendance_summary",
  "title": "My Attendance",
  "settings": {
    "period": "30days",
    "showPercentage": true,
    "showChart": true,
    "chartType": "pie"
  }
}
```

### Fee Status Widget
```json
{
  "widgetType": "fee_status",
  "title": "Fee Status",
  "settings": {
    "showOverdue": true,
    "showUpcoming": true,
    "highlightOverdue": true
  }
}
```

### Class Schedule Widget
```json
{
  "widgetType": "class_schedule",
  "title": "Today's Schedule",
  "settings": {
    "showTeacher": true,
    "showRoom": true,
    "highlightCurrent": true
  }
}
```

---

## Dashboard Layout System

### Grid System
- 12-column grid layout
- Widget width: 1-12 columns
- Widget height: 1-12 rows
- Drag-and-drop positioning
- Responsive breakpoints

### Position Object
```json
{
  "x": 0,  // Column position (0-11)
  "y": 0   // Row position (0+)
}
```

### Size Object
```json
{
  "width": 4,   // Columns (1-12)
  "height": 4   // Rows (1-12)
}
```

---

## Updated Implementation Status

### Completed Endpoints: 278+

| Category | Endpoints | Status |
|----------|-----------|--------|
| Authentication | 9 | ✅ |
| Two-Factor Auth | 10 | ✅ |
| OAuth | 7 | ✅ |
| Biometric Auth | 7 | ✅ |
| Dashboard Widgets | 14 | ✅ |
| Students | 10+ | ✅ |
| Teachers | 10+ | ✅ |
| Parents | 8+ | ✅ |
| Attendance | 8 | ✅ |
| Advanced Attendance | 15+ | ✅ |
| Fees & Payments | 12 | ✅ |
| Payment Gateway | 9 | ✅ |
| Installments | 8 | ✅ |
| Scholarships | 11 | ✅ |
| Fee Reminders | 4 | ✅ |
| Homework | 10 | ✅ |
| Exams & Grades | 10 | ✅ |
| Online Exams | 15+ | ✅ |
| Advanced Proctoring | 8 | ✅ |
| Question Bank | 14 | ✅ |
| Video Conferencing | 9 | ✅ |
| Group Chat | 11 | ✅ |
| File Sharing | 10 | ✅ |
| Dashboard | 6 | ✅ |
| Real-time Dashboard | 6 | ✅ |
| Theme | 5 | ✅ |
| Tenants | 6 | ✅ |
| PTM | 6 | ✅ |
| Admissions | 12 | ✅ |
| Reports | 6 | ✅ |
| Library | 13 | ✅ |
| Transport | 39+ | ✅ |
| ID Cards | 6 | ✅ |
| Notifications | 8+ | ✅ |
| Settings | 12+ | ✅ |
| PTM | 12 | ✅ |

### Total: 300+ Endpoints Operational

---

**Last Updated**: February 26, 2026  
**Version**: 1.0.0
**Backend Completion**: ~95%

**Recent Additions**:
- PTM Video Meeting & Automated Reminders (5 new endpoints)
- Admission Entrance Tests & Merit Lists (4 new endpoints)
- Transport GPS Tracking (4 new endpoints)
- Transport Route Optimization (2 new endpoints)
- Transport Fuel Management (4 new endpoints)

**For More Information**:
- **Completed Features**: See `/docs/COMPLETED_FEATURES.md`
- **Pending Features**: See `/docs/BACKEND_STATUS.md`
- **Architecture**: See `/docs/ARCHITECTURE_OVERVIEW.md`
- **Setup Guide**: See `/backend/SETUP_GUIDE.md`
