import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Please Login!',
    });
  }

  try {
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET);
        req.user = decoded;
        return next();
      } catch (err) {
        if (err.name !== 'TokenExpiredError') {
          return res.status(401).json({
            message: 'Unauthorized Access! Please Login again.',
          });
        }
      }
    }

    if (!refreshToken) {
      return res.status(401).json({
        message: 'Session Expired Please Login again.',
      });
    }

    const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET);
    const user = await User.findById(refreshDecoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
      return res.status(401).json({
        message: 'Unauthorized Access! Please Login again.',
      });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESSTOKEN_SECRET,
      { expiresIn: process.env.ACCESSTOKEN_EXPIRY },
    );
    const newRefreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESHTOKEN_SECRET,
      { expiresIn: process.env.REFRESHTOKEN_EXPIRY },
    );

    user.refreshToken = newRefreshToken;
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

    res.cookie('accessToken', newAccessToken, accessCookieOptions);
    res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

    req.user = refreshDecoded;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error When Authenticating User' });
  }
};
