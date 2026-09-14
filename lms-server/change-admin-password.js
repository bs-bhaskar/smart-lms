const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const newEmail = process.env.ADMIN_NEW_EMAIL;
const newPassword = process.env.ADMIN_NEW_PASSWORD;

if (!newEmail || !newPassword) {
  console.error('Missing ADMIN_NEW_EMAIL or ADMIN_NEW_PASSWORD in .env');
  process.exit(1);
}

async function changeAdminCredentials() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      console.error('Admin not found');
      return;
    }

    admin.email = newEmail;
    admin.password = await bcrypt.hash(newPassword, 10);

    await admin.save();

    console.log('Admin email and password changed successfully');
    console.log('New Admin email:', admin.email);
  } catch (error) {
    console.error('Failed to change admin credentials:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

changeAdminCredentials();