import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["superadmin", "admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: function () {
      return !this.oauthProvider;
    },
  },
  oauthProvider: {
    type: String,
    enum: ["google", "facebook", "pinterest"],
    required: false,
  },
  oauthId: {
    type: String,
    required: function () {
      return !!this.oauthProvider;
    },
  },
});

// Apply unique index explicitly
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;