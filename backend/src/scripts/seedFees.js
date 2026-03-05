import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Fee from '../models/Fee.js';
import User from '../models/User.js';

dotenv.config();

const seedFees = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const schoolId = new mongoose.Types.ObjectId();

    await Fee.deleteMany({});
    console.log('Cleared existing fee data');

    let students = await User.find({ role: 'student' }).limit(30);

    if (students.length === 0) {
      const studentData = [];
      for (let i = 1; i <= 30; i++) {
        studentData.push({
          _id: new mongoose.Types.ObjectId(),
          schoolId,
          name: `Student ${i}`,
          email: `student${i}@school.com`,
          role: 'student',
          classId: `Class ${Math.ceil(i / 10)}`,
          isActive: true
        });
      }
      students = await User.insertMany(studentData);
      console.log('Created sample students');
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;

    const feeTypes = ['tuition', 'transport', 'library', 'sports', 'exam'];
    const terms = ['term1', 'term2', 'term3'];
    const fees = [];

    students.forEach((student, index) => {
      feeTypes.forEach((feeType, typeIndex) => {
        const baseAmount = feeType === 'tuition' ? 5000 : feeType === 'transport' ? 1000 : 500;
        const dueDay = 5 + typeIndex;
        const dueDate = new Date(currentYear, currentMonth - 1, dueDay);
        
        const isPaid = index < 20;
        const isPartial = index >= 20 && index < 25;
        const paidAmount = isPaid ? baseAmount : isPartial ? baseAmount * 0.5 : 0;

        fees.push({
          schoolId,
          studentId: student._id,
          feeType,
          amount: baseAmount,
          dueDate,
          status: isPaid ? 'paid' : isPartial ? 'partial' : index >= 28 ? 'overdue' : 'pending',
          paidAmount,
          remainingAmount: baseAmount - paidAmount,
          currency: 'USD',
          academicYear,
          term: terms[Math.floor(typeIndex / 2)],
          month: currentMonth,
          year: currentYear,
          paymentHistory: isPaid || isPartial ? [{
            amount: paidAmount,
            paymentDate: new Date(currentYear, currentMonth - 1, dueDay + 2),
            paymentMethod: 'online',
            transactionId: `TXN${Date.now()}${index}${typeIndex}`,
            receivedBy: new mongoose.Types.ObjectId()
          }] : [],
          discount: index < 5 ? 100 : 0,
          discountReason: index < 5 ? 'Merit scholarship' : '',
          lateFee: index >= 28 ? 50 : 0,
          remindersSent: index >= 25 ? 2 : 0,
          lastReminderDate: index >= 25 ? new Date() : null,
          isActive: true
        });
      });
    });

    await Fee.insertMany(fees);
    console.log(`Created ${fees.length} fee records`);

    const stats = {
      totalFees: fees.length,
      paid: fees.filter(f => f.status === 'paid').length,
      partial: fees.filter(f => f.status === 'partial').length,
      pending: fees.filter(f => f.status === 'pending').length,
      overdue: fees.filter(f => f.status === 'overdue').length,
      totalExpected: fees.reduce((sum, f) => sum + f.amount, 0),
      totalCollected: fees.reduce((sum, f) => sum + f.paidAmount, 0)
    };

    console.log('\nFee seed data created successfully');
    console.log(`School ID: ${schoolId}`);
    console.log(`Total Fees: ${stats.totalFees}`);
    console.log(`Paid: ${stats.paid}`);
    console.log(`Partial: ${stats.partial}`);
    console.log(`Pending: ${stats.pending}`);
    console.log(`Overdue: ${stats.overdue}`);
    console.log(`Total Expected: $${stats.totalExpected}`);
    console.log(`Total Collected: $${stats.totalCollected}`);
    console.log(`Collection Rate: ${Math.round((stats.totalCollected / stats.totalExpected) * 100)}%`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding fee data:', error);
    process.exit(1);
  }
};

seedFees();
