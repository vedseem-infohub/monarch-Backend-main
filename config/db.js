import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { runMonarchSeed } from "../seedMonarch.js";

const seedAdmin = async () => {
  try {
    const defaultPassword = await bcrypt.hash("monarch123", 10);

    const adminsToSeed = [
      {
        name: "Devraj Singh Rathore",
        email: "devraj@monarch-couture.in",
        role: "super_admin",
        status: "active",
        phone: "+91 98200 11223",
      },
      {
        name: "Monarch Admin",
        email: "admin@monarch-couture.in",
        role: "admin",
        status: "active",
        phone: "+91 22 6984 4000",
      },
      {
        name: "Maharani Radhika Devi",
        email: "radhika@monarch-client.com",
        role: "customer",
        status: "Royal Patron",
        phone: "+91 98200 12345",
      },
      {
        name: "Gayatri Devi Chawla",
        email: "gayatri@monarch-couture.in",
        role: "admin",
        status: "active",
        phone: "+91 98200 44590",
      },
    ];

    for (const a of adminsToSeed) {
      const existing = await User.findOne({ email: a.email });
      if (!existing) {
        await User.create({
          ...a,
          password: defaultPassword,
        });
        console.log(`👑 [Seed] Created default user: ${a.email}`);
      }
    }
  } catch (error) {
    console.error("Seeding admin error:", error);
  }
};

const connectDb = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      console.error("❌ MONGODB_URL is not defined in your environment variables (.env). Please verify .env file.");
      return;
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB connected successfully to MONARCH cluster");
    await seedAdmin();
    await runMonarchSeed();
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default connectDb;
