import express from "express"
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { getUserByToken } from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

// Utility function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};


router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route to get user info from token
router.get("/me", authenticateToken, getUserByToken);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  async (req, res) => {    
    try {
      const email = req.user.emails[0].value;
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name: req.user.displayName,
          email,
          oauthId: req.user.id,
          oauthProvider: "google",
          role: "user",
        });
      } else {
        user.oauthId = req.user.id;
        user.oauthProvider = "google";
        await user.save();
      }

      const token = generateToken(user._id, user.role);
      // Send only the token in the redirect URL
      res.redirect(
        `${process.env.CLIENT_URL}/auth-success?token=${token}`
      );
    } catch (error) {
    res.status(500).json({statusCode: 500, message: error.message });
    }
  }
);

// Facebook Authentication Route
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// Facebook Callback Route
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    const token = generateToken(req.user);
    console.log(req, "token 1111111");
    console.log(req.user, "req 1111111");
    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${req.user.token}`);
    // res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
  }
);

// Pinterest Auth Route
router.get("/pinterest", passport.authenticate("pinterest", { scope: ["read_public"] }));

// Pinterest Auth Callback
router.get(
  "/pinterest/callback",
  passport.authenticate("pinterest", { failureRedirect: "/login" }),
  (req, res) => {
    const token = generateToken(req.user);
    console.log(req, "token 1111111");
    console.log(req.user, "req 1111111");
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);

export default router;