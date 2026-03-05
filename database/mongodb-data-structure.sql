db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password", "role"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        role: { enum: ["superadmin", "institution_admin", "school_admin", "principal", "teacher", "student", "parent", "accountant", "hr_manager", "librarian", "transport_manager", "hostel_warden", "staff_member"] },
        institutionId: { bsonType: "objectId" },
        status: { enum: ["active", "inactive", "suspended"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- Create students collection
db.createCollection("students")

-- Create institutions collection
db.createCollection("institutions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "code", "email"],
      properties: {
        name: { bsonType: "string" },
        type: { enum: ["SCHOOL", "INTER_COLLEGE", "DEGREE_COLLEGE", "ENGINEERING_COLLEGE"] },
        code: { bsonType: "string" },
        email: { bsonType: "string" },
        status: { enum: ["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- Create classes collection
db.createCollection("classes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["institutionId", "name", "grade", "section", "academicYear"],
      properties: {
        institutionId: { bsonType: "objectId" },
        name: { bsonType: "string" },
        grade: { bsonType: "string" },
        section: { bsonType: "string" },
        academicYear: { bsonType: "string" },
        status: { enum: ["ACTIVE", "INACTIVE", "COMPLETED"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- Create subjects collection
db.createCollection("subjects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["institutionId", "name", "code"],
      properties: {
        institutionId: { bsonType: "objectId" },
        name: { bsonType: "string" },
        code: { bsonType: "string" },
        status: { enum: ["ACTIVE", "INACTIVE"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- Create attendance collection
db.createCollection("attendance", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["institutionId", "userId", "userType", "date", "status"],
      properties: {
        institutionId: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        userType: { enum: ["student", "teacher", "staff"] },
        date: { bsonType: "date" },
        status: { enum: ["present", "absent", "late", "excused"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- Create exams collection
db.createCollection("exams", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["institutionId", "name", "type", "academicYear", "term"],
      properties: {
        institutionId: { bsonType: "objectId" },
        name: { bsonType: "string" },
        type: { enum: ["UNIT_TEST", "MID_TERM", "FINAL", "PRACTICAL", "PROJECT"] },
        academicYear: { bsonType: "string" },
        term: { bsonType: "string" },
        status: { enum: ["DRAFT", "PUBLISHED", "ONGOING", "COMPLETED", "CANCELLED"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- Create results collection
db.createCollection("results", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["institutionId", "examId", "studentId", "subjectId", "classId", "marks"],
      properties: {
        institutionId: { bsonType: "objectId" },
        examId: { bsonType: "objectId" },
        studentId: { bsonType: "objectId" },
        subjectId: { bsonType: "objectId" },
        classId: { bsonType: "objectId" },
        marks: {
          bsonType: "object",
          required: ["obtained", "total"],
          properties: {
            obtained: { bsonType: "number" },
            total: { bsonType: "number" },
            percentage: { bsonType: "number" },
            grade: { bsonType: "string" },
            gradePoint: { bsonType: "number" }
          }
        },
        status: { enum: ["PRESENT", "ABSENT", "WITHHELD", "CANCELLED"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- Create fee_structures collection
db.createCollection("fee_structures", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["institutionId", "name", "type", "academicYear"],
      properties: {
        institutionId: { bsonType: "objectId" },
        name: { bsonType: "string" },
        type: { enum: ["TUITION", "TRANSPORT", "HOSTEL", "EXAMINATION", "OTHER"] },
        academicYear: { bsonType: "string" },
        status: { enum: ["ACTIVE", "INACTIVE"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- Create payments collection
db.createCollection("payments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["institutionId", "studentId", "amount", "paymentMethod", "paymentDate"],
      properties: {
        institutionId: { bsonType: "objectId" },
        studentId: { bsonType: "objectId" },
        amount: { bsonType: "number" },
        paymentMethod: { enum: ["CASH", "CHEQUE", "ONLINE", "CARD", "UPI"] },
        paymentDate: { bsonType: "date" },
        status: { enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- Create announcements collection
db.createCollection("announcements", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["institutionId", "title", "content", "type"],
      properties: {
        institutionId: { bsonType: "objectId" },
        title: { bsonType: "string" },
        content: { bsonType: "string" },
        type: { enum: ["GENERAL", "ACADEMIC", "EXAM", "EVENT", "EMERGENCY"] },
        priority: { enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] },
        isPublished: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- Create messages collection
db.createCollection("messages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["institutionId", "senderId", "recipientId", "content", "type"],
      properties: {
        institutionId: { bsonType: "objectId" },
        senderId: { bsonType: "objectId" },
        recipientId: { bsonType: "objectId" },
        content: { bsonType: "string" },
        type: { enum: ["TEXT", "IMAGE", "DOCUMENT"] },
        isRead: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- Create audit_logs collection
db.createCollection("audit_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["action", "resource", "timestamp"],
      properties: {
        institutionId: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        action: { bsonType: "string" },
        resource: { bsonType: "string" },
        resourceId: { bsonType: "objectId" },
        timestamp: { bsonType: "date" },
        severity: { enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] }
      }
    }
  }
})

-- Create settings collection
db.createCollection("settings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["category", "key", "value"],
      properties: {
        institutionId: { bsonType: "objectId" },
        category: { bsonType: "string" },
        key: { bsonType: "string" },
        value: {}, // Mixed type
        isSystemLevel: { bsonType: "bool" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

-- ========================================
-- INSERT SAMPLE DATA
-- ========================================

-- Insert Super Admin User
db.users.insertOne({
  _id: ObjectId("000000000000000000000001"),
  name: "Super Admin",
  email: "superadmin@ultrakeys.com",
  password: "$2b$10$WjX6F4F0wXaH3fY6ZD.S5eHkddWys1bX4ii0xUEBiFdxZGBDSFakG",
  role: "superadmin",
  status: "active",
  isActive: true,
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})

-- Insert Sample Institution
db.institutions.insertOne({
  _id: ObjectId("100000000000000000000001"),
  name: "Delhi Public School",
  type: "SCHOOL",
  code: "DPS001",
  email: "info@dpsschool.edu",
  phone: "+911123456789",
  website: "https://dpsschool.edu",
  affiliation: "CBSE",
  status: "ACTIVE",
  plan: "premium",
  address: {
    street: "123 Education St",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    postalCode: "110001"
  },
  settings: {
    academicYear: "2024-2025",
    timezone: "Asia/Kolkata",
    language: "en",
    currency: "INR"
  },
  features: {
    attendance: true,
    examination: true,
    fees: true,
    communication: true
  },
  statistics: {
    totalStudents: 0,
    totalTeachers: 0,
    totalStaff: 0,
    totalClasses: 0
  },
  createdAt: new Date(),
  updatedAt: new Date()
})

-- Insert Sample Users
db.users.insertMany([
  {
    name: "Rajesh Kumar",
    email: "admin@dpsschool.edu",
    password: "$2b$10$KIXgSxhxV0JudY7pMm3WbO",
    role: "institution_admin",
    institutionId: ObjectId("100000000000000000000001"),
    status: "active",
    isActive: true,
    emailVerified: true,
    phone: "+919876543210",
    address: {
      street: "456 Admin Road",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      postalCode: "110002"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Anita Patel",
    email: "maths@dpsschool.edu",
    password: "$2b$10$TqHcZV5yN8LxJ6A3Kp7nW",
    role: "teacher",
    institutionId: ObjectId("100000000000000000000001"),
    status: "active",
    isActive: true,
    emailVerified: true,
    phone: "+919876543211",
    address: {
      street: "789 Teacher Colony",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      postalCode: "110003"
    },
    teacherDetails: {
      subject: "Mathematics",
      employeeId: "EMP001",
      qualifications: ["B.Ed", "M.Sc Mathematics"],
      experience: 5
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Amit Verma",
    email: "student@dpsschool.edu",
    password: "$2b$10$Hs3V5PsW9nB2sQ1xF6rL4",
    role: "student",
    institutionId: ObjectId("100000000000000000000001"),
    status: "active",
    isActive: true,
    emailVerified: true,
    phone: "+919876543212",
    address: {
      street: "321 Student Hostel",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      postalCode: "110004"
    },
    studentDetails: {
      rollNumber: "S001",
      class: "10-A",
      section: "A",
      admissionDate: new Date("2024-04-01"),
      realtime: {
        gpa: 3.7,
        attendancePercent: 98,
        lastUpdated: new Date()
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Raj Verma",
    email: "parent@dpsschool.edu",
    password: "$2b$10$Jk7LhS5tG2uR1pY8wZmO6",
    role: "parent",
    institutionId: ObjectId("100000000000000000000001"),
    status: "active",
    isActive: true,
    emailVerified: true,
    phone: "+919876543213",
    address: {
      street: "654 Parent Avenue",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      postalCode: "110005"
    },
    parentDetails: {
      occupation: "Software Engineer",
      phone: "+919876543213"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

-- Insert Sample Class
db.classes.insertOne({
  institutionId: ObjectId("100000000000000000000001"),
  name: "Class 10-A",
  grade: "10",
  section: "A",
  academicYear: "2024-2025",
  classTeacher: ObjectId(), // Will be set to teacher ID
  students: [], // Will be populated with student IDs
  capacity: 40,
  status: "ACTIVE",
  subjects: [
    {
      name: "Mathematics",
      code: "MATH101",
      teacher: ObjectId(), // Will be set to teacher ID
      isOptional: false,
      credits: 4
    },
    {
      name: "English",
      code: "ENG101",
      teacher: ObjectId(),
      isOptional: false,
      credits: 3
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})

-- Insert Sample Subject
db.subjects.insertMany([
  {
    institutionId: ObjectId("100000000000000000000001"),
    name: "Mathematics",
    code: "MATH101",
    description: "Advanced Mathematics for Class 10",
    category: "CORE",
    grade: "10",
    textbooks: [
      {
        title: "Mathematics Textbook Class 10",
        author: "NCERT",
        publisher: "NCERT",
        required: true
      }
    ],
    assessment: {
      continuous: 20,
      final: 80,
      practical: 0
    },
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    institutionId: ObjectId("100000000000000000000001"),
    name: "English",
    code: "ENG101",
    description: "English Language and Literature",
    category: "CORE",
    grade: "10",
    textbooks: [
      {
        title: "English Textbook Class 10",
        author: "NCERT",
        publisher: "NCERT",
        required: true
      }
    ],
    assessment: {
      continuous: 20,
      final: 80,
      practical: 0
    },
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

-- ========================================
-- CREATE INDEXES
-- ========================================

-- Users collection indexes
db.users.createIndex({ institutionId: 1, role: 1 })
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ status: 1 })
db.users.createIndex({ "address.city": 1 })

-- Institutions collection indexes
db.institutions.createIndex({ type: 1, status: 1 })
db.institutions.createIndex({ code: 1 }, { unique: true })
db.institutions.createIndex({ "address.city": 1 })

-- Classes collection indexes
db.classes.createIndex({ institutionId: 1, grade: 1, section: 1 })
db.classes.createIndex({ academicYear: 1 })

-- Attendance collection indexes
db.attendance.createIndex({ institutionId: 1, date: -1 })
db.attendance.createIndex({ userId: 1, date: -1 })
db.attendance.createIndex({ status: 1 })

-- Results collection indexes
db.results.createIndex({ examId: 1, studentId: 1 }, { unique: true })
db.results.createIndex({ institutionId: 1, subjectId: 1 })

-- Payments collection indexes
db.payments.createIndex({ institutionId: 1, studentId: 1, paymentDate: -1 })
db.payments.createIndex({ status: 1 })

-- Messages collection indexes
db.messages.createIndex({ senderId: 1, createdAt: -1 })
db.messages.createIndex({ recipientId: 1, isRead: 1, createdAt: -1 })

-- Audit logs collection indexes
db.audit_logs.createIndex({ institutionId: 1, timestamp: -1 })
db.audit_logs.createIndex({ action: 1, timestamp: -1 })

print("Database setup completed successfully!")
print("Collections created with validation rules")
print("Sample data inserted")
print("Indexes created for optimal performance")
  {
    _id: ObjectId("000000000000000000000001"),
    username: "superadmin",
    email: "superadmin@ultrakeys.com",
    password: "$2b$10$WjX6F4F0wXaH3fY6ZD.S5eHkddWys1bX4ii0xUEBiFdxZGBDSFakG", -- bcrypt hash for SuperAdmin@2026
    firstName: "Super",
    lastName: "Admin",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    emailVerified: true,
    twoFactorEnabled: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    institutionId: null, -- Super admin has no specific institution
    metadata: {
      permissions: ["*"], -- Full access
      modules: ["*"], -- All modules
      plan: "enterprise"
    }
  },
  {
    _id: ObjectId("000000000000000000000002"),
    username: "schooladmin",
    email: "admin@dpsschool.edu",
    password: "$2b$10$KIXgSxhxV0JudY7pMm3WbO", -- bcrypt hash for SchoolAdmin#2026
    firstName: "Rajesh",
    lastName: "Kumar",
    role: "INSTITUTION_ADMIN",
    status: "ACTIVE",
    emailVerified: true,
    twoFactorEnabled: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    institutionId: ObjectId("school1"),
    metadata: {
      permissions: ["read", "create", "update", "delete"],
      modules: ["dashboard", "academic", "attendance", "fees", "hrm"],
      plan: "premium"
    }
  },
  {
    _id: ObjectId("000000000000000000000003"),
    username: "interadmin",
    email: "admin@intercollege.edu",
    password: "$2b$10$H7uGqT7zjF7vP1Q1Xg9BxO", -- bcrypt hash for InterAdmin@2026
    firstName: "Suresh",
    lastName: "Reddy",
    role: "INSTITUTION_ADMIN",
    status: "ACTIVE",
    emailVerified: true,
    twoFactorEnabled: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    institutionId: ObjectId("inter1"),
    metadata: {
      permissions: ["read", "create", "update", "delete"],
      modules: ["dashboard", "academic", "attendance", "fees", "hrm"],
      plan: "premium"
    }
  },
  {
    _id: ObjectId("000000000000000000000004"),
    username: "degreeadmin",
    email: "admin@degreecollege.edu",
    password: "$2b$10$M1r7lN0rZpFw1A6kE3tqW.", -- bcrypt hash for DegreeAdmin@2026
    firstName: "Priya",
    lastName: "Sharma",
    role: "INSTITUTION_ADMIN",
    status: "ACTIVE",
    emailVerified: true,
    twoFactorEnabled: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    institutionId: ObjectId("degree1"),
    metadata: {
      permissions: ["read", "create", "update", "delete"],
      modules: ["dashboard", "academic", "attendance", "fees", "hrm"],
      plan: "premium"
    }
  },
  {
    _id: ObjectId("000000000000000000000005"),
    username: "enggadmin",
    email: "admin@engineeringclg.edu",
    password: "$2b$10$A9Ks9b5Y1W7mD2UZp6lR0.", -- bcrypt hash for EnggAdmin@2026
    firstName: "Arun",
    lastName: "Singh",
    role: "INSTITUTION_ADMIN",
    status: "ACTIVE",
    emailVerified: true,
    twoFactorEnabled: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    institutionId: ObjectId("engineering1"),
    metadata: {
      permissions: ["read", "create", "update", "delete"],
      modules: ["dashboard", "academic", "attendance", "fees", "hrm"],
      plan: "enterprise"
    }
  },
  {
    _id: ObjectId(),
    username: "teacher1",
    email: "maths@dpsschool.edu",
    password: "$2b$10$TqHcZV5yN8LxJ6A3Kp7nW.", -- bcrypt hash for Teacher1@2026
    firstName: "Anita",
    lastName: "Patel",
    role: "TEACHER",
    status: "ACTIVE",
    emailVerified: true,
    twoFactorEnabled: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    institutionId: ObjectId("school1"),
    metadata: {
      permissions: ["read", "create", "update"],
      modules: ["dashboard", "academic", "attendance", "examination", "communication"],
      plan: "premium"
    },
    teacherDetails: {
      subject: "Mathematics",
      classAssigned: "10-A",
      employeeId: "EMP001",
      qualifications: ["B.Ed", "M.Sc Mathematics"],
      experience: 5
    }
  },
  {
    _id: ObjectId(),
    username: "professor1",
    email: "physics@engineeringclg.edu",
    password: "$2b$10$QeR4jZ0kMnB2xK8dL1pC6.", -- bcrypt hash for Professor1@2026
    firstName: "Dr. Ravi",
    lastName: "Kumar",
    role: "TEACHER",
    status: "ACTIVE",
    emailVerified: true,
    twoFactorEnabled: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    institutionId: ObjectId("engineering1"),
    metadata: {
      permissions: ["read", "create", "update"],
      modules: ["dashboard", "academic", "attendance", "examination", "communication"],
      plan: "enterprise"
    },
    teacherDetails: {
      subject: "Physics",
      classAssigned: "B.Tech CSE",
      employeeId: "PROF001",
      qualifications: ["Ph.D. Physics", "M.Tech"],
      experience: 12,
      department: "Physics",
      specialization: "Quantum Physics"
    }
  },
  {
    _id: ObjectId("student1"),
    username: "student1",
    email: "student@dpsschool.edu",
    password: "$2b$10$Hs3V5PsW9nB2sQ1xF6rL4.", -- bcrypt hash for Student1@2026
    firstName: "Amit",
    lastName: "Verma",
    role: "STUDENT",
    status: "ACTIVE",
    emailVerified: true,
    twoFactorEnabled: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    institutionId: ObjectId("school1"),
    metadata: {
      permissions: ["read"],
      modules: ["dashboard", "academic", "attendance", "examination", "communication"],
      plan: "premium"
    },
    studentDetails: {
      rollNumber: "S001",
      class: "10-A",
      section: "A",
      admissionDate: new Date("2024-04-01"),
      guardianId: ObjectId("parent1"),
      realtime: {
        gpa: 3.7,
        attendancePercent: 98,
        lastUpdated: new Date()
      }
    }
  },
    {
      _id: ObjectId("engineeringstudent"),
      username: "engineeringstudent",
    email: "student@engineeringclg.edu",
    password: "$2b$10$Ew8KxM5qNvF2bT4pR7sL1.", -- bcrypt hash for EnggStudent@2026
    firstName: "Deepak",
    lastName: "Choudhary",
    role: "STUDENT",
    status: "ACTIVE",
    emailVerified: true,
    twoFactorEnabled: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    institutionId: ObjectId("engineering1"),
    metadata: {
      permissions: ["read"],
      modules: ["dashboard", "academic", "attendance", "examination", "communication"],
      plan: "enterprise"
    },
      studentDetails: {
        rollNumber: "EC2022001",
        class: "B.Tech CSE",
        section: "A",
        admissionDate: new Date("2022-08-01"),
        guardianId: ObjectId("parent2"),
        branch: "Computer Science Engineering",
        semester: 4,
        enrollmentNumber: "EC2022CSE001",
        realtime: {
          gpa: 3.9,
          attendancePercent: 96,
          upcomingExam: "Semester 4 Final",
          lastUpdated: new Date()
        }
      }
    },
    {
      _id: ObjectId("parent1"),
      username: "parent1",
      email: "parent@dpsschool.edu",
    password: "$2b$10$Jk7LhS5tG2uR1pY8wZmO6.", -- bcrypt hash for Parent1@2026
    firstName: "Raj",
    lastName: "Verma",
    role: "PARENT",
    status: "ACTIVE",
    emailVerified: true,
    twoFactorEnabled: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    institutionId: ObjectId("school1"),
    metadata: {
      permissions: ["read"],
      modules: ["dashboard", "academic", "attendance", "examination", "communication"],
      plan: "premium"
    },
      parentDetails: {
        occupation: "Software Engineer",
        phone: "+919876543210",
        address: "123 Main St, New Delhi, India"
      }
    }
    ,
    {
      _id: ObjectId("parent2"),
      username: "parent@engineeringclg.edu",
      email: "parent@engineeringclg.edu",
      password: "$2b$10$Lk8UvN7mR2qP1fD5wHzH3.", -- bcrypt hash for EnggParent@2026
      firstName: "Reena",
      lastName: "Choudhary",
      role: "PARENT",
      status: "ACTIVE",
      emailVerified: true,
      twoFactorEnabled: false,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      institutionId: ObjectId("engineering1"),
      metadata: {
        permissions: ["read"],
        modules: ["dashboard", "academic", "attendance", "communication"],
        plan: "enterprise"
      },
      parentDetails: {
        occupation: "Research Scientist",
        phone: "+913312345679",
        address: "101 Technology Park, Kolkata"
      }
    }
  ]);

db.users.insertOne({
  _id: ObjectId("interParent"),
  username: "parent@intercollege.edu",
  email: "parent.inter@intercollege.edu",
  password: "$2b$10$Pq9Va8tR4sG1mZ6nB2cF0e", -- bcrypt hash for InterParent@2026
  firstName: "Sunita",
  lastName: "Rao",
  role: "PARENT",
  status: "ACTIVE",
  emailVerified: true,
  twoFactorEnabled: false,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  institutionId: ObjectId("inter1"),
  metadata: {
    permissions: ["read"],
    modules: ["dashboard", "academic", "attendance", "communication"],
    plan: "premium"
  },
  parentDetails: {
    occupation: "College Administrator",
    phone: "+919800112233",
    address: "45 Heritage Road, Hyderabad"
  }
});

db.users.insertOne({
  _id: ObjectId("interStudent"),
  username: "interstudent",
  email: "student@intercollege.edu",
  password: "$2b$10$Sx6FmQ8tJ1yP2kV4hB9nM", -- bcrypt hash for InterStudent@2026
  firstName: "Neha",
  lastName: "Sharma",
  role: "STUDENT",
  status: "ACTIVE",
  emailVerified: true,
  twoFactorEnabled: false,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  institutionId: ObjectId("inter1"),
  metadata: {
    permissions: ["read"],
    modules: ["dashboard", "academic", "attendance", "examination", "communication"],
    plan: "premium"
  },
  studentDetails: {
    rollNumber: "IC202401",
    class: "11-Science",
    section: "B",
    admissionDate: new Date("2024-06-01"),
    guardianId: ObjectId("interParent")
  }
});

db.users.insertOne({
  _id: ObjectId("degreeParent"),
  username: "parent@degreecollege.edu",
  email: "parent.degree@degreecollege.edu",
  password: "$2b$10$Dq4HrW7uL6zE9nK8pV0fR", -- bcrypt hash for DegreeParent@2026
  firstName: "Meera",
  lastName: "Patel",
  role: "PARENT",
  status: "ACTIVE",
  emailVerified: true,
  twoFactorEnabled: false,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  institutionId: ObjectId("degree1"),
  metadata: {
    permissions: ["read"],
    modules: ["dashboard", "academic", "attendance", "communication"],
    plan: "premium"
  },
  parentDetails: {
    occupation: "Accountant",
    phone: "+912212334455",
    address: "78 College Road, Mumbai"
  }
});

db.users.insertOne({
  _id: ObjectId("degreeStudent"),
  username: "degree.student",
  email: "student@degreecollege.edu",
  password: "$2b$10$Gf8KiL5rX1tD3vS9nP2wQ", -- bcrypt hash for DegreeStudent@2026
  firstName: "Raghu",
  lastName: "Desai",
  role: "STUDENT",
  status: "ACTIVE",
  emailVerified: true,
  twoFactorEnabled: false,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  institutionId: ObjectId("degree1"),
  metadata: {
    permissions: ["read"],
    modules: ["dashboard", "academic", "attendance", "examination", "communication"],
    plan: "premium"
  },
  studentDetails: {
    rollNumber: "DC202401",
    class: "B.Com 2nd Year",
    section: "A",
    admissionDate: new Date("2022-07-15"),
    guardianId: ObjectId("degreeParent"),
    semester: 4,
    enrollmentNumber: "DC2024BC001"
  }
  });

  -- Students Collection (denormalized view for dashboard KPIs)
  db.students.insertMany([
    {
      _id: ObjectId("f00000000000000000000001"),
      userId: ObjectId("student1"),
      institutionId: ObjectId("school1"),
      campus: "Delhi Public School",
      institutionType: "SCHOOL",
      gradeLevel: "10",
      section: "A",
      rollNumber: "S001",
      gpa: 3.7,
      attendancePercent: 98,
      lastExam: "Model Test (Oct 20, 2024)",
      kpiSnapshot: {
        assignmentsCompleted: 24,
        pendingAssignments: 2,
        homeworkAverage: "A-"
      },
      attendanceBreakdown: {
        month: "Oct 2024",
        presentDays: 22,
        absentDays: 0,
        lastUpdated: new Date()
      },
      realtimeStatus: {
        badges: ["Honor Roll", "Attendance Hero"],
        lastSynced: new Date()
      }
    },
    {
      _id: ObjectId("f00000000000000000000002"),
      userId: ObjectId("interStudent"),
      institutionId: ObjectId("inter1"),
      campus: "Inter Regional College",
      institutionType: "INTER_COLLEGE",
      gradeLevel: "11-Science",
      section: "B",
      rollNumber: "IC202401",
      gpa: 3.4,
      attendancePercent: 96,
      lastExam: "Unit Test (Sep 22, 2024)",
      kpiSnapshot: {
        assignmentsCompleted: 18,
        pendingAssignments: 1,
        homeworkAverage: "B+"
      },
      attendanceBreakdown: {
        month: "Sep 2024",
        presentDays: 20,
        absentDays: 1,
        lastUpdated: new Date()
      },
      realtimeStatus: {
        badges: ["Science Fair", "Punctual"],
        lastSynced: new Date()
      }
    },
    {
      _id: ObjectId("f00000000000000000000003"),
      userId: ObjectId("degreeStudent"),
      institutionId: ObjectId("degree1"),
      campus: "St. Xavier's Degree College",
      institutionType: "DEGREE_COLLEGE",
      gradeLevel: "B.Com 2nd Year",
      section: "A",
      rollNumber: "DC202401",
      gpa: 3.2,
      attendancePercent: 94,
      lastExam: "Semester Exam (Nov 05, 2024)",
      kpiSnapshot: {
        assignmentsCompleted: 12,
        pendingAssignments: 3,
        homeworkAverage: "B"
      },
      attendanceBreakdown: {
        month: "Nov 2024",
        presentDays: 18,
        absentDays: 2,
        lastUpdated: new Date()
      },
      realtimeStatus: {
        badges: ["Library Enthusiast"],
        lastSynced: new Date()
      }
    },
    {
      _id: ObjectId("f00000000000000000000004"),
      userId: ObjectId("engineeringstudent"),
      institutionId: ObjectId("engineering1"),
      campus: "Indian Institute of Technology",
      institutionType: "ENGINEERING_COLLEGE",
      gradeLevel: "B.Tech CSE - Semester 4",
      section: "A",
      rollNumber: "EC2022001",
      gpa: 3.9,
      attendancePercent: 96,
      lastExam: "Semester 4 Midterm (Nov 10, 2024)",
      kpiSnapshot: {
        assignmentsCompleted: 10,
        pendingAssignments: 0,
        labSubmissions: 4
      },
      attendanceBreakdown: {
        month: "Nov 2024",
        presentDays: 19,
        absentDays: 1,
        lastUpdated: new Date()
      },
      realtimeStatus: {
        badges: ["Research Star", "Lab Pro"],
        lastSynced: new Date()
      }
    }
  ]);

  -- Roles Collection
-- Defines role permissions and hierarchy
db.roles.insertMany([
  {
    _id: ObjectId(),
    roleId: "SUPER_ADMIN",
    name: "Super Admin",
    description: "System administrator with full access",
    hierarchy: 1,
    permissions: {
      dashboard: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      academic: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      attendance: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      fees: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      hrm: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      library: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      transport: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      hostel: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      examination: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      communication: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      inventory: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      canteen: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      reports: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true },
      settings: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: true, viewReports: true, export: true, approve: true, manageFinance: true }
    },
    defaultModules: ["dashboard", "academic", "attendance", "fees", "hrm"],
    canAccessAllModules: true,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    roleId: "INSTITUTION_ADMIN",
    name: "Institution Admin",
    description: "Institution administrator with comprehensive access",
    hierarchy: 2,
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      academic: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: true, manageFinance: false },
      attendance: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: true, manageFinance: false },
      fees: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: true, manageFinance: true },
      hrm: { create: true, read: true, update: true, delete: true, manageUsers: true, manageSettings: false, viewReports: true, export: true, approve: true, manageFinance: false },
      library: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: true, manageFinance: false },
      transport: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: true, manageFinance: false },
      hostel: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: true, manageFinance: false },
      examination: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: true, manageFinance: false },
      communication: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: true, manageFinance: false },
      inventory: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: true, manageFinance: false },
      canteen: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: true, manageFinance: true },
      reports: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      settings: { create: false, read: true, update: true, delete: false, manageUsers: false, manageSettings: true, viewReports: false, export: false, approve: false, manageFinance: false }
    },
    defaultModules: ["dashboard", "academic", "attendance", "fees", "hrm"],
    canAccessAllModules: true,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    roleId: "TEACHER",
    name: "Teacher/Professor",
    description: "Educator with teaching and grading access",
    hierarchy: 3,
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      academic: { create: false, read: true, update: true, delete: false, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      attendance: { create: true, read: true, update: true, delete: false, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      fees: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      hrm: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      library: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      transport: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      hostel: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      examination: { create: false, read: true, update: true, delete: false, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      communication: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      inventory: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      canteen: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      reports: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: true, export: true, approve: false, manageFinance: false },
      settings: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false }
    },
    defaultModules: ["dashboard", "academic", "attendance", "examination", "communication"],
    canAccessAllModules: false,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    roleId: "STUDENT",
    name: "Student",
    description: "Student with limited access to academic features",
    hierarchy: 4,
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      academic: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      attendance: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      fees: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      hrm: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      library: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      transport: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      hostel: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      examination: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      communication: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      inventory: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      canteen: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      reports: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      settings: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false }
    },
    defaultModules: ["dashboard", "academic", "attendance", "examination", "communication"],
    canAccessAllModules: false,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    roleId: "PARENT",
    name: "Parent",
    description: "Parent with access to child information",
    hierarchy: 5,
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      academic: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      attendance: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      fees: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      hrm: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      library: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      transport: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      hostel: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      examination: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      communication: { create: true, read: true, update: true, delete: true, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      inventory: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      canteen: { create: false, read: true, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      reports: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false },
      settings: { create: false, read: false, update: false, delete: false, manageUsers: false, manageSettings: false, viewReports: false, export: false, approve: false, manageFinance: false }
    },
    defaultModules: ["dashboard", "academic", "attendance", "examination", "communication"],
    canAccessAllModules: false,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- INSTITUTION MANAGEMENT COLLECTIONS
-- ========================================

-- Institutions Collection
db.institutions.insertMany([
  {
    _id: ObjectId("school1"),
    name: "Delhi Public School",
    type: "SCHOOL",
    code: "DPS001",
    email: "info@dpsschool.edu",
    phone: "+911123456789",
    website: "https://dpsschool.edu",
    affiliation: "CBSE",
    accreditation: ["CBSE", "ISO 9001"],
    address: {
      street: "123 Education St",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      postalCode: "110001"
    },
    logo: "https://dpsschool.edu/logo.png",
    status: "ACTIVE",
    plan: "premium",
    subscription: {
      planId: "premium",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-01-01"),
      billingCycle: "monthly",
      isActive: true
    },
    settings: {
      academicYear: "2024-2025",
      timezone: "Asia/Kolkata",
      language: "en",
      currency: "INR",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12-hour"
    },
    metadata: {
      totalStudents: 1200,
      totalTeachers: 85,
      totalStaff: 45,
      totalClasses: 25,
      totalSections: 50,
      establishedYear: 1995,
      studentTeacherRatio: 14
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("inter1"),
    name: "Inter Regional College",
    type: "INTER_COLLEGE",
    code: "IRN002",
    email: "contact@intercollege.edu",
    phone: "+919876543210",
    website: "https://intercollege.edu",
    affiliation: "State Board",
    accreditation: ["NAAC A", "State Council"],
    address: {
      street: "45 Heritage Road",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      postalCode: "500001"
    },
    logo: "https://intercollege.edu/logo.png",
    status: "ACTIVE",
    plan: "premium",
    subscription: {
      planId: "premium",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-01-01"),
      billingCycle: "monthly",
      isActive: true
    },
    settings: {
      academicYear: "2024-2025",
      timezone: "Asia/Kolkata",
      language: "en",
      currency: "INR",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12-hour"
    },
    metadata: {
      totalStudents: 800,
      totalTeachers: 60,
      totalStaff: 35,
      totalClasses: 15,
      totalSections: 30,
      establishedYear: 2000,
      studentTeacherRatio: 13,
      coursesOffered: ["Science", "Commerce", "Arts"]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("degree1"),
    name: "St. Xavier's Degree College",
    type: "DEGREE_COLLEGE",
    code: "SXC003",
    email: "admissions@degreecollege.edu",
    phone: "+912212345678",
    website: "https://degreecollege.edu",
    affiliation: "University of Mumbai",
    accreditation: ["NAAC A+", "UGC"],
    address: {
      street: "78 College Road",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      postalCode: "400001"
    },
    logo: "https://degreecollege.edu/logo.png",
    status: "ACTIVE",
    plan: "premium",
    subscription: {
      planId: "premium",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-01-01"),
      billingCycle: "monthly",
      isActive: true
    },
    settings: {
      academicYear: "2024-2025",
      timezone: "Asia/Kolkata",
      language: "en",
      currency: "INR",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12-hour"
    },
    metadata: {
      totalStudents: 1500,
      totalTeachers: 100,
      totalStaff: 55,
      totalClasses: 20,
      totalSections: 40,
      establishedYear: 1950,
      studentTeacherRatio: 15,
      coursesOffered: ["B.A.", "B.Com", "B.Sc", "BBA", "BCA"],
      departments: ["Arts", "Commerce", "Science", "Management", "Computer Science"]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("engineering1"),
    name: "Indian Institute of Technology",
    type: "ENGINEERING_COLLEGE",
    code: "IIT004",
    email: "admin@engineeringclg.edu",
    phone: "+913312345678",
    website: "https://engineeringclg.edu",
    affiliation: "AICTE",
    accreditation: ["NAAC A++", "NBA", "AICTE"],
    address: {
      street: "101 Technology Park",
      city: "Kolkata",
      state: "West Bengal",
      country: "India",
      postalCode: "700001"
    },
    logo: "https://engineeringclg.edu/logo.png",
    status: "ACTIVE",
    plan: "enterprise",
    subscription: {
      planId: "enterprise",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-01-01"),
      billingCycle: "monthly",
      isActive: true
    },
    settings: {
      academicYear: "2024-2025",
      timezone: "Asia/Kolkata",
      language: "en",
      currency: "INR",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12-hour"
    },
    metadata: {
      totalStudents: 3000,
      totalTeachers: 250,
      totalStaff: 150,
      totalClasses: 40,
      totalSections: 80,
      establishedYear: 1985,
      studentTeacherRatio: 12,
      coursesOffered: ["B.Tech", "M.Tech", "Ph.D"],
      departments: ["Computer Science", "Electrical", "Mechanical", "Civil", "Electronics", "Chemical"],
      placementRate: 95,
      averagePackage: 1200000,
      researchOutput: "High",
      campusSize: "100 acres"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- ACADEMIC MANAGEMENT COLLECTIONS
-- ========================================

-- Classes Collection
db.classes.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    name: "Class 10",
    section: "A",
    strength: 45,
    teacherId: ObjectId(),
    subjects: ["Mathematics", "Science", "English", "Hindi", "Social Studies"],
    academicYear: "2024-2025",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    name: "B.Tech CSE",
    section: "A",
    strength: 60,
    teacherId: ObjectId(),
    subjects: ["Data Structures", "Algorithms", "Database Systems", "Operating Systems", "Computer Networks"],
    academicYear: "2024-2025",
    status: "ACTIVE",
    semester: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- Subjects Collection
db.subjects.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    name: "Mathematics",
    code: "MATHS001",
    type: "COMPULSORY",
    description: "Mathematics for Class 10",
    classId: ObjectId(),
    teacherId: ObjectId(),
    credits: 10,
    syllabus: "Algebra, Geometry, Trigonometry",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    name: "Data Structures",
    code: "CS201",
    type: "COMPULSORY",
    description: "Data Structures and Algorithms",
    classId: ObjectId(),
    teacherId: ObjectId(),
    credits: 4,
    syllabus: "Arrays, Linked Lists, Stacks, Queues, Trees, Graphs",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- Grades Collection
db.grades.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    studentId: ObjectId("student1"),
    classId: ObjectId(),
    subjectId: ObjectId(),
    examType: "UNIT_TEST",
    grade: "A",
    marks: 85,
    totalMarks: 100,
    percentage: 85,
    remarks: "Excellent performance",
    teacherId: ObjectId(),
    date: new Date("2024-09-15"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    studentId: ObjectId("engineeringstudent"),
    classId: ObjectId(),
    subjectId: ObjectId(),
    examType: "SEMESTER_EXAM",
    grade: "A+",
    marks: 92,
    totalMarks: 100,
    percentage: 92,
    remarks: "Outstanding performance",
    teacherId: ObjectId("professor1"),
    date: new Date("2024-12-20"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("inter1"),
    studentId: ObjectId("interStudent"),
    classId: ObjectId(),
    subjectId: ObjectId(),
    examType: "UNIT_TEST",
    grade: "A-",
    marks: 87,
    totalMarks: 100,
    percentage: 87,
    remarks: "Strong analytical ability",
    teacherId: ObjectId(),
    date: new Date("2024-09-22"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("degree1"),
    studentId: ObjectId("degreeStudent"),
    classId: ObjectId(),
    subjectId: ObjectId(),
    examType: "SEMESTER_EXAM",
    grade: "B+",
    marks: 81,
    totalMarks: 100,
    percentage: 81,
    remarks: "Consistent performance",
    teacherId: ObjectId(),
    date: new Date("2024-11-05"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.grades.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    studentId: ObjectId("student1"),
    classId: ObjectId(),
    subjectId: ObjectId(),
    examType: "MODEL_TEST",
    grade: "A+",
    marks: 95,
    totalMarks: 100,
    percentage: 95,
    remarks: "Model Test excellence",
    teacherId: ObjectId(),
    date: new Date("2024-10-20"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    studentId: ObjectId("engineeringstudent"),
    classId: ObjectId(),
    subjectId: ObjectId(),
    examType: "INTERNAL_ASSESSMENT",
    grade: "A",
    marks: 88,
    totalMarks: 100,
    percentage: 88,
    remarks: "Strong concepts in core streams",
    teacherId: ObjectId("professor1"),
    date: new Date("2024-11-12"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("inter1"),
    studentId: ObjectId("interStudent"),
    classId: ObjectId(),
    subjectId: ObjectId(),
    examType: "UNIT_TEST",
    grade: "A",
    marks: 90,
    totalMarks: 100,
    percentage: 90,
    remarks: "Excellent analytical skills",
    teacherId: ObjectId(),
    date: new Date("2024-10-18"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("degree1"),
    studentId: ObjectId("degreeStudent"),
    classId: ObjectId(),
    subjectId: ObjectId(),
    examType: "MODEL_TEST",
    grade: "B",
    marks: 78,
    totalMarks: 100,
    percentage: 78,
    remarks: "Needs improvement in case studies",
    teacherId: ObjectId(),
    date: new Date("2024-10-25"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- Attendance Collection
db.attendance.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    studentId: ObjectId("student1"),
    classId: ObjectId(),
    date: new Date("2024-10-01"),
    status: "PRESENT",
    timeIn: new Date("2024-10-01T08:30:00"),
    timeOut: new Date("2024-10-01T15:30:00"),
    teacherId: ObjectId(),
    remarks: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    studentId: ObjectId("engineeringstudent"),
    classId: ObjectId(),
    date: new Date("2024-10-01"),
    status: "PRESENT",
    timeIn: new Date("2024-10-01T09:00:00"),
    timeOut: new Date("2024-10-01T16:00:00"),
    teacherId: ObjectId("professor1"),
    remarks: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("inter1"),
    studentId: ObjectId("interStudent"),
    classId: ObjectId(),
    date: new Date("2024-10-02"),
    status: "PRESENT",
    timeIn: new Date("2024-10-02T08:45:00"),
    timeOut: new Date("2024-10-02T15:00:00"),
    teacherId: ObjectId(),
    remarks: "Strong punctuality",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("degree1"),
    studentId: ObjectId("degreeStudent"),
    classId: ObjectId(),
    date: new Date("2024-10-02"),
    status: "PRESENT",
    timeIn: new Date("2024-10-02T09:30:00"),
    timeOut: new Date("2024-10-02T17:00:00"),
    teacherId: ObjectId(),
    remarks: "Lab session attended",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.attendance.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    studentId: ObjectId("student1"),
    classId: ObjectId(),
    date: new Date("2024-10-03"),
    status: "PRESENT",
    timeIn: new Date("2024-10-03T08:30:00"),
    timeOut: new Date("2024-10-03T15:30:00"),
    teacherId: ObjectId(),
    remarks: "Participated in science fair",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    studentId: ObjectId("engineeringstudent"),
    classId: ObjectId(),
    date: new Date("2024-10-03"),
    status: "PRESENT",
    timeIn: new Date("2024-10-03T09:00:00"),
    timeOut: new Date("2024-10-03T16:00:00"),
    teacherId: ObjectId("professor1"),
    remarks: "Completed lab assignment",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("inter1"),
    studentId: ObjectId("interStudent"),
    classId: ObjectId(),
    date: new Date("2024-10-04"),
    status: "PRESENT",
    timeIn: new Date("2024-10-04T08:45:00"),
    timeOut: new Date("2024-10-04T15:00:00"),
    teacherId: ObjectId(),
    remarks: "Attended IIT guidance session",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("degree1"),
    studentId: ObjectId("degreeStudent"),
    classId: ObjectId(),
    date: new Date("2024-10-04"),
    status: "PRESENT",
    timeIn: new Date("2024-10-04T09:30:00"),
    timeOut: new Date("2024-10-04T17:00:00"),
    teacherId: ObjectId(),
    remarks: "Laboratory workshop completed",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- EXAMINATION COLLECTION
-- ========================================

db.exams.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    name: "Unit Test 1",
    type: "UNIT_TEST",
    classId: ObjectId(),
    subjectId: ObjectId(),
    date: new Date("2024-09-15"),
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    maximumMarks: 100,
    passingMarks: 35,
    status: "COMPLETED",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    name: "Semester 4 Midterm",
    type: "SEMESTER_EXAM",
    classId: ObjectId(),
    subjectId: ObjectId(),
    date: new Date("2024-11-10"),
    startTime: "09:30 AM",
    endTime: "12:30 PM",
    maximumMarks: 100,
    passingMarks: 40,
    status: "COMPLETED",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- NOTIFICATION COLLECTION
-- ========================================

db.notifications.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    title: "Parent-Teacher Meeting",
    message: "PTM scheduled for 15th December 2024",
    type: "GENERAL",
    priority: "HIGH",
    recipients: ["PARENT", "TEACHER"],
    sentAt: new Date(),
    readBy: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    title: "Placement Drive",
    message: "Infosys placement drive on 20th December 2024",
    type: "PLACEMENT",
    priority: "HIGH",
    recipients: ["STUDENT"],
    sentAt: new Date(),
    readBy: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- FEES COLLECTION
-- ========================================

db.fees.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    studentId: ObjectId("student1"),
    feeType: "TUITION",
    amount: 15000,
    dueDate: new Date("2024-12-31"),
    status: "PAID",
    paymentDate: new Date("2024-12-15"),
    paymentMode: "ONLINE",
    receiptNumber: "REC20241215001",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    studentId: ObjectId("engineeringstudent"),
    feeType: "TUITION",
    amount: 75000,
    dueDate: new Date("2025-01-31"),
    status: "PENDING",
    paymentDate: null,
    paymentMode: null,
    receiptNumber: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- HRM (HUMAN RESOURCE MANAGEMENT) COLLECTION
-- ========================================

db.staff.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    userId: ObjectId(),
    employeeId: "EMP001",
    department: "Teaching",
    designation: "Senior Teacher",
    dateOfJoining: new Date("2019-06-15"),
    salary: 45000,
    bankDetails: {
      accountNumber: "1234567890",
      bankName: "State Bank of India",
      ifscCode: "SBIN0002499",
      branch: "Connaught Place"
    },
    emergencyContact: {
      name: "Rita Patel",
      relationship: "Spouse",
      phone: "+919876543211",
      address: "456 Family Residency, New Delhi"
    },
    documents: {
      aadharCard: "uploads/documents/emp001_aadhar.pdf",
      panCard: "uploads/documents/emp001_pan.pdf",
      qualificationCertificates: ["uploads/documents/emp001_msc.pdf", "uploads/documents/emp001_bed.pdf"],
      experienceLetters: ["uploads/documents/emp001_exp1.pdf"]
    },
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    userId: ObjectId(),
    employeeId: "PROF001",
    department: "Physics",
    designation: "Professor",
    dateOfJoining: new Date("2015-07-20"),
    salary: 120000,
    bankDetails: {
      accountNumber: "9876543210",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0000001",
      branch: "Salt Lake"
    },
    emergencyContact: {
      name: "Sunita Kumar",
      relationship: "Wife",
      phone: "+919876543222",
      address: "789 Academic Residency, Kolkata"
    },
    documents: {
      aadharCard: "uploads/documents/prof001_aadhar.pdf",
      panCard: "uploads/documents/prof001_pan.pdf",
      phdCertificate: "uploads/documents/prof001_phd.pdf",
      researchPapers: ["uploads/documents/prof001_paper1.pdf", "uploads/documents/prof001_paper2.pdf"]
    },
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- LIBRARY MANAGEMENT COLLECTION
-- ========================================

db.libraryBooks.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    isbn: "978-0134685991",
    title: "Mathematics for Class 10",
    author: "R.D. Sharma",
    publisher: "Dhanpat Rai Publications",
    edition: "2024",
    category: "Textbook",
    totalCopies: 50,
    availableCopies: 45,
    rackNumber: "A-10",
    price: 450,
    status: "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    isbn: "978-0132316811",
    title: "Data Structures and Algorithms",
    author: "Alfred V. Aho",
    publisher: "Pearson Education",
    edition: "2023",
    category: "Textbook",
    totalCopies: 30,
    availableCopies: 25,
    rackNumber: "C-204",
    price: 850,
    status: "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.libraryTransactions.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    bookId: ObjectId(),
    studentId: ObjectId("student1"),
    issuedBy: ObjectId(),
    issueDate: new Date("2024-10-10"),
    dueDate: new Date("2024-10-25"),
    returnDate: null,
    fineAmount: 0,
    status: "ISSUED",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    bookId: ObjectId(),
    studentId: ObjectId("engineeringstudent"),
    issuedBy: ObjectId(),
    issueDate: new Date("2024-11-05"),
    dueDate: new Date("2024-11-20"),
    returnDate: new Date("2024-11-18"),
    fineAmount: 0,
    status: "RETURNED",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- TRANSPORT MANAGEMENT COLLECTION
-- ========================================

db.transportRoutes.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    routeName: "North Delhi Route",
    routeCode: "ND001",
    pickupPoints: [
      { name: "Connaught Place", time: "07:30", latitude: 28.6315, longitude: 77.2167 },
      { name: "Karol Bagh", time: "07:45", latitude: 28.6496, longitude: 77.1920 },
      { name: "Rajouri Garden", time: "08:00", latitude: 28.6467, longitude: 77.1193 }
    ],
    dropPoints: [
      { name: "School Gate", time: "08:30", latitude: 28.6139, longitude: 77.2090 }
    ],
    totalDistance: 15.5,
    estimatedTime: "45 minutes",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    routeName: "Kolkata University Route",
    routeCode: "KU001",
    pickupPoints: [
      { name: "Salt Lake Sector V", time: "08:00", latitude: 22.5847, longitude: 88.4563 },
      { name: "Bidhannagar", time: "08:15", latitude: 22.5850, longitude: 88.4384 },
      { name: "New Town", time: "08:30", latitude: 22.6167, longitude: 88.4900 }
    ],
    dropPoints: [
      { name: "Campus Main Gate", time: "09:00", latitude: 22.5726, longitude: 88.3635 }
    ],
    totalDistance: 22.0,
    estimatedTime: "60 minutes",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.transportVehicles.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    vehicleNumber: "DL01AB1234",
    vehicleType: "Bus",
    capacity: 50,
    driverName: "Ramesh Kumar",
    driverLicense: "DL1234567890",
    contactNumber: "+919876543212",
    routeId: ObjectId(),
    status: "ACTIVE",
    lastServiceDate: new Date("2024-09-15"),
    nextServiceDate: new Date("2025-03-15"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    vehicleNumber: "WB01CD5678",
    vehicleType: "Bus",
    capacity: 60,
    driverName: "Arun Singh",
    driverLicense: "WB9876543210",
    contactNumber: "+919876543232",
    routeId: ObjectId(),
    status: "ACTIVE",
    lastServiceDate: new Date("2024-10-20"),
    nextServiceDate: new Date("2025-04-20"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.transportAssignments.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    studentId: ObjectId("student1"),
    vehicleId: ObjectId(),
    routeId: ObjectId(),
    pickupPoint: "Karol Bagh",
    dropPoint: "School Gate",
    assignmentDate: new Date("2024-04-01"),
    endDate: new Date("2025-03-31"),
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    studentId: ObjectId("engineeringstudent"),
    vehicleId: ObjectId(),
    routeId: ObjectId(),
    pickupPoint: "Salt Lake Sector V",
    dropPoint: "Campus Main Gate",
    assignmentDate: new Date("2022-08-01"),
    endDate: new Date("2026-07-31"),
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- HOSTEL MANAGEMENT COLLECTION
-- ========================================

db.hostels.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    name: "Boys Hostel A",
    type: "BOYS",
    totalRooms: 100,
    occupiedRooms: 95,
    capacity: 200,
    currentOccupancy: 190,
    facilities: ["Wi-Fi", "Gym", "Library", "Sports", "Laundry"],
    rules: ["No smoking", "Visitors allowed 4-6 PM", "Lights off 11 PM"],
    fees: {
      roomRent: 8000,
      messCharges: 4000,
      securityDeposit: 10000,
      totalMonthly: 12000
    },
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("degree1"),
    name: "Girls Hostel",
    type: "GIRLS",
    totalRooms: 50,
    occupiedRooms: 45,
    capacity: 100,
    currentOccupancy: 90,
    facilities: ["Wi-Fi", "Study Room", "Gym", "Laundry"],
    rules: ["No smoking", "Visitors allowed 3-5 PM", "Lights off 10:30 PM"],
    fees: {
      roomRent: 6000,
      messCharges: 3500,
      securityDeposit: 8000,
      totalMonthly: 9500
    },
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.hostelRooms.insertMany([
  {
    _id: ObjectId(),
    hostelId: ObjectId(),
    roomNumber: "A101",
    roomType: "AC",
    capacity: 2,
    currentOccupants: 2,
    amenities: ["AC", "Wi-Fi", "Study Table", "Attached Bathroom"],
    status: "OCCUPIED",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    hostelId: ObjectId(),
    roomNumber: "B205",
    roomType: "NON-AC",
    capacity: 3,
    currentOccupants: 2,
    amenities: ["Fan", "Wi-Fi", "Study Table", "Common Bathroom"],
    status: "PARTIALLY_OCCUPIED",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.hostelAssignments.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    studentId: ObjectId("engineeringstudent"),
    hostelId: ObjectId(),
    roomId: ObjectId(),
    roomNumber: "A101",
    admissionDate: new Date("2022-08-01"),
    releaseDate: null,
    status: "ACTIVE",
    feesPaid: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- INVENTORY MANAGEMENT COLLECTION
-- ========================================

db.inventoryItems.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    itemName: "Projector",
    category: "Electronics",
    quantity: 5,
    unitPrice: 25000,
    supplier: "Tech Solutions Ltd.",
    supplierContact: "+919876543213",
    reorderLevel: 2,
    location: "Admin Office",
    status: "IN_STOCK",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    itemName: "Lab Equipment Kit",
    category: "Laboratory",
    quantity: 15,
    unitPrice: 15000,
    supplier: "Scientific Instruments Co.",
    supplierContact: "+919876543242",
    reorderLevel: 5,
    location: "Physics Lab",
    status: "IN_STOCK",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.inventoryTransactions.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    itemId: ObjectId(),
    transactionType: "PURCHASE",
    quantity: 3,
    unitPrice: 25000,
    totalAmount: 75000,
    supplier: "Tech Solutions Ltd.",
    invoiceNumber: "INV20241001",
    receivedBy: ObjectId(),
    receivedDate: new Date("2024-10-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    itemId: ObjectId(),
    transactionType: "ISSUE",
    quantity: 1,
    issuedTo: ObjectId(),
    issuedBy: ObjectId(),
    issueDate: new Date("2024-11-15"),
    purpose: "Classroom use",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- CANTEEN MANAGEMENT COLLECTION
-- ========================================

db.canteenItems.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    itemName: "Sandwich",
    category: "Fast Food",
    price: 30,
    stock: 50,
    minStock: 10,
    supplier: "Fresh Foods",
    supplierContact: "+919876543214",
    status: "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    itemName: "Burger",
    category: "Fast Food",
    price: 40,
    stock: 30,
    minStock: 5,
    supplier: "Tasty Bites",
    supplierContact: "+919876543252",
    status: "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.canteenSales.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    studentId: ObjectId("student1"),
    itemId: ObjectId(),
    itemName: "Sandwich",
    quantity: 2,
    totalPrice: 60,
    saleDate: new Date("2024-10-15T12:30:00"),
    paymentMethod: "CASH",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    studentId: ObjectId("engineeringstudent"),
    itemId: ObjectId(),
    itemName: "Burger",
    quantity: 1,
    totalPrice: 40,
    saleDate: new Date("2024-11-20T13:15:00"),
    paymentMethod: "CARD",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- COMMUNICATION COLLECTION
-- ========================================

db.messages.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    senderId: ObjectId(),
    receiverId: ObjectId("parent1"),
    messageType: "NOTICE",
    subject: "Upcoming Sports Day",
    message: "Sports Day is scheduled for 25th December 2024. All parents are requested to attend.",
    priority: "HIGH",
    attachments: [],
    readStatus: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    senderId: ObjectId(),
    receiverId: ObjectId("engineeringstudent"),
    messageType: "ANNOUNCEMENT",
    subject: "Semester Results",
    message: "Semester 4 results have been declared. Please check your dashboard.",
    priority: "NORMAL",
    attachments: ["uploads/results/semester4.pdf"],
    readStatus: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.circulars.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    title: "Summer Vacation Notice",
    description: "Summer vacation will be from 15th May to 30th June 2025",
    circularType: "VACATION",
    issuedBy: ObjectId(),
    issuedDate: new Date("2025-04-01"),
    validFrom: new Date("2025-05-15"),
    validTo: new Date("2025-06-30"),
    attachments: ["uploads/circulars/summer_vacation.pdf"],
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    title: "Research Conference",
    description: "Annual Research Conference scheduled for 15th January 2025",
    circularType: "EVENT",
    issuedBy: ObjectId(),
    issuedDate: new Date("2024-12-01"),
    validFrom: new Date("2025-01-15"),
    validTo: new Date("2025-01-17"),
    attachments: ["uploads/circulars/research_conference.pdf"],
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- REGISTRATION REQUESTS COLLECTION
-- ========================================

db.registrationRequests.insertMany([
  {
    _id: ObjectId(),
    instituteType: "school",
    instituteCode: "NEW001",
    name: "Green Valley School",
    email: "admin@greenvalley.edu",
    password: "$2b$10$hashedpassword",
    confirmPassword: "$2b$10$hashedpassword",
    agreed: true,
    status: "pending",
    institutionId: null,
    assignedBy: null,
    assignedAt: null,
    completedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-01")
  },
  {
    _id: ObjectId(),
    instituteType: "engineering",
    instituteCode: "TECH001",
    name: "Tech University",
    email: "admin@techuniversity.edu",
    password: "$2b$10$hashedpassword",
    confirmPassword: "$2b$10$hashedpassword",
    agreed: true,
    status: "approved",
    institutionId: ObjectId("engineering1"),
    assignedBy: ObjectId("000000000000000000000001"),
    assignedAt: new Date("2024-11-15"),
    completedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-11-10"),
    updatedAt: new Date("2024-11-15")
  }
]);

-- ========================================
-- DASHBOARD METRICS COLLECTION
-- ========================================

db.dashboardMetrics.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    date: new Date("2024-11-30"),
    metrics: {
      totalStudents: 1200,
      totalTeachers: 85,
      totalStaff: 45,
      totalClasses: 25,
      totalSections: 50,
      todayPresent: 1150,
      todayAbsent: 50,
      attendancePercentage: 95.8,
      totalFeesCollected: 1250000,
      pendingFees: 250000,
      totalBooks: 5000,
      issuedBooks: 1200,
      totalVehicles: 15,
      totalHostels: 3,
      hostelOccupancy: 85,
      totalInventoryItems: 150,
      lowStockItems: 15,
      totalCanteenSales: 150000,
      monthlyRevenue: 2500000
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    date: new Date("2024-11-30"),
    metrics: {
      totalStudents: 3000,
      totalTeachers: 250,
      totalStaff: 150,
      totalClasses: 40,
      totalSections: 80,
      todayPresent: 2850,
      todayAbsent: 150,
      attendancePercentage: 95.0,
      totalFeesCollected: 8500000,
      pendingFees: 1200000,
      totalBooks: 15000,
      issuedBooks: 3200,
      totalVehicles: 25,
      totalHostels: 8,
      hostelOccupancy: 92,
      totalInventoryItems: 500,
      lowStockItems: 25,
      totalCanteenSales: 450000,
      monthlyRevenue: 12000000
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- SYSTEM CONFIGURATION COLLECTION
-- ========================================

db.systemConfig.insertOne({
  _id: ObjectId(),
  systemName: "UltraKeys EduSearch",
  version: "1.0.0",
  databaseVersion: "1.0",
  features: {
    dashboard: true,
    academic: true,
    attendance: true,
    fees: true,
    hrm: true,
    library: true,
    transport: true,
    hostel: true,
    examination: true,
    communication: true,
    inventory: true,
    canteen: true,
    reports: true,
    settings: true
  },
  modules: {
    premium: ["dashboard", "academic", "attendance", "fees", "hrm", "library", "transport", "examination", "communication"],
    enterprise: ["dashboard", "academic", "attendance", "fees", "hrm", "library", "transport", "hostel", "examination", "communication", "inventory", "canteen", "reports", "settings"]
  },
  settings: {
    maxFileSize: 10485760, -- 10MB
    allowedFileTypes: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
    sessionTimeout: 3600000, -- 1 hour in milliseconds
    maxLoginAttempts: 5,
    lockoutDuration: 900000, -- 15 minutes in milliseconds
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

-- ========================================
-- INDICES FOR PERFORMANCE
-- ========================================

-- Users collection indices
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "institutionId": 1 })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "status": 1 })

-- Institutions collection indices
db.institutions.createIndex({ "code": 1 }, { unique: true })
db.institutions.createIndex({ "email": 1 }, { unique: true })
db.institutions.createIndex({ "type": 1 })
db.institutions.createIndex({ "status": 1 })

-- Students collection indices
db.students.createIndex({ "userId": 1 }, { unique: true })
db.students.createIndex({ "institutionId": 1 })
db.students.createIndex({ "rollNumber": 1 })

-- Grades collection indices
db.grades.createIndex({ "studentId": 1 })
db.grades.createIndex({ "institutionId": 1 })
db.grades.createIndex({ "date": 1 })

-- Attendance collection indices
db.attendance.createIndex({ "studentId": 1, "date": 1 }, { unique: true })
db.attendance.createIndex({ "institutionId": 1 })
db.attendance.createIndex({ "date": 1 })

-- Fees collection indices
db.fees.createIndex({ "studentId": 1 })
db.fees.createIndex({ "institutionId": 1 })
db.fees.createIndex({ "dueDate": 1 })

-- Library transactions indices
db.libraryTransactions.createIndex({ "studentId": 1 })
db.libraryTransactions.createIndex({ "bookId": 1 })
db.libraryTransactions.createIndex({ "status": 1 })

-- Transport assignments indices
db.transportAssignments.createIndex({ "studentId": 1 }, { unique: true })
db.transportAssignments.createIndex({ "institutionId": 1 })

-- Hostel assignments indices
db.hostelAssignments.createIndex({ "studentId": 1 }, { unique: true })
db.hostelAssignments.createIndex({ "institutionId": 1 })

-- Registration requests indices
db.registrationRequests.createIndex({ "email": 1 }, { unique: true })
db.registrationRequests.createIndex({ "instituteCode": 1 }, { unique: true })
db.registrationRequests.createIndex({ "status": 1 })

-- Dashboard metrics indices
db.dashboardMetrics.createIndex({ "institutionId": 1, "date": 1 }, { unique: true })

print("MongoDB data structure successfully created with comprehensive collections!");
-- ========================================
-- HRM (HUMAN RESOURCE MANAGEMENT) COLLECTION
-- ========================================

db.staff.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    userId: ObjectId(),
    employeeId: "EMP001",
    department: "Teaching",
    designation: "Senior Teacher",
    dateOfJoining: new Date("2019-06-15"),
    salary: 45000,
    bankDetails: {
      accountNumber: "1234567890",
      bankName: "State Bank of India",
      ifscCode: "SBIN0002499",
      branch: "Connaught Place"
    },
    emergencyContact: {
      name: "Rita Patel",
      relationship: "Spouse",
      phone: "+919876543211",
      address: "456 Family Residency, New Delhi"
    },
    documents: {
      aadharCard: "uploads/documents/emp001_aadhar.pdf",
      panCard: "uploads/documents/emp001_pan.pdf",
      qualificationCertificates: ["uploads/documents/emp001_msc.pdf", "uploads/documents/emp001_bed.pdf"],
      experienceLetters: ["uploads/documents/emp001_exp1.pdf"]
    },
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    userId: ObjectId(),
    employeeId: "PROF001",
    department: "Physics",
    designation: "Professor",
    dateOfJoining: new Date("2015-07-20"),
    salary: 120000,
    bankDetails: {
      accountNumber: "9876543210",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0000001",
      branch: "Salt Lake"
    },
    emergencyContact: {
      name: "Sunita Kumar",
      relationship: "Wife",
      phone: "+919876543222",
      address: "789 Academic Residency, Kolkata"
    },
    documents: {
      aadharCard: "uploads/documents/prof001_aadhar.pdf",
      panCard: "uploads/documents/prof001_pan.pdf",
      phdCertificate: "uploads/documents/prof001_phd.pdf",
      researchPapers: ["uploads/documents/prof001_paper1.pdf", "uploads/documents/prof001_paper2.pdf"]
    },
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- LIBRARY MANAGEMENT COLLECTION
-- ========================================

db.libraryBooks.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    isbn: "978-0134685991",
    title: "Mathematics for Class 10",
    author: "R.D. Sharma",
    publisher: "Dhanpat Rai Publications",
    edition: "2024",
    category: "Textbook",
    totalCopies: 50,
    availableCopies: 45,
    rackNumber: "A-10",
    price: 450,
    status: "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    isbn: "978-0132316811",
    title: "Data Structures and Algorithms",
    author: "Alfred V. Aho",
    publisher: "Pearson Education",
    edition: "2023",
    category: "Textbook",
    totalCopies: 30,
    availableCopies: 25,
    rackNumber: "C-204",
    price: 850,
    status: "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.libraryTransactions.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    bookId: ObjectId(),
    studentId: ObjectId("student1"),
    issuedBy: ObjectId(),
    issueDate: new Date("2024-10-10"),
    dueDate: new Date("2024-10-25"),
    returnDate: null,
    fineAmount: 0,
    status: "ISSUED",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    bookId: ObjectId(),
    studentId: ObjectId("engineeringstudent"),
    issuedBy: ObjectId(),
    issueDate: new Date("2024-11-05"),
    dueDate: new Date("2024-11-20"),
    returnDate: new Date("2024-11-18"),
    fineAmount: 0,
    status: "RETURNED",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- TRANSPORT MANAGEMENT COLLECTION
-- ========================================

db.transportRoutes.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    routeName: "North Delhi Route",
    routeCode: "ND001",
    pickupPoints: [
      { name: "Connaught Place", time: "07:30", latitude: 28.6315, longitude: 77.2167 },
      { name: "Karol Bagh", time: "07:45", latitude: 28.6496, longitude: 77.1920 },
      { name: "Rajouri Garden", time: "08:00", latitude: 28.6467, longitude: 77.1193 }
    ],
    dropPoints: [
      { name: "School Gate", time: "08:30", latitude: 28.6139, longitude: 77.2090 }
    ],
    totalDistance: 15.5,
    estimatedTime: "45 minutes",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    routeName: "Kolkata University Route",
    routeCode: "KU001",
    pickupPoints: [
      { name: "Salt Lake Sector V", time: "08:00", latitude: 22.5847, longitude: 88.4563 },
      { name: "Bidhannagar", time: "08:15", latitude: 22.5850, longitude: 88.4384 },
      { name: "New Town", time: "08:30", latitude: 22.6167, longitude: 88.4900 }
    ],
    dropPoints: [
      { name: "Campus Main Gate", time: "09:00", latitude: 22.5726, longitude: 88.3635 }
    ],
    totalDistance: 22.0,
    estimatedTime: "60 minutes",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.transportVehicles.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    vehicleNumber: "DL01AB1234",
    vehicleType: "Bus",
    capacity: 50,
    driverName: "Ramesh Kumar",
    driverLicense: "DL1234567890",
    contactNumber: "+919876543212",
    routeId: ObjectId(),
    status: "ACTIVE",
    lastServiceDate: new Date("2024-09-15"),
    nextServiceDate: new Date("2025-03-15"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    vehicleNumber: "WB01CD5678",
    vehicleType: "Bus",
    capacity: 60,
    driverName: "Arun Singh",
    driverLicense: "WB9876543210",
    contactNumber: "+919876543232",
    routeId: ObjectId(),
    status: "ACTIVE",
    lastServiceDate: new Date("2024-10-20"),
    nextServiceDate: new Date("2025-04-20"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.transportAssignments.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    studentId: ObjectId("student1"),
    vehicleId: ObjectId(),
    routeId: ObjectId(),
    pickupPoint: "Karol Bagh",
    dropPoint: "School Gate",
    assignmentDate: new Date("2024-04-01"),
    endDate: new Date("2025-03-31"),
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    studentId: ObjectId("engineeringstudent"),
    vehicleId: ObjectId(),
    routeId: ObjectId(),
    pickupPoint: "Salt Lake Sector V",
    dropPoint: "Campus Main Gate",
    assignmentDate: new Date("2022-08-01"),
    endDate: new Date("2026-07-31"),
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- HOSTEL MANAGEMENT COLLECTION
-- ========================================

db.hostels.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    name: "Boys Hostel A",
    type: "BOYS",
    totalRooms: 100,
    occupiedRooms: 95,
    capacity: 200,
    currentOccupancy: 190,
    facilities: ["Wi-Fi", "Gym", "Library", "Sports", "Laundry"],
    rules: ["No smoking", "Visitors allowed 4-6 PM", "Lights off 11 PM"],
    fees: {
      roomRent: 8000,
      messCharges: 4000,
      securityDeposit: 10000,
      totalMonthly: 12000
    },
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("degree1"),
    name: "Girls Hostel",
    type: "GIRLS",
    totalRooms: 50,
    occupiedRooms: 45,
    capacity: 100,
    currentOccupancy: 90,
    facilities: ["Wi-Fi", "Study Room", "Gym", "Laundry"],
    rules: ["No smoking", "Visitors allowed 3-5 PM", "Lights off 10:30 PM"],
    fees: {
      roomRent: 6000,
      messCharges: 3500,
      securityDeposit: 8000,
      totalMonthly: 9500
    },
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.hostelRooms.insertMany([
  {
    _id: ObjectId(),
    hostelId: ObjectId(),
    roomNumber: "A101",
    roomType: "AC",
    capacity: 2,
    currentOccupants: 2,
    amenities: ["AC", "Wi-Fi", "Study Table", "Attached Bathroom"],
    status: "OCCUPIED",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    hostelId: ObjectId(),
    roomNumber: "B205",
    roomType: "NON-AC",
    capacity: 3,
    currentOccupants: 2,
    amenities: ["Fan", "Wi-Fi", "Study Table", "Common Bathroom"],
    status: "PARTIALLY_OCCUPIED",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.hostelAssignments.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    studentId: ObjectId("engineeringstudent"),
    hostelId: ObjectId(),
    roomId: ObjectId(),
    roomNumber: "A101",
    admissionDate: new Date("2022-08-01"),
    releaseDate: null,
    status: "ACTIVE",
    feesPaid: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- INVENTORY MANAGEMENT COLLECTION
-- ========================================

db.inventoryItems.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    itemName: "Projector",
    category: "Electronics",
    quantity: 5,
    unitPrice: 25000,
    supplier: "Tech Solutions Ltd.",
    supplierContact: "+919876543213",
    reorderLevel: 2,
    location: "Admin Office",
    status: "IN_STOCK",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    itemName: "Lab Equipment Kit",
    category: "Laboratory",
    quantity: 15,
    unitPrice: 15000,
    supplier: "Scientific Instruments Co.",
    supplierContact: "+919876543242",
    reorderLevel: 5,
    location: "Physics Lab",
    status: "IN_STOCK",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.inventoryTransactions.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    itemId: ObjectId(),
    transactionType: "PURCHASE",
    quantity: 3,
    unitPrice: 25000,
    totalAmount: 75000,
    supplier: "Tech Solutions Ltd.",
    invoiceNumber: "INV20241001",
    receivedBy: ObjectId(),
    receivedDate: new Date("2024-10-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    itemId: ObjectId(),
    transactionType: "ISSUE",
    quantity: 1,
    issuedTo: ObjectId(),
    issuedBy: ObjectId(),
    issueDate: new Date("2024-11-15"),
    purpose: "Classroom use",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- CANTEEN MANAGEMENT COLLECTION
-- ========================================

db.canteenItems.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    itemName: "Sandwich",
    category: "Fast Food",
    price: 30,
    stock: 50,
    minStock: 10,
    supplier: "Fresh Foods",
    supplierContact: "+919876543214",
    status: "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    itemName: "Burger",
    category: "Fast Food",
    price: 40,
    stock: 30,
    minStock: 5,
    supplier: "Tasty Bites",
    supplierContact: "+919876543252",
    status: "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.canteenSales.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    studentId: ObjectId("student1"),
    itemId: ObjectId(),
    itemName: "Sandwich",
    quantity: 2,
    totalPrice: 60,
    saleDate: new Date("2024-10-15T12:30:00"),
    paymentMethod: "CASH",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    studentId: ObjectId("engineeringstudent"),
    itemId: ObjectId(),
    itemName: "Burger",
    quantity: 1,
    totalPrice: 40,
    saleDate: new Date("2024-11-20T13:15:00"),
    paymentMethod: "CARD",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- COMMUNICATION COLLECTION
-- ========================================

db.messages.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    senderId: ObjectId(),
    receiverId: ObjectId("parent1"),
    messageType: "NOTICE",
    subject: "Upcoming Sports Day",
    message: "Sports Day is scheduled for 25th December 2024. All parents are requested to attend.",
    priority: "HIGH",
    attachments: [],
    readStatus: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    senderId: ObjectId(),
    receiverId: ObjectId("engineeringstudent"),
    messageType: "ANNOUNCEMENT",
    subject: "Semester Results",
    message: "Semester 4 results have been declared. Please check your dashboard.",
    priority: "NORMAL",
    attachments: ["uploads/results/semester4.pdf"],
    readStatus: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.circulars.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    title: "Summer Vacation Notice",
    description: "Summer vacation will be from 15th May to 30th June 2025",
    circularType: "VACATION",
    issuedBy: ObjectId(),
    issuedDate: new Date("2025-04-01"),
    validFrom: new Date("2025-05-15"),
    validTo: new Date("2025-06-30"),
    attachments: ["uploads/circulars/summer_vacation.pdf"],
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    title: "Research Conference",
    description: "Annual Research Conference scheduled for 15th January 2025",
    circularType: "EVENT",
    issuedBy: ObjectId(),
    issuedDate: new Date("2024-12-01"),
    validFrom: new Date("2025-01-15"),
    validTo: new Date("2025-01-17"),
    attachments: ["uploads/circulars/research_conference.pdf"],
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- REGISTRATION REQUESTS COLLECTION
-- ========================================

db.registrationRequests.insertMany([
  {
    _id: ObjectId(),
    instituteType: "school",
    instituteCode: "NEW001",
    name: "Green Valley School",
    email: "admin@greenvalley.edu",
    password: "$2b$10$hashedpassword",
    confirmPassword: "$2b$10$hashedpassword",
    agreed: true,
    status: "pending",
    institutionId: null,
    assignedBy: null,
    assignedAt: null,
    completedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-01")
  },
  {
    _id: ObjectId(),
    instituteType: "engineering",
    instituteCode: "TECH001",
    name: "Tech University",
    email: "admin@techuniversity.edu",
    password: "$2b$10$hashedpassword",
    confirmPassword: "$2b$10$hashedpassword",
    agreed: true,
    status: "approved",
    institutionId: ObjectId("engineering1"),
    assignedBy: ObjectId("000000000000000000000001"),
    assignedAt: new Date("2024-11-15"),
    completedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-11-10"),
    updatedAt: new Date("2024-11-15")
  }
]);

-- ========================================
-- DASHBOARD METRICS COLLECTION
-- ========================================

db.dashboardMetrics.insertMany([
  {
    _id: ObjectId(),
    institutionId: ObjectId("school1"),
    date: new Date("2024-11-30"),
    metrics: {
      totalStudents: 1200,
      totalTeachers: 85,
      totalStaff: 45,
      totalClasses: 25,
      totalSections: 50,
      todayPresent: 1150,
      todayAbsent: 50,
      attendancePercentage: 95.8,
      totalFeesCollected: 1250000,
      pendingFees: 250000,
      totalBooks: 5000,
      issuedBooks: 1200,
      totalVehicles: 15,
      totalHostels: 3,
      hostelOccupancy: 85,
      totalInventoryItems: 150,
      lowStockItems: 15,
      totalCanteenSales: 150000,
      monthlyRevenue: 2500000
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    institutionId: ObjectId("engineering1"),
    date: new Date("2024-11-30"),
    metrics: {
      totalStudents: 3000,
      totalTeachers: 250,
      totalStaff: 150,
      totalClasses: 40,
      totalSections: 80,
      todayPresent: 2850,
      todayAbsent: 150,
      attendancePercentage: 95.0,
      totalFeesCollected: 8500000,
      pendingFees: 1200000,
      totalBooks: 15000,
      issuedBooks: 3200,
      totalVehicles: 25,
      totalHostels: 8,
      hostelOccupancy: 92,
      totalInventoryItems: 500,
      lowStockItems: 25,
      totalCanteenSales: 450000,
      monthlyRevenue: 12000000
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- ========================================
-- SYSTEM CONFIGURATION COLLECTION
-- ========================================

db.systemConfig.insertOne({
  _id: ObjectId(),
  systemName: "UltraKeys EduSearch",
  version: "1.0.0",
  databaseVersion: "1.0",
  features: {
    dashboard: true,
    academic: true,
    attendance: true,
    fees: true,
    hrm: true,
    library: true,
    transport: true,
    hostel: true,
    examination: true,
    communication: true,
    inventory: true,
    canteen: true,
    reports: true,
    settings: true
  },
  modules: {
    premium: ["dashboard", "academic", "attendance", "fees", "hrm", "library", "transport", "examination", "communication"],
    enterprise: ["dashboard", "academic", "attendance", "fees", "hrm", "library", "transport", "hostel", "examination", "communication", "inventory", "canteen", "reports", "settings"]
  },
  settings: {
    maxFileSize: 10485760, -- 10MB
    allowedFileTypes: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
    sessionTimeout: 3600000, -- 1 hour in milliseconds
    maxLoginAttempts: 5,
    lockoutDuration: 900000, -- 15 minutes in milliseconds
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

-- ========================================
-- INDICES FOR PERFORMANCE
-- ========================================

-- Users collection indices
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "institutionId": 1 })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "status": 1 })

-- Institutions collection indices
db.institutions.createIndex({ "code": 1 }, { unique: true })
db.institutions.createIndex({ "email": 1 }, { unique: true })
db.institutions.createIndex({ "type": 1 })
db.institutions.createIndex({ "status": 1 })

-- Students collection indices
db.students.createIndex({ "userId": 1 }, { unique: true })
db.students.createIndex({ "institutionId": 1 })
db.students.createIndex({ "rollNumber": 1 })

-- Grades collection indices
db.grades.createIndex({ "studentId": 1 })
db.grades.createIndex({ "institutionId": 1 })
db.grades.createIndex({ "date": 1 })

-- Attendance collection indices
db.attendance.createIndex({ "studentId": 1, "date": 1 }, { unique: true })
db.attendance.createIndex({ "institutionId": 1 })
db.attendance.createIndex({ "date": 1 })

-- Fees collection indices
db.fees.createIndex({ "studentId": 1 })
db.fees.createIndex({ "institutionId": 1 })
db.fees.createIndex({ "dueDate": 1 })

-- Library transactions indices
db.libraryTransactions.createIndex({ "studentId": 1 })
db.libraryTransactions.createIndex({ "bookId": 1 })
db.libraryTransactions.createIndex({ "status": 1 })

-- Transport assignments indices
db.transportAssignments.createIndex({ "studentId": 1 }, { unique: true })
db.transportAssignments.createIndex({ "institutionId": 1 })

-- Hostel assignments indices
db.hostelAssignments.createIndex({ "studentId": 1 }, { unique: true })
db.hostelAssignments.createIndex({ "institutionId": 1 })

-- Registration requests indices
db.registrationRequests.createIndex({ "email": 1 }, { unique: true })
db.registrationRequests.createIndex({ "instituteCode": 1 }, { unique: true })
db.registrationRequests.createIndex({ "status": 1 })

-- Dashboard metrics indices
db.dashboardMetrics.createIndex({ "institutionId": 1, "date": 1 }, { unique: true })

print("MongoDB data structure successfully created with comprehensive collections!");
