import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as PinterestStrategy } from "passport-pinterest";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//  Google Authentication Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      // scope: ["profile", "email"],
    },
    // async (accessToken, refreshToken, profile, done) => {
    //     try {
    //         let user = await User.findOne({ googleId: profile.id });

    //         if (!user) {
    //             user = new User({
    //                 // googleId: profile.id,
    //                 name: profile.displayName,
    //                 email: profile.emails[0].value,
    //                 oauthProvider: "google",
    //                 oauthId: profile.id,
    //                 role: "user",
    //             });
    //             await user.save();
    //         }

    //         // const token = generateToken(user);
    //         const token = generateToken(user._id, user.role);
    //         return done(null, { user, token });
    //     } catch (error) {
    //         return done(error, null);
    //     }
    // }
     (accessToken, refreshToken, profile, done) => {
        done(null, profile);
    }
  )
);

//  Facebook Authentication Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          user = new User({
            // facebookId: profile.id,
            oauthProvider: "facebook",
            oauthId: profile.id,
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : "", // Facebook sometimes does not provide email
            role: "user",
          });
          await user.save();
        }

        // const token = generateToken(user);
        const token = generateToken(user._id, user.role);
        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

//  Pinterest Authentication Strategy
passport.use(
  new PinterestStrategy(
    {
      clientID: process.env.PINTEREST_CLIENT_ID,
      clientSecret: process.env.PINTEREST_CLIENT_SECRET,
      callbackURL: "/api/auth/pinterest/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ pinterestId: profile.id });

        if (!user) {
          user = new User({
            // pinterestId: profile.id,
            oauthProvider: "google",
            oauthId: profile.id,
            name: profile.displayName,
            // email: profile.emails ? profile.emails[0].value : "",
            role: "user",
          });
          await user.save();
        }

        // const token = generateToken(user);
        const token = generateToken(user._id, user.role);
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

//session implementation
passport.serializeUser((userData, done) => {
  done(null, userData);
});

passport.deserializeUser((userData, done) => {
  done(null, userData);
});

export default passport;