# Database Setup (MongoDB)

This backend uses **MongoDB** (with Mongoose). There is no SQL database; all persistence is in MongoDB.

## Connection

- Default URI: `mongodb://127.0.0.1:27017/edusearch`
- Set `MONGODB_URI` in `.env` to override.

## First-time setup

1. Install and start MongoDB locally (or use Atlas).
2. Create an initial superadmin (no data wipe):

   ```bash
   npm run seed:initial
   ```

   Login: `superadmin@eduadmin.com` / `Admin@123`

3. Optional: seed full auth users (permissions + test users; **wipes** existing users):

   ```bash
   npm run seed:auth
   ```

   Test accounts (see script output for passwords): superadmin, school_admin, teacher, staff_member, parent, student.

## Collections (equivalent to “tables”)

Main collections created by Mongoose models under `src/models/`:

| Collection (logical) | Model / File      | Purpose                |
|----------------------|-------------------|------------------------|
| users                | User.js           | Auth, roles, profile   |
| institutions         | Institution.js    | Institutions/schools   |
| branches             | Branch.js         | Branch offices         |
| schools              | School.js         | School entities        |
| students             | Student.js        | Student records        |
| teachers             | Teacher.js        | Teacher records        |
| staff                | Staff.js          | Staff (HR)             |
| permissions          | Permission.js     | Permission definitions |
| roles                | (in User/roles)   | Role-based access      |
| subscriptions       | Subscription.js   | Plans, billing         |
| transactions         | Transaction.js    | Payments               |
| attendance           | Attendance.js     | Attendance             |
| fees                 | Fee.js            | Fees                   |
| exams, grades, etc.  | Exam.js, Grade.js | Academic data          |

(Other models in `src/models/` map to their own collections.)

## If you need SQL (e.g. reporting)

- The app does **not** use SQL. For SQL-style reporting, you would:
  - Export from MongoDB into a SQL DB or warehouse, or
  - Use an ETL/reporting tool that reads from MongoDB.

Schema design (users, institutions, roles, etc.) can be mirrored in SQL if you add a separate reporting database later.
