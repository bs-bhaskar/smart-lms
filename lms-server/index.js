const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const { getEnvConfig, validateEnv } = require('./config/env');
const { connectDatabase } = require('./config/database');

const User = require('./models/User');
const bcrypt = require('bcryptjs');

/* =========================
   CREATE ADMIN FUNCTION
========================= */
async function createAdminIfNotExists() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('Admin credentials not set');
    return;
  }

  const admin = await User.findOne({ email: adminEmail, role: 'admin' });
  if (admin) {
    console.log('Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
  name: 'Admin',
  email: adminEmail,
  password: hashedPassword,
  role: 'admin',
  registrationNumber: 'ADMIN', // ✅ REQUIRED FIX
  emailVerified: true,
});

  console.log('✅ Admin created');
}

/* =========================
   START SERVER
========================= */
async function startServer() {
  try {
    const config = getEnvConfig();
    validateEnv(config);

    await connectDatabase(config.MONGO_URI);
    await createAdminIfNotExists(); // ✅ NOW THIS WORKS

    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
}

startServer();