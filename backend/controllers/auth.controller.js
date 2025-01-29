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

    // console.log("Before Hashing:", password);

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // console.log('*********************');
    // console.log("After Hashing:", hashedPassword);
    
    // Creating the new user with hashed password
    const user = await User.create({ name, email, password: hashedPassword });
    
    // console.log("Stored Hashed Password:", user.password);
    const token = generateToken(user._id, user.role);

    res.status(200).json({statusCode: 200, // Send response with token and user data
      token,
      user: { id: user._id, name: user.name, role: user.role }, // Send response with token and user data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    // console.log("User Found:", user);
    if (!user)
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });


    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch, password, user.password, 'isMatch controller');
    // console.log("-----------------:",);
    // console.log("Entered Password:", password);
    // console.log("Stored Hashed Password:", user.password);
    
    if (!isMatch)
      return res
        .status(401)
        .json({ statusCode: 401, message: "Invalid credentials" });

    // Generate JWT
    // const token = jwt.sign(
    //   { id: user._id, role: user.role },
    //   process.env.JWT_SECRET, // Use a strong secret key
    //   {
    //     // expiresIn: "1d",
    //     expiresIn: process.env.JWT_EXPIRES_IN,
    //   }
    // );
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      token,
      user: {statusCode: 200, id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({statusCode: 500, message: error.message });
  }
};


export { registerUser, loginUser };