import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { userRoleEnum } from '../utils/constants.js';
import { sendMail } from '../utils/sendMail.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userAlredyExist = await User.findOne({ email: email.toLocaleLowerCase() });

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
