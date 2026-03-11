import mongoose from 'mongoose';

const testConnection = async () => {
  try {
    console.log('🔗 Testing connection to MongoDB Atlas...');

    const mongoUri = 'mongodb+srv://vinays15201718_db_user:01466@cluster0.yjvqwsf.mongodb.net/edusearch?retryWrites=true&w=majority';

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    console.log('✅ Successfully connected to Atlas!');

    // List all databases
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log('\n📊 Available databases:');
    dbs.databases.forEach(db => {
      console.log(`   - ${db.name}`);
    });

    // Check current database collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📋 Collections in 'edusearch' database: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

  } catch (error) {
    console.error('❌ Connection failed:', error.message);

    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🌐 Possible issues:');
      console.log('   - Internet connection problems');
      console.log('   - Firewall blocking MongoDB Atlas');
      console.log('   - Atlas cluster may be paused');
      console.log('   - DNS resolution issues');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n🔐 Authentication failed - check credentials');
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 Connection closed');
    }
  }
};

testConnection();
