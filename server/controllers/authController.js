const User = require("../models/User");
const Expense = require("../models/Expense");
const Saving = require("../models/Saving");
const Note = require("../models/Note");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });
    res.json({ token, user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAccount = async (req, res) => {
  const userId = req.user.id;

  await Expense.deleteMany({ userId });
  await Saving.deleteMany({ userId });
  await Note.deleteMany({ userId });
  await User.findByIdAndDelete(userId);

  res.json({ message: "Account deleted" });
};
