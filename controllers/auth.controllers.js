import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, phone, preferredSalon } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existEmail = await User.findOne({ email: normalizedEmail });

    if (existEmail) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const memberId = `MNR-${Math.floor(1000 + Math.random() * 9000)}`;

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "",
      memberId,
      preferredSalon: preferredSalon || "",
      role: "customer",
      status: "active",
    });

    const token = await genToken(user._id);

    const isSecure = process.env.NODE_ENV === "production" ||
      req.secure ||
      req.headers["x-forwarded-proto"] === "https";

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: isSecure,
    });

    const userData = user.toObject();
    delete userData.password;

    return res.status(201).json({
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        memberId: user.memberId,
        status: user.status,
        preferredSalon: user.preferredSalon,
        role: user.role,
        joinedDate: user.createdAt?.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      },
      token,
    });
  } catch (error) {
    console.error("signUp error:", error);
    return res.status(500).json({ message: `Sign up error: ${error.message}` });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "No account found with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = await genToken(user._id);

    const isSecure = process.env.NODE_ENV === "production" ||
      req.secure ||
      req.headers["x-forwarded-proto"] === "https";

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: isSecure,
    });

    return res.status(200).json({
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        memberId: user.memberId || `MNR-${String(user._id).slice(-4)}`,
        status: user.status,
        preferredSalon: user.preferredSalon,
        role: user.role,
        joinedDate: user.createdAt?.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        memberId: user.memberId || `MNR-${String(user._id).slice(-4)}`,
        status: user.status,
        preferredSalon: user.preferredSalon,
        role: user.role,
        joinedDate: user.createdAt?.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: `Get profile error: ${error.message}` });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const VALID_ADMIN_ROLES = ["admin", "super_admin", "store_manager", "inventory_manager", "sales_viewer", "support"];
    if (!VALID_ADMIN_ROLES.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Customer accounts cannot access the administrative portal.",
      });
    }

    if (user.status && user.status.toLowerCase() !== "active") {
      return res.status(403).json({
        success: false,
        message: "Account deactivated: Please contact the Sovereign Administrator.",
      });
    }

    const token = await genToken(user._id);

    const isSecure = process.env.NODE_ENV === "production" ||
      req.secure ||
      req.headers["x-forwarded-proto"] === "https";

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: isSecure,
      path: "/",
    });

    res.cookie("monarch_admin_token", token, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: isSecure,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        status: user.status || "active",
        avatar: user.name ? user.name.charAt(0).toUpperCase() : "A",
        joinedDate: user.createdAt?.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      },
    });
  } catch (error) {
    console.error("adminLogin error:", error);
    return res.status(500).json({ success: false, message: `Admin login error: ${error.message}` });
  }
};

export const getAdminMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin user not found" });
    }

    const VALID_ADMIN_ROLES = ["admin", "super_admin", "store_manager", "inventory_manager", "sales_viewer", "support"];
    if (!VALID_ADMIN_ROLES.includes(user.role) || (user.status && user.status.toLowerCase() !== "active")) {
      return res.status(403).json({ success: false, message: "Access Denied: Invalid admin clearance" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        status: user.status || "active",
        avatar: user.name ? user.name.charAt(0).toUpperCase() : "A",
        joinedDate: user.createdAt?.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Get admin profile error: ${error.message}` });
  }
};

export const LogOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    res.clearCookie("monarch_admin_token", {
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `LogOut error: ${error.message}` });
  }
};
