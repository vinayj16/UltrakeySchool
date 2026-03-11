# EduManage Pro - Educational Management System

EduManage Pro is a comprehensive, multi-tenant SaaS Educational Management System designed to handle the complex needs of modern educational institutions. From basic administration to advanced AI-powered proctoring and real-time tracking, it offers a complete solution for schools, colleges, and educational groups.

## 📋 Project Status

- **Backend**: 100% Complete ✅ | 278+ API Endpoints Operational
- **Frontend**: 100% Core Features Complete ✅ | React + TypeScript + Tailwind
- **Architecture**: Multi-tenant SaaS with Role-Based Access Control (RBAC)
- **Version**: 1.0.0
- **Last Updated**: March 2026

---

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```
Server runs at: `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App runs at: `http://localhost:5173`

## Dashboard Preview Layer

- **Role cards on login**: The login page renders `frontend/src/pages/Authentication/Login/DashboardAccessGrid.tsx`, which pulls `frontend/src/data/dashboardAccessData.ts` to describe every persona (KPIs, permissions, starting recommendations). Each card exposes a preview link (`/preview/:previewId`) plus an "Open dashboard" CTA that seeds `frontend/src/utils/demoMode.ts` before routing to the live path.
- **Preview route**: `/preview/{previewId}` explains the KPI mix, permission set, and recommended starting point before handing off to the protected view—perfect for QA or stakeholders who need context without authenticating.
- **Demo-mode gating**: `frontend/src/components/ProtectedRoute.tsx` checks `isDemoMode()`/`getCurrentDemoUser()` so that once `setDemoUser` runs, the router treats the session as authenticated while the backend protection layer still applies.

---

## 🎯 Key Features & Modules

### 1. Multi-Tenant SaaS Management
- **Institution Management**: Create and manage multiple schools/colleges.
- **Branch Monitoring**: Track performance across different branches.
- **Membership Plans**: Tiered subscription models for institutions.
- **Module Control**: Enable/disable specific features per institution.

### 2. Comprehensive Dashboards
- **Role-Specific Dashboards**: 13 unique dashboards (Super Admin, Teacher, Student, Parent, etc.).
- **Real-time Analytics**: Live statistics for attendance, finance, and performance.
- **Customizable Widgets**: Personalize your dashboard experience.

### 3. Academic Engine
- **Class & Section Management**: Flexible organization of school structure.
- **Curriculum Planning**: Syllabus, lesson plans, and subject management.
- **Examination System**: Online/Offline exams, question banks, and auto-grading.
- **AI Proctoring**: Advanced monitoring for online examinations.

### 4. Financial Suite
- **Fee Management**: Groups, masters, assignments, and collections.
- **Payment Gateways**: Integration with Razorpay, Stripe, and PayU.
- **Accounting**: Income, expenses, invoices, and transaction tracking.

### 5. HRM & Payroll
- **Staff Management**: Detailed records, documents, and attendance.
- **Payroll System**: Salary processing, payslips, and tax management.
- **Leave Management**: Application, approval, and tracking.

### 6. Operational Services
- **Transport System**: Route optimization, vehicle tracking, and driver management.
- **Library System**: Member management, book issuing, and fine tracking.
- **Hostel Management**: Room allocation, visitor logs, and reports.

### 7. Communication & Collaboration
- **Unified Messaging**: Real-time chat, group discussions, and email.
- **Announcements**: Notice boards and event scheduling.
- **Applications**: Integrated Calendar, File Manager, Notes, and Todo lists.

---

## 🗺️ Project Flow & Architecture

### 1. The Super Admin Flow
- **Onboarding**: Super Admin creates an Institution and its first Admin user.
- **Subscription**: Assigns a membership plan and enables required modules.
- **Monitoring**: Oversees all institutions, transactions, and system health.

### 2. The Institution Admin Flow
- **Configuration**: Sets up school settings, academic years, and branches.
- **Resource Setup**: Adds classes, sections, subjects, and teachers.
- **Enrollment**: Manages student admissions and parent associations.
- **Financials**: Defines fee structures and monitors school revenue.

### 3. The Academic Flow (Teacher)
- **Daily Operations**: Marks attendance and checks class schedules.
- **Instruction**: Uploads syllabus, lesson plans, and assigns homework.
- **Assessment**: Creates exams, records marks, and generates report cards.

### 4. The User Experience (Student/Parent)
- **Tracking**: Views timetable, attendance, and homework assignments.
- **Engagement**: Participates in online exams and real-time classes.
- **Financial**: Parents view fee status and make online payments.

---

## 📂 Page Directory (Frontend)

The system includes over 150+ specialized pages:

- **Super Admin**: Dashboards, Institution Mgmt, Membership Plans, Agents, Analytics, Audit Logs.
- **Academic**: Classes, Sections, Subjects, Syllabus, Timetable, Exams, Results, Grading.
- **Students**: Admission, Grid/List view, Details, Leaves, Fees, Results, Promotion.
- **Teachers**: Profiles, Routines, Leaves, Salary, Attendance.
- **HRM**: Staffs, Departments, Designations, Payroll, Documents, Approvals.
- **Finance**: Expenses, Income, Invoices, Transactions, Fees Groups/Types.
- **Transport**: Routes, Pickup Points, Vehicles, Drivers, Assignments.
- **Library**: Members, Books, Issue/Return, Reports.
- **Hostel**: Rooms, Allocations, Visitor Logs, Reports.
- **Communication**: Notice Board, Events, Messages, Chat, Email.
- **Settings**: Profile, Security, Notifications, SMS/Email Config, School Settings, Localization.

---

## 🛠️ Technology Stack

### Backend
- **Node.js & Express.js**
- **MongoDB (Mongoose)**
- **Redis (Caching & Jobs)**
- **Socket.io (Real-time)**
- **BullMQ (Background Tasks)**
- **JWT & OAuth 2.0**

### Frontend
- **React 18 & TypeScript**
- **Tailwind CSS**
- **Zustand (State Management)**
- **React Router 6 (Finalized Router)**
- **Lucide React (Icons)**
- **Recharts (Analytics)**

---

**Made with ❤️ for Education Excellence**
# UltrakeySchool
