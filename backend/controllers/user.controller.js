import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


// Get  user by token
const getUserByToken = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        error: true,
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);    
    const userId = decoded.userId; // Extract user ID

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: true,
        success: false,
        message: "User not found",
      });
    }
    res
      .status(200)
      .json({ statusCode: 200, error: false, success: true, user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      } });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      error: true,
      success: false,
      message: "Server error",
    });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({
      statusCode: 200,
      error: false,
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({
        statusCode: 500,
        error: true,
        success: false,
        message: "Error fetching users",
      });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res
          .status(404)
          .json({
            statusCode: 400,
            error: true,
            success: false,
            message: "User not found",
          });

        await User.findById(id);
        res.status(200).json({
          statusCode: 200,
          error: false,
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
    } catch (err) {
        res
          .status(500)
          .json({
            error: true,
            success: false,
            message: "Error fetching user",
          });
    }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password, role },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Error updating user" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

// Update user role (only by super admin)
const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!["superadmin", "admin", "user"].includes(role))
    return res.status(400).json({ error: "Invalid role" });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User role updated", updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Error updating user role" });
  }
};

// User request to become an admin (pending approval)
const requestAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (user.role === "admin") {
      return res.status(400).json({ error: "User is already an admin" });
    }

    user.roleRequest = "pending_admin";  // Set a status for pending admin approval
    await user.save();

    res.json({ message: "Request to become an admin submitted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Error submitting admin request" });
  }
};

// Approve user to become an admin (Super Admin)
const approveAdminRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== "pending_admin") {
      return res.status(400).json({ error: "User has not requested admin role" });
    }

    user.role = "admin";
    await user.save();
    
    res.json({ message: "User role upgraded to admin." });
  } catch (err) {
    res.status(500).json({ error: "Error approving admin request" });
  }
};

export {
  getUserByToken,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  requestAdmin,
  approveAdminRequest,
};