import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ATLAS CONNECTION STRING - Updated with your MongoDB Atlas credentials
const ATLAS_URI = 'mongodb+srv://vinays15201718_db_user:01466@cluster0.yjvqwsf.mongodb.net/edusearch?retryWrites=true&w=majority';

const createCollections = async () => {
  try {
    // Connect to MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI || ATLAS_URI;
    console.log('🔗 Connecting to MongoDB Atlas...');

    if (mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
      console.error('❌ ERROR: Please update the ATLAS_URI with your actual MongoDB Atlas credentials!');
      console.log('\n📝 To fix this:');
      console.log('1. Go to MongoDB Atlas dashboard');
      console.log('2. Click "Connect" on your cluster');
      console.log('3. Choose "Connect your application"');
      console.log('4. Copy the connection string');
      console.log('5. Replace ATLAS_URI in this script with your connection string');
      console.log('\nExample: mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/edusearch?retryWrites=true&w=majority');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas successfully');

    // Get database name from URI
    const dbName = mongoUri.split('/').pop().split('?')[0] || 'edusearch';
    console.log(`📊 Working with database: ${dbName}`);

    // Read the JSON schema file
    const schemaPath = path.join(__dirname, 'mongodb-data-structure.json');
    const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    console.log('📖 Loaded schema configuration');

    // Get collections to create (skip existing ones)
    const collectionsToCreate = Object.entries(schemaData.collections).filter(
      ([collectionName]) => !['organizations', 'users'].includes(collectionName)
    );

    console.log(`🏗️  Will create ${collectionsToCreate.length} new collections`);
    console.log('📋 Existing collections to skip: organizations, users');

    // Create collections
    for (const [collectionName, collectionConfig] of collectionsToCreate) {
      try {
        console.log(`\n🔧 Creating collection: ${collectionName}`);
        console.log(`   Description: ${collectionConfig.description}`);

        // Create collection with validation schema
        const db = mongoose.connection.db;

        const createOptions = {
          validator: {
            $jsonSchema: collectionConfig.schema
          }
        };

        await db.createCollection(collectionName, createOptions);
        console.log(`   ✅ Collection '${collectionName}' created with validation schema`);

        // Create indexes
        if (collectionConfig.indexes && collectionConfig.indexes.length > 0) {
          console.log(`   📊 Creating ${collectionConfig.indexes.length} indexes...`);
          for (const indexSpec of collectionConfig.indexes) {
            await db.collection(collectionName).createIndex(indexSpec.key, indexSpec);
          }
          console.log(`   ✅ Indexes created for '${collectionName}'`);
        } else {
          console.log(`   ℹ️  No indexes defined for '${collectionName}'`);
        }

      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`   ⚠️  Collection '${collectionName}' already exists, skipping...`);
        } else {
          console.error(`   ❌ Error creating collection '${collectionName}':`, error.message);
          // Continue with other collections
        }
      }
    }

    // Verify created collections
    console.log('\n🔍 Verifying created collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    console.log('📋 Collections in your Atlas database:');
    collectionNames.forEach(name => {
      const isNew = collectionsToCreate.some(([colName]) => colName === name);
      console.log(`   ${isNew ? '🆕' : '📁'} ${name}`);
    });

    console.log('\n🎉 Database setup completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Database: ${dbName} (Atlas)`);
    console.log(`   - Total collections: ${collectionNames.length}`);
    console.log(`   - New collections created: ${collectionsToCreate.length}`);
    console.log(`   - Existing collections preserved: 2 (organizations, users)`);

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    if (error.message.includes('authentication failed')) {
      console.log('\n🔐 Authentication failed! Please check your MongoDB Atlas credentials.');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('\n🌐 Network error! Please check your internet connection and Atlas cluster URL.');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⚠️  Received SIGINT, closing database connection...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  Received SIGTERM, closing database connection...');
  await mongoose.connection.close();
  process.exit(0);
});

createCollections();
