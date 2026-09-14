const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');
const { authenticateJWT } = require('../middleware/auth');
const { getJwtSecretOrThrow } = require('../utils/jwt');

function validateRequiredFields(requiredFields) {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }

    next();
  };
}

function validatePasswordStrength(req, res, next) {
  if (!req.body.newPassword && !req.body.password) {
    return next();
  }

  const password = req.body.newPassword || req.body.password;
  if (String(password).length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one number' });
  }

  next();
}

router.post('/login', validateRequiredFields(['password']), async (req, res) => {
  const { email, regNumber, password } = req.body;

  if ((!email && !regNumber) || !password) {
    return res.status(400).json({ message: 'Email or registration number and password are required' });
  }

  try {
    const user = await User.findOne({
      $or: [
        { email: email || undefined },
        { registrationNumber: regNumber || undefined }
      ]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, registrationNumber: user.registrationNumber },
      getJwtSecretOrThrow(),
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        registrationNumber: user.registrationNumber,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Auth login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', validateRequiredFields(['name', 'email', 'password']), validatePasswordStrength, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const registrationNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      registrationNumber,
      role: 'student',
      emailVerified: true
    });

    res.status(201).json({ message: 'Registration successful', registrationNumber });
  } catch (err) {
    console.error('Auth register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot-password', validateRequiredFields(['email']), async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(email, 'LMS Password Reset OTP', `Your OTP is: ${otp}`);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Auth forgot-password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', validateRequiredFields(['regNumber', 'otp', 'newPassword']), validatePasswordStrength, async (req, res) => {
  const { regNumber, otp, newPassword } = req.body;

  if (!regNumber || !otp || !newPassword) {
    return res.status(400).json({ message: 'Registration number, OTP, and new password are required' });
  }

  try {
    const user = await User.findOne({ registrationNumber: regNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.otp || !user.otpExpires || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Auth reset-password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/change-password', authenticateJWT, validateRequiredFields(['currentPassword', 'newPassword']), validatePasswordStrength, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Auth change-password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
