require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log("⚠️ Admin already exists:", existing.email);
    return process.exit();
  }

  const admin = new User({
    name: "Super Admin",
    email: "admin@example.com",
    password: "AdminPass123!",
    role: "admin"
  });

  await admin.save();
  console.log("✅ Admin created:", admin.email);
  process.exit();
}

createAdmin();
