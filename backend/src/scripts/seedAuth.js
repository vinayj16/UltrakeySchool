import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Permission from '../models/Permission.js';

dotenv.config();

const permissions = [
  { name: 'View Dashboard', key: 'view_dashboard', category: 'dashboard', module: 'DASHBOARD', description: 'Access to dashboard' },
  { name: 'Manage Students', key: 'manage_students', category: 'students', module: 'STUDENTS', description: 'Full access to student management' },
  { name: 'View Students', key: 'view_students', category: 'students', module: 'STUDENTS', description: 'View student information' },
  { name: 'Manage Teachers', key: 'manage_teachers', category: 'teachers', module: 'TEACHERS', description: 'Full access to teacher management' },
  { name: 'View Teachers', key: 'view_teachers', category: 'teachers', module: 'TEACHERS', description: 'View teacher information' },
  { name: 'Manage Staff', key: 'manage_staff', category: 'staff', module: 'STAFF', description: 'Full access to staff management' },
  { name: 'View Staff', key: 'view_staff', category: 'staff', module: 'STAFF', description: 'View staff information' },
  { name: 'Manage Classes', key: 'manage_classes', category: 'classes', module: 'CLASSES', description: 'Full access to class management' },
  { name: 'View Classes', key: 'view_classes', category: 'classes', module: 'CLASSES', description: 'View class information' },
  { name: 'Mark Attendance', key: 'mark_attendance', category: 'attendance', module: 'ATTENDANCE', description: 'Mark student attendance' },
  { name: 'View Attendance', key: 'view_attendance', category: 'attendance', module: 'ATTENDANCE', description: 'View attendance records' },
  { name: 'Manage Fees', key: 'manage_fees', category: 'fees', module: 'FEES', description: 'Full access to fee management' },
  { name: 'View Fees', key: 'view_fees', category: 'fees', module: 'FEES', description: 'View fee information' },
  { name: 'Manage Exams', key: 'manage_exams', category: 'exams', module: 'EXAMS', description: 'Full access to exam management' },
  { name: 'View Exams', key: 'view_exams', category: 'exams', module: 'EXAMS', description: 'View exam information' },
  { name: 'Manage Grades', key: 'manage_grades', category: 'exams', module: 'EXAMS', description: 'Manage student grades' },
  { name: 'View Grades', key: 'view_grades', category: 'exams', module: 'EXAMS', description: 'View student grades' },
  { name: 'Manage Library', key: 'manage_library', category: 'library', module: 'LIBRARY', description: 'Full access to library management' },
  { name: 'View Library', key: 'view_library', category: 'library', module: 'LIBRARY', description: 'View library resources' },
  { name: 'Manage Hostel', key: 'manage_hostel', category: 'hostel', module: 'HOSTEL', description: 'Full access to hostel management' },
  { name: 'View Hostel', key: 'view_hostel', category: 'hostel', module: 'HOSTEL', description: 'View hostel information' },
  { name: 'Manage Transport', key: 'manage_transport', category: 'transport', module: 'TRANSPORT', description: 'Full access to transport management' },
  { name: 'View Transport', key: 'view_transport', category: 'transport', module: 'TRANSPORT', description: 'View transport information' },
  { name: 'View Reports', key: 'view_reports', category: 'reports', module: 'REPORTS', description: 'Access to reports and analytics' },
  { name: 'Manage Settings', key: 'manage_settings', category: 'settings', module: 'SETTINGS', description: 'Manage system settings' },
  { name: 'View Own Profile', key: 'view_own_profile', category: 'system', module: 'DASHBOARD', description: 'View own profile' },
  { name: 'View Own Results', key: 'view_own_results', category: 'exams', module: 'EXAMS', description: 'View own exam results' },
  { name: 'View Own Fees', key: 'view_own_fees', category: 'fees', module: 'FEES', description: 'View own fee information' },
  { name: 'View Own Children', key: 'view_own_children', category: 'students', module: 'STUDENTS', description: 'View own children information' },
  { name: 'View Own Wards', key: 'view_own_wards', category: 'students', module: 'STUDENTS', description: 'View own ward information' },
  { name: 'Apply Leave', key: 'apply_leave', category: 'system', module: 'DASHBOARD', description: 'Apply for leave' },
  { name: 'View Timetable', key: 'view_timetable', category: 'classes', module: 'CLASSES', description: 'View class timetable' }
];

const users = [
  {
    name: 'Super Admin',
    email: 'superadmin@eduadmin.com',
    password: 'Admin@123',
    role: 'superadmin',
    plan: 'premium',
    permissions: ['*'],
    modules: [],
    status: 'active'
  },
  {
    name: 'School Admin',
    email: 'admin@school.com',
    password: 'Admin@123',
    role: 'school_admin',
    plan: 'premium',
    permissions: [],
    modules: [],
    status: 'active'
  },
  {
    name: 'John Teacher',
    email: 'teacher@school.com',
    password: 'Teacher@123',
    role: 'teacher',
    plan: 'medium',
    permissions: [],
    modules: [],
    status: 'active'
  },
  {
    name: 'Jane Staff',
    email: 'staff@school.com',
    password: 'Staff@123',
    role: 'staff_member',
    plan: 'basic',
    permissions: [],
    modules: [],
    status: 'active'
  },
  {
    name: 'Parent User',
    email: 'parent@school.com',
    password: 'Parent@123',
    role: 'parent',
    plan: 'basic',
    permissions: [],
    modules: [],
    status: 'active'
  },
  {
    name: 'Student User',
    email: 'student@school.com',
    password: 'Student@123',
    role: 'student',
    plan: 'basic',
    permissions: [],
    modules: [],
    status: 'active'
  }
];

const seedAuth = async () => {
  try {
    await connectDB();

    await Permission.deleteMany({});
    console.log('Permissions cleared');

    await User.deleteMany({});
    console.log('Users cleared');

    const createdPermissions = await Permission.insertMany(permissions);
    console.log(`${createdPermissions.length} permissions created`);

    for (const u of users) {
      await User.create(u);
    }
    console.log(`${users.length} users created (passwords hashed)`);

    console.log('\nTest Accounts:');
    console.log('================');
    users.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding auth data:', error);
    process.exit(1);
  }
};

seedAuth();
