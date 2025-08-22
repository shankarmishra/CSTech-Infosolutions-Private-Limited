const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up MERN Machine Test Application...\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
  const envContent = `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-machine-test
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d`;
  
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created successfully');
} else {
  console.log('✅ .env file already exists');
}

// Check if uploads directory exists
if (!fs.existsSync('uploads')) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync('uploads');
  console.log('✅ uploads directory created successfully');
} else {
  console.log('✅ uploads directory already exists');
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm run install-client', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Seed the database
console.log('\n🌱 Seeding database...');
try {
  execSync('node scripts/seed.js', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully');
} catch (error) {
  console.error('❌ Failed to seed database');
  console.log('💡 Make sure MongoDB is running');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Run "npm run dev" to start the application');
console.log('3. Open http://localhost:3000 in your browser');
console.log('4. Login with admin@example.com / admin123');
console.log('\n📁 Sample data file: sample-data.csv');
console.log('📖 For more information, see README.md'); 