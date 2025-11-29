const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN || '7d' });

exports.register = async (req,res) => {
  const { name, email, password, role='employee', employeeId, department } = req.body;
  try {
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });
    const user = await User.create({ name, email, password, role, employeeId, department });
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, employeeId: user.employeeId, avatar: user.avatar } });
  } catch(err) {
    console.error('Register error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req,res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const matched = await user.matchPassword(password);
    if (!matched) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, employeeId: user.employeeId, avatar: user.avatar } });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req,res) => {
  res.json({ user: req.user });
};
