import { User } from '../models/user.model.js';
import { bcrypt } from 'bcryptjs';
import { crypto } from 'crypto';
import { userRoleEnum } from '../utils/constants';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userAlredyExist = await User.findOne({ email: email.lowerCase() });

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

    console.log('User Created Success==>', user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not regestered',
      });
    }
  } catch (error) {}
};
