const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('🔍 Testing MongoDB Atlas Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
console.log('');

const mongooseOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB Atlas Connected');
    console.log('📊 Database Name:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Connection State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    console.log('\n🎉 Your Atlas setup is working perfectly!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED! MongoDB Connection Error');
    console.error('Error Message:', err.message);
    console.error('\n💡 Possible Issues:');
    console.error('   1. Check if IP is whitelisted in Atlas (0.0.0.0/0)');
    console.error('   2. Verify username and password');
    console.error('   3. Check if cluster is active');
    process.exit(1);
  });
