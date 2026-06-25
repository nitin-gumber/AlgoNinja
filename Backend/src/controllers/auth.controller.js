import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { userRoleEnum } from '../utils/constants.js';
import { sendMail } from '../utils/sendMail.js';
import { sendVerificationEmailTemplate } from '../templates/sendVerificationEmailTemplate.js';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userAlredyExist = await User.findOne({ email: email.toLowerCase() });

    if (userAlredyExist) {
      return res.status(400).json({
        success: false,
        message: 'User Already exist',
      });
    }

    if (userAlredyExist && !userAlredyExist.password && userAlredyExist.googleId) {
      return res.status(400).json({
        success: false,
        message:
          'user already registered using Google. Please use the "Continue with Google" button to access your account.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verficationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 10 * 60 * 1000; // 10min

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: role || userRoleEnum.USER,
      verificationToken: verficationToken,
      verificationTokenExpiry: verificationTokenExpiry,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not regestered',
      });
    }

    const emailVerificationLink = `${process.env.BASE_URL}/api/v1/auth/verifyUser/${verficationToken}`;

    try {
      await sendMail({
        to: user.email,
        subject: 'Verify Your AlgoNinja Account 🚀',
        // message: `Hi ${user.name}, please verify your AlgoNinja account using this link: ${emailVerificationLink}`,
        htmlMessage: sendVerificationEmailTemplate(user.name, emailVerificationLink),
      });
    } catch (mailError) {
      console.error('Nodemailer Verification Transmission Crash:', mailError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'User Registered successfully. Please check your email to verify your account.',
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
        message: 'User already email verify. Please Login Now!',
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

    return res.redirect(`${process.env.FRONTEND_URL}/login`);
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

    if (user && !user.password && user.googleId) {
      return res.status(400).json({
        success: false,
        message:
          'This email was registered using Google. Please use the "Continue with Google" button to login.',
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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid User!',
      });
    }

    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10min

    const resetLink = `${process.env.BASE_URL}/api/v1/auth/resetPassword/${resetPasswordToken}`;

    await User.findOneAndUpdate(
      { email: email },
      {
        passwordResetToken: resetPasswordToken,
        passwordResetTokenExpiry: resetPasswordExpiry,
      },
    );

    await sendMail({
      to: user.email,
      subject: 'Reset Password Link - AlgoNinjua',
      message: resetLink,
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('forgetPassword Failed: ', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error When forgetPassword',
    });
  }
};

export const resetPassword = async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { newPassword } = req.body;

  if (!resetPasswordToken) {
    return res.status(400).json({
      success: false,
      message: 'Token not found',
    });
  }

  try {
    const user = await User.findOne({ passwordResetToken: resetPasswordToken });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or Expire Token',
      });
    }

    if (user.passwordResetTokenExpiry < Date.now()) {
      const newresetPasswordToken = crypto.randomBytes(32).toString('hex');
      const newresetPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10min

      const resetLink = `${process.env.BASE_URL}/api/v1/auth/resetPassword/${newresetPasswordToken}`;

      await User.findOneAndUpdate(
        { email: user.email },
        {
          passwordResetToken: newresetPasswordToken,
          passwordResetTokenExpiry: newresetPasswordExpiry,
        },
      );

      await sendMail({
        to: user.email,
        subject: 'New Reset Password Link - AlgoNinja',
        message: resetLink,
      });

      return res.status(400).json({
        success: false,
        message: 'Token expired. A new verification email has been sent to your email address.',
      });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email: user.email },
      {
        password: newHashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    );

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('resetPassword Failed: ', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error When resetPassword',
    });
  }
};

export const check = async (req, res) => {
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
        image: user?.image,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error When Checking' || error.message,
    });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=unauthorized`);
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESSTOKEN_SECRET,
      { expiresIn: process.env.ACCESSTOKEN_EXPIRY },
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESHTOKEN_SECRET,
      { expiresIn: process.env.REFRESHTOKEN_EXPIRY },
    );

    user.refreshToken = refreshToken;
    await user.save();

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    };

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error('OAuth Callback Core Crash:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};
