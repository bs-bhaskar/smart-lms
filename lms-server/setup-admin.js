const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';
const name = process.env.ADMIN_NAME || 'Initial Admin';
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Missing required ADMIN_EMAIL or ADMIN_PASSWORD in environment.');
  process.exit(1);
}

async function setupAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      process.exit(0);
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.error('A user with ADMIN_EMAIL already exists.');
      process.exit(1);
    }

    const registrationNumber = `ADMIN${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      registrationNumber,
      role: 'admin',
      emailVerified: true,
    });

    console.log('Admin created successfully:', {
      id: admin._id.toString(),
      email: admin.email,
      registrationNumber: admin.registrationNumber,
    });
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

setupAdmin();
