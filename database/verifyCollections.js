import mongoose from 'mongoose';

const verifyCollections = async () => {
  try {
    // Connect to MongoDB Atlas
    const mongoUri = 'mongodb+srv://vinays15201718_db_user:01466@cluster0.yjvqwsf.mongodb.net/edusearch?retryWrites=true&w=majority';
    console.log('🔗 Connecting to MongoDB Atlas...');

    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    console.log(`\n📊 Total collections found: ${collectionNames.length}`);
    console.log('\n📋 All collections in edusearch database:');

    // Group collections
    const existingCollections = ['organizations', 'users'];
    const newCollections = ['classes', 'subjects', 'attendance', 'exams', 'results', 'fee_structures', 'payments', 'announcements', 'messages', 'audit_logs', 'settings'];

    collectionNames.forEach(name => {
      const isExisting = existingCollections.includes(name.toLowerCase());
      const isNew = newCollections.includes(name.toLowerCase());
      const marker = isExisting ? '📁' : (isNew ? '🆕' : '📄');
      console.log(`   ${marker} ${name}`);
    });

    console.log('\n🔍 Checking specific collections:');

    // Check if our new collections exist
    for (const collectionName of newCollections) {
      try {
        const count = await mongoose.connection.db.collection(collectionName).countDocuments();
        console.log(`   ✅ ${collectionName}: ${count} documents`);
      } catch (error) {
        console.log(`   ❌ ${collectionName}: Collection not found`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('authentication failed')) {
      console.log('\n🔐 Authentication failed - check your credentials');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
};

verifyCollections();
