import { body } from 'express-validator';

export const userRegisterValidator = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 3, max: 50 })
      .withMessage('Name must be 3-50 characters'),
    ,
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must be 8-20 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  ];
};

export const userLoginValidator = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must be 8-20 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  ];
};
