import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Subscription from '../models/Subscription.js';
import Transaction from '../models/Transaction.js';
import School from '../models/School.js';

dotenv.config();

const seedSubscriptions = async () => {
  try {
    await connectDB();

    await Subscription.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing subscriptions and transactions');

    const schools = await School.find().limit(10);
    
    if (schools.length === 0) {
      console.log('No schools found. Please seed schools first.');
      process.exit(1);
    }

    const plans = [
      {
        id: 'basic',
        name: 'Basic',
        price: 29,
        studentLimit: 100,
        userLimit: 5,
        features: ['Core dashboards', 'Student management', 'Teacher management'],
        enabledModules: ['dashboards', 'students', 'teachers', 'academics', 'attendance']
      },
      {
        id: 'medium',
        name: 'Medium',
        price: 79,
        studentLimit: 500,
        userLimit: 20,
        features: ['Everything in Basic', 'Parent management', 'Exams & results', 'Fees management'],
        enabledModules: ['dashboards', 'students', 'parents', 'teachers', 'academics', 'attendance', 'exams', 'fees']
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 199,
        studentLimit: 2000,
        userLimit: 100,
        features: ['Everything in Medium', 'Transport', 'Hostel', 'HR & payroll', 'API access'],
        enabledModules: ['dashboards', 'students', 'parents', 'teachers', 'academics', 'attendance', 'exams', 'fees', 'transport', 'hostel', 'hr']
      }
    ];

    const statuses = ['active', 'active', 'active', 'active', 'trial', 'suspended', 'expired'];
    const billingCycles = ['monthly', 'monthly', 'monthly', 'yearly'];

    const subscriptions = [];
    const transactions = [];

    for (let i = 0; i < schools.length; i++) {
      const school = schools[i];
      const plan = plans[i % 3];
      const status = statuses[i % statuses.length];
      const billingCycle = billingCycles[i % billingCycles.length];

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6));

      const endDate = new Date(startDate);
      if (billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      if (status === 'expired') {
        endDate.setMonth(endDate.getMonth() - 2);
      }

      let price = plan.price;
      if (billingCycle === 'yearly') {
        price = price * 12 * 0.85;
      }

      const subscription = new Subscription({
        schoolId: school._id,
        planId: plan.id,
        planName: plan.name,
        status,
        billingCycle,
        price,
        currency: 'USD',
        startDate,
        endDate,
        autoRenew: status === 'active',
        features: plan.features,
        enabledModules: plan.enabledModules,
        limits: {
          studentLimit: plan.studentLimit,
          userLimit: plan.userLimit
        },
        usage: {
          studentCount: Math.floor(Math.random() * plan.studentLimit * 0.7),
          userCount: Math.floor(Math.random() * plan.userLimit * 0.8)
        },
        paymentMethod: {
          type: ['card', 'bank_transfer', 'paypal'][Math.floor(Math.random() * 3)],
          lastFour: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
          brand: ['Visa', 'Mastercard', 'Amex'][Math.floor(Math.random() * 3)]
        }
      });

      if (status === 'cancelled') {
        subscription.cancelledAt = new Date();
        subscription.cancelReason = 'Downgrading to lower plan';
      }

      if (status === 'trial') {
        subscription.trialEndDate = new Date();
        subscription.trialEndDate.setDate(subscription.trialEndDate.getDate() + 14);
      }

      subscriptions.push(subscription);

      school.subscriptionPlan = plan.id;
      school.subscriptionExpiry = endDate;
      await school.save();

      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const invoiceId = `INV-${new Date().getFullYear()}-${String(1000 + i).slice(-6)}`;

      const transaction = new Transaction({
        transactionId,
        schoolId: school._id,
        subscriptionId: subscription._id,
        invoiceId,
        type: 'subscription',
        description: `${billingCycle === 'yearly' ? 'Annual' : 'Monthly'} subscription - ${plan.name} Plan`,
        amount: price,
        currency: 'USD',
        status: status === 'active' || status === 'trial' ? 'completed' : status === 'suspended' ? 'failed' : 'completed',
        paymentMethod: subscription.paymentMethod.type,
        paymentDetails: {
          cardBrand: subscription.paymentMethod.brand,
          lastFour: subscription.paymentMethod.lastFour,
          transactionReference: `ref_${Math.random().toString(36).substr(2, 12)}`
        },
        metadata: {
          planId: plan.id,
          planName: plan.name,
          billingCycle
        },
        processedAt: startDate
      });

      transactions.push(transaction);
    }

    await Subscription.insertMany(subscriptions);
    await Transaction.insertMany(transactions);

    console.log(`✓ Created ${subscriptions.length} subscriptions`);
    console.log(`✓ Created ${transactions.length} transactions`);
    console.log('Subscription seeding completed successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding subscriptions:', error);
    process.exit(1);
  }
};

seedSubscriptions();
