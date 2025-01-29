import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import { connectDB } from "./config/db.js";

dotenv.config();

connectDB();
const createSuperAdmin = async () => {
  try {
    const { SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } =
      process.env;

    // Check if superadmin exists
    const existingSuperAdmin = await User.findOne({ email: SUPER_ADMIN_EMAIL });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists.");
      return;
    }

    // Create superadmin
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

    const superAdmin = new User({
      name: SUPER_ADMIN_NAME,
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: "superadmin",
    });

    await superAdmin.save();
    console.log("Super Admin created successfully");
  } catch (error) {
    console.error("Error creating super admin:", error);
  }
};

connectDB()
  .then(() => createSuperAdmin())
  .catch((err) => console.error("Error connecting to DB:", err));
