const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    const token = generateToken(user.id);
    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = generateToken(user.id);
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, currency, theme } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (currency) updates.currency = currency;
    if (theme) updates.theme = theme;
    if (req.body.password) updates.password = req.body.password;
    await req.user.update(updates);
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
