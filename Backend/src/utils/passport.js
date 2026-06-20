import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';
import { userRoleEnum } from './constants.js';

dotenv.config();
export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },

      async (accesToken, refreshToken, profile, done) => {
        try {
          if (!profile.emails || profile.emails.length === 0) {
            return done(new Error('No email found in Google profile'), null);
          }
          const email = profile.emails[0].value.toLowerCase();

          let user = await User.findOne({ email });

          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              user.isVerified = true;
              if (profile.photos?.[0]?.value) user.image = profile.photos[0].value;
              await user.save();
            }
            return done(null, user);
          }

          user = await User.create({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            isVerified: true,
            role: userRoleEnum.USER,
            image: profile.photos?.[0]?.value || '',
            password: '',
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
};
