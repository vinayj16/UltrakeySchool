# EduManage Pro - Frontend Status & Directory

This document provides a comprehensive list of all pages and features implemented in the EduManage Pro frontend application.

## 🚀 Overview

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Styles
- **Routing**: React Router 6 (createBrowserRouter)
- **State Management**: Zustand
- **Architecture**: Role-Based Access Control (RBAC) with 13 unique roles.

---

## 📂 Page Directory & Features

### 1. Super Admin Module
Management of the entire SaaS platform.
- **Dashboard**: Platform-wide analytics (revenue, institutions, active users).
- **Institution Management**: CRUD for schools and colleges, plan upgrades, module control.
- **Transactions**: Monitor all payments across the platform.
- **Membership Plans**: Define and manage subscription tiers and add-ons.
- **Agents Management**: Management of sales/support agents and their commissions.
- **Analytics & Reports**: System-wide performance and growth reports.
- **System Maintenance**: Platform settings, audit logs, impersonation tool.

### 2. Academic Module
Core educational operations.
- **Classes & Sections**: Management of classes, sections, and classroom allocations.
- **Subject Management**: Mapping subjects to classes and assigning teachers.
- **Syllabus & Routine**: Course outlines, lesson plans, and class routines.
- **Homework**: Assignment creation, student submissions, and grading.
- **Timetable**: Master timetable management for students and teachers.

### 3. Examination System
Comprehensive testing and evaluation.
- **Exam Management**: Creation of offline and online examinations.
- **Question Bank**: Centralized repository of questions organized by subject and difficulty.
- **Exam Scheduling**: Automated scheduling and hall ticket generation.
- **Attendance & Results**: Recording exam attendance and automated result processing.
- **Grading System**: Customizable grading scales and performance analytics.

### 4. Student Management
End-to-end student lifecycle.
- **Admissions**: Online application and admission management.
- **Student Profile**: Detailed 360-degree view of student data (academic, financial, attendance).
- **Promotion**: Automated year-end student promotion logic.
- **Student Services**: Personal timetable, fee status, and library/hostel associations.

### 5. Teacher Management
Teacher operations and academic tracking.
- **Teacher Profiles**: Professional records and documentation.
- **Routines & Attendance**: Personal schedule and daily attendance tracking.
- **Leaves & Salary**: Leave applications and payroll management.

### 6. Finance & Fees
Institutional financial management.
- **Fee Management**: Setting up fee groups, masters, and automated assignments.
- **Collection**: Online fee payment portal and offline receipt generation.
- **Accounting**: Detailed tracking of income, expenses, and invoices.
- **Financial Reports**: Balance sheets, fee collection reports, and expense analytics.

### 7. HRM & Payroll
Human resource management for all staff.
- **Staff Management**: Records for all non-teaching staff.
- **Departments & Designations**: Organizational structure management.
- **Payroll**: Automated salary calculation and payslip generation.
- **Leave Management**: Unified leave request and approval workflow.

### 8. Transport & Services
Operational logistics and ancillary services.
- **Transport**: Routes, pickup points, vehicles, and driver management.
- **Transport Pickup Points**: `frontend/src/pages/transport/TransportPickupPointsPage.tsx` now calls `transportService` end-to-end (GET/POST/PUT/DELETE/bulk-delete) from the backend before updating the UI, so the modal-driven CRUD flow always reflects live data instead of sample rows. All modal submit handlers now propagate API responses/toasts, refresh the table after the server confirms mutations, and align the UI with the live `TRANSPORT.PICKUP_POINTS` dataset defined in `frontend/src/config/api.ts`.
- **Library**: Book cataloging, member management, and circulation tracking.
- **Hostel**: Room allocation, hostel reports, and visitor logs.

### 9. Communication & Apps
Collaborative tools.
- **Messaging**: Real-time chat, group messages, and internal email.
- **Announcements**: Dynamic notice board and event calendar.
- **Utility Apps**: Integrated FileManager, Notes, and Todo lists.

## Authentication & Demo Flow

- **Role cards on login**: `frontend/src/pages/Authentication/Login/Login.tsx` surfaces `frontend/src/pages/Authentication/Login/DashboardAccessGrid.tsx`, which renders every persona defined in `frontend/src/data/dashboardAccessData.ts`. Each card outlines the KPI mix, permission set, and recommended starting point, offers a preview link (`/preview/:previewId`), and seeds `demoMode` (via `frontend/src/utils/demoMode.ts`) before routing to the live dashboard path so every role can be browsed without credentials.
- **Preview explainer**: `/preview/:previewId` loads `frontend/src/pages/Authentication/Login/DashboardPreview.tsx`, reuses the same data payload to describe the target dashboard, and lets evaluators jump straight into the protected route after confirming the KPI/perms context.
- **Route protection**: The router still funnels through `ProtectedRoute`, which respects plan/module/role checks, and the `/preview/:previewId` path remains public so stakeholders can inspect each dashboard card’s intent before hitting the gated view.

### Dashboard Route Matrix
The finalized router (`frontend/src/router/finalized-router.tsx`) enumerates all dashboards guarded by `ProtectedRoute`. The table below maps each persona to its entry route and component.

| Role | Route | Primary Component | Notes |
| --- | --- | --- | --- |
| Super Admin | `/super-admin/dashboard` | `SuperAdminDashboard` (inside `SuperAdminLayout`) | Oversees all institutions, transactions, plans, and monitoring tools. |
| Institution Admin | `/dashboard/main` | `InstituteAdminDashboardPage` | Institution-wide KPIs plus quick links to finance, HR, and student/teacher management. |
| School Admin | `/dashboard/admin` | `InstituteAdminDashboardPage` (school mode) | Focused view for a single school/branch with compliance & class metrics. |
| Principal | `/dashboard/principal` | `PrincipalDashboard` | Leadership view covering staff, academics, and announcements. |
| Teacher | `/dashboard/teacher` | `TeacherDashboard` | Class schedules, assignment queue, and performance snapshots. |
| Student | `/dashboard/student` | `StudentDashboard` | GPA, attendance, upcoming homework/exams, and fee alerts. |
| Parent | `/dashboard/parent` | `ParentDashboardPage` | Children’s progress, attendance, and financial snapshots. |
| Accountant | `/dashboard/finance` | `FinanceDashboardPage` | Revenue, collections, overdue invoices, and budget health. |
| HR Manager | `/dashboard/hr` | `HRDashboardPage` | Staff counts, leave trends, and payroll readiness. |
| Librarian | `/dashboard/library` | `LibraryDashboardPage` | Circulation stats, overdue books, and member activity. |
| Transport Manager | `/dashboard/transport` | `TransportDashboardPage` | Routes, vehicles, driver assignments, and fuel health. |
| Hostel Warden | `/dashboard/hostel` | `HostelDashboardPage` | Occupancy, maintenance requests, and safety checks. |
| Staff Member | `/dashboard/staff` | `StaffDashboard` | Task tracking, attendance, and announcements.

### Key Flow Files
- `frontend/src/router/finalized-router.tsx`: Source of truth for every role-based route, dashboard redirect logic, and layout assignments (Main vs. SuperAdmin). Guarded routes rely on `ProtectedRoute`, and it now exposes `/preview/:previewId` for the login cards.
- `frontend/src/components/ProtectedRoute.tsx`: Handles plan/module/role checks before rendering any dashboard view and honors `isDemoMode()`/`getCurrentDemoUser()` when a preview card or demo route is active.
- `frontend/src/pages/Authentication/Login/Login.tsx`: Manages the login form, toast feedback, `TEST_ACCOUNTS`, and the `DashboardAccessGrid`, so users can open any role dashboard or preview without submitting credentials.
- `frontend/src/pages/Authentication/Login/DashboardAccessGrid.tsx`: Renders the role cards powered by `frontend/src/data/dashboardAccessData.ts`; each card can preview (`/preview/:previewId`) or open a dashboard after seeding the demo user via `frontend/src/utils/demoMode.ts`.
- `frontend/src/pages/Authentication/Login/DashboardPreview.tsx`: Explains what each role card shows before redirecting back to `/login`.
- `frontend/src/utils/demoMode.ts`: `setDemoUser` hydrates the auth store, writes the demo user into `localStorage`, and enables demo mode, so “Open dashboard” navigations behave like mulitive sessions.

---

## 🗺️ Project Flow

### 1. Authentication Flow
- **Multi-Role Login**: Users select their role and enter credentials.
- **Security**: 2FA and session management integrated.
- **Redirection**: Automatically routed to the role-specific dashboard.

### 2. SaaS Setup Flow
1. **Super Admin** creates an **Institution**.
2. **Institution Admin** configures **School Settings**.
3. **Admin** sets up **Academics** (Classes, Subjects, Sections).
4. **Admin** registers **Staff/Teachers** and **Students**.
5. **Teachers** start **Academic Operations** (Attendance, Exams).

### 3. Financial Flow
1. **Admin** defines **Fee Structures**.
2. **System** assigns fees to students.
3. **Parents/Students** pay via **Integrated Gateways**.
4. **Admin** monitors **Collection Reports**.

---

## 🛠️ Integrated Technologies

- **Lucide React**: Vector icons for a consistent UI.
- **Recharts**: Data visualization for all dashboards.
- **React Toastify**: Real-time feedback and notifications.
- **Socket.io**: Powers real-time chat and live updates.
- **Zustand**: Lightweight and fast state management.
