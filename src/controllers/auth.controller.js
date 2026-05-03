import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { userRoleEnum } from '../utils/constants.js';
import { sendMail } from '../utils/sendMail.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userAlredyExist = await User.findOne({ email: email.toLowerCase() });

    if (userAlredyExist) {
      return res.status(400).json({
        success: false,
        message: 'User Already exist',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verficationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 10 * 60 * 1000; // 10min

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: userRoleEnum.USER,
      verificationToken: verficationToken,
      verificationTokenExpiry: verificationTokenExpiry,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not regestered',
      });
    }

    const emailVerificationLink = `${process.env.BASE_URL}/api/v1/auth/verifyuser/${verficationToken}`;

    await sendMail({
      to: user.email,
      subject: 'AlgoNinja Verification Email',
      message: emailVerificationLink,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user?.image,
      },
    });
  } catch (error) {
    console.error('Registration Error: ', error);
    return res.status(500).json({ error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    return res.status(400).json({
      success: false,
      message: 'Token not found',
    });
  }

  try {
    const user = await User.findOne({ verificationToken: verificationToken });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.verificationTokenExpiry < Date.now()) {
      const newVerificationToken = crypto.randomBytes(32).toString('hex');
      const newverificationTokenExpiry = Date.now() + 10 * 60 * 1000; // 10min

      await User.findOneAndUpdate(
        { email: user.email },
        {
          verificationToken: newVerificationToken,
          verificationTokenExpiry: newverificationTokenExpiry,
        },
      );

      const emailVerificationLink = `${process.env.BASE_URL}/api/v1/auth/verifyuser/${newVerificationToken}`;

      await sendMail({
        to: user.email,
        subject: 'New Verification Email - AlgoNinja',
        message: emailVerificationLink,
      });

      return res.status(400).json({
        success: false,
        message: 'Token expired. A new verification email has been sent to your email address.',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login Successfully',
    });
  } catch (error) {
    console.error('VerifyUser Error: ', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please Verified the account',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Credentials',
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.ACCESSTOKEN_SECRET,
      {
        expiresIn: process.env.ACCESSTOKEN_EXPIRY,
      },
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.REFRESHTOKEN_SECRET,
      {
        expiresIn: process.env.REFRESHTOKEN_EXPIRY,
      },
    );

    user.refreshToken = refreshToken;
    await user.save();

    const accessCookieOptions = {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 min
    };

    const refreshCookieOptions = {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie('accessToken', accessToken, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      message: 'Login Succesful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error('Login Failed: ', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error When Login',
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { id } = req.user;

    await User.findByIdAndUpdate(id, { refreshToken: null });

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully!',
    });
  } catch (error) {
    console.error('Logout Failed', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error When Logged Out',
    });
  }
};

// for testing perpose only, can be removed later
export const checkUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
