const mongoose = require("mongoose");
const User = require("../src/models/User");
const env = require("../src/config/env");

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB Connected for Seeding");

    const adminEmail = env.ADMIN_EMAIL;
    const adminPassword = env.ADMIN_PASSWORD;

    await User.deleteMany({ email: adminEmail });
    console.log(`Deleted existing user to refresh credentials`);

    const admin = await User.create({
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log(`Admin user created successfully!`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role: ${admin.role}`);

    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
