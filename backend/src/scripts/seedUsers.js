import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import School from '../models/School.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    console.log('Cleared existing users');

    const schools = await School.find().limit(5);
    
    if (schools.length === 0) {
      console.log('No schools found. Please seed schools first.');
      process.exit(1);
    }

    const users = [];

    users.push({
      name: 'Super Admin',
      email: 'superadmin@eduadmin.com',
      password: 'SuperAdmin@123',
      roleId: 'super_admin',
      avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=dc3545&color=fff',
      phone: '+1-555-0001',
      isActive: true
    });

    for (let i = 0; i < schools.length; i++) {
      const school = schools[i];
      const schoolName = school.name.replace(/\s+/g, '');

      users.push({
        schoolId: school._id,
        name: `${schoolName} Admin`,
        email: `admin@${schoolName.toLowerCase()}.edu`,
        password: 'Admin@123',
        roleId: 'school_admin',
        avatar: `https://ui-avatars.com/api/?name=${schoolName}+Admin&background=0d6efd&color=fff`,
        phone: `+1-555-${String(1000 + i).slice(-4)}`,
        joiningDate: new Date('2023-01-01'),
        isActive: true
      });

      users.push({
        schoolId: school._id,
        name: `John Teacher ${i + 1}`,
        email: `teacher${i + 1}@${schoolName.toLowerCase()}.edu`,
        password: 'Teacher@123',
        roleId: 'teacher',
        avatar: `https://ui-avatars.com/api/?name=John+Teacher&background=0dcaf0&color=000`,
        phone: `+1-555-${String(2000 + i).slice(-4)}`,
        department: 'Mathematics',
        designation: 'Senior Teacher',
        joiningDate: new Date('2023-06-01'),
        isActive: true
      });

      users.push({
        schoolId: school._id,
        name: `Sarah Teacher ${i + 1}`,
        email: `teacher.sarah${i + 1}@${schoolName.toLowerCase()}.edu`,
        password: 'Teacher@123',
        roleId: 'teacher',
        avatar: `https://ui-avatars.com/api/?name=Sarah+Teacher&background=0dcaf0&color=000`,
        phone: `+1-555-${String(2100 + i).slice(-4)}`,
        department: 'Science',
        designation: 'Teacher',
        joiningDate: new Date('2023-08-01'),
        isActive: true
      });

      users.push({
        schoolId: school._id,
        name: `Alice Student ${i + 1}`,
        email: `student${i + 1}@${schoolName.toLowerCase()}.edu`,
        password: 'Student@123',
        roleId: 'student',
        avatar: `https://ui-avatars.com/api/?name=Alice+Student&background=198754&color=fff`,
        phone: `+1-555-${String(3000 + i).slice(-4)}`,
        dateOfBirth: new Date('2010-05-15'),
        gender: 'female',
        isActive: true
      });

      users.push({
        schoolId: school._id,
        name: `Bob Student ${i + 1}`,
        email: `student.bob${i + 1}@${schoolName.toLowerCase()}.edu`,
        password: 'Student@123',
        roleId: 'student',
        avatar: `https://ui-avatars.com/api/?name=Bob+Student&background=198754&color=fff`,
        phone: `+1-555-${String(3100 + i).slice(-4)}`,
        dateOfBirth: new Date('2011-08-20'),
        gender: 'male',
        isActive: true
      });

      if (school.subscriptionPlan === 'medium' || school.subscriptionPlan === 'premium') {
        users.push({
          schoolId: school._id,
          name: `Parent ${i + 1}`,
          email: `parent${i + 1}@${schoolName.toLowerCase()}.edu`,
          password: 'Parent@123',
          roleId: 'parent',
          avatar: `https://ui-avatars.com/api/?name=Parent&background=ffc107&color=000`,
          phone: `+1-555-${String(4000 + i).slice(-4)}`,
          isActive: true
        });

        users.push({
          schoolId: school._id,
          name: `Accountant ${i + 1}`,
          email: `accountant${i + 1}@${schoolName.toLowerCase()}.edu`,
          password: 'Accountant@123',
          roleId: 'accountant',
          avatar: `https://ui-avatars.com/api/?name=Accountant&background=6c757d&color=fff`,
          phone: `+1-555-${String(5000 + i).slice(-4)}`,
          department: 'Finance',
          designation: 'Senior Accountant',
          joiningDate: new Date('2023-03-01'),
          isActive: true
        });

        users.push({
          schoolId: school._id,
          name: `Librarian ${i + 1}`,
          email: `librarian${i + 1}@${schoolName.toLowerCase()}.edu`,
          password: 'Librarian@123',
          roleId: 'librarian',
          avatar: `https://ui-avatars.com/api/?name=Librarian&background=6610f2&color=fff`,
          phone: `+1-555-${String(6000 + i).slice(-4)}`,
          department: 'Library',
          designation: 'Head Librarian',
          joiningDate: new Date('2023-04-01'),
          isActive: true
        });
      }

      if (school.subscriptionPlan === 'premium') {
        users.push({
          schoolId: school._id,
          name: `HR Manager ${i + 1}`,
          email: `hr${i + 1}@${schoolName.toLowerCase()}.edu`,
          password: 'HR@123',
          roleId: 'hr',
          avatar: `https://ui-avatars.com/api/?name=HR+Manager&background=6f42c1&color=fff`,
          phone: `+1-555-${String(7000 + i).slice(-4)}`,
          department: 'Human Resources',
          designation: 'HR Manager',
          joiningDate: new Date('2023-02-01'),
          isActive: true
        });

        users.push({
          schoolId: school._id,
          name: `Transport Manager ${i + 1}`,
          email: `transport${i + 1}@${schoolName.toLowerCase()}.edu`,
          password: 'Transport@123',
          roleId: 'transport_manager',
          avatar: `https://ui-avatars.com/api/?name=Transport+Manager&background=fd7e14&color=fff`,
          phone: `+1-555-${String(8000 + i).slice(-4)}`,
          department: 'Transport',
          designation: 'Transport Manager',
          joiningDate: new Date('2023-05-01'),
          isActive: true
        });

        users.push({
          schoolId: school._id,
          name: `Hostel Warden ${i + 1}`,
          email: `warden${i + 1}@${schoolName.toLowerCase()}.edu`,
          password: 'Warden@123',
          roleId: 'hostel_warden',
          avatar: `https://ui-avatars.com/api/?name=Hostel+Warden&background=20c997&color=fff`,
          phone: `+1-555-${String(9000 + i).slice(-4)}`,
          department: 'Hostel',
          designation: 'Hostel Warden',
          joiningDate: new Date('2023-07-01'),
          isActive: true
        });
      }
    }

    await User.insertMany(users);

    console.log(`✓ Created ${users.length} users across all roles`);
    console.log('User seeding completed successfully');
    console.log('\nDefault Credentials:');
    console.log('Super Admin: superadmin@eduadmin.com / SuperAdmin@123');
    console.log('School Admin: admin@[schoolname].edu / Admin@123');
    console.log('Teacher: teacher[n]@[schoolname].edu / Teacher@123');
    console.log('Student: student[n]@[schoolname].edu / Student@123');
    console.log('Parent: parent[n]@[schoolname].edu / Parent@123');
    console.log('Accountant: accountant[n]@[schoolname].edu / Accountant@123');
    console.log('Librarian: librarian[n]@[schoolname].edu / Librarian@123');
    console.log('HR: hr[n]@[schoolname].edu / HR@123');
    console.log('Transport: transport[n]@[schoolname].edu / Transport@123');
    console.log('Warden: warden[n]@[schoolname].edu / Warden@123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
