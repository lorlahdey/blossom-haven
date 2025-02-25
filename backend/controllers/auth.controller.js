// Desc: Auth controller for user registration and login
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// Generate dynamic JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email }); // Check if user with the same email exists
    if (userExists)
      return res
        .status(400)
        .json({ statusCode: 400, message: "User already exists" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    try {
      //creating the new user with hashed password & (catch duplicate errors)
      const user = await User.create({ name, email, password: hashedPassword });

      // // Generate JWT token
      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        // Send response with token and user data
        statusCode: 200,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (dbError) {
      if (dbError.code === 11000) {
        return res
          .status(400)
          .json({ statusCode: 400, message: "Email already registered" });
      }
      throw dbError; // Re-throw other DB errors
    }


  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch)
      return res
        .status(401)
        .json({ statusCode: 401, message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      statusCode: 200,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({statusCode: 500, message: error.message });
  }
};


export { registerUser, loginUser };