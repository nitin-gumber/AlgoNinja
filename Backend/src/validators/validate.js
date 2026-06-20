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
      .notEmpty()
      .withMessage('Password is required')
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
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must be 8-20 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  ];
};

export const userforgotPasswordValidator = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid')
      .normalizeEmail(),
  ];
};

export const userresetPasswordValidator = () => {
  return [
    body('newPassword')
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must be 8-20 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  ];
};

export const createProblemValidator = () => {
  return [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('difficulty').trim().notEmpty().withMessage('Difficulty is required'),
    body('tags').isArray().withMessage('Tags must be an array of strings'),
    body('examples').notEmpty().withMessage('Examples are required'),
    body('constraints').trim().notEmpty().withMessage('Constraints are required'),
    body('testcases').notEmpty().withMessage('Testcases are required'),
    body('codeSnippets').notEmpty().withMessage('Code snippets are required'),
  ];
};

export const updateProblemValidator = () => {
  return [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('difficulty').trim().notEmpty().withMessage('Difficulty is required'),
    body('tags').isArray().withMessage('Tags must be an array of strings'),
    body('examples').notEmpty().withMessage('Examples are required'),
    body('constraints').trim().notEmpty().withMessage('Constraints are required'),
    body('testcases').notEmpty().withMessage('Testcases are required'),
    body('codeSnippets').notEmpty().withMessage('Code snippets are required'),
  ];
};

export const submitCodeValidator = () => {
  return [
    body('source_code')
      .notEmpty()
      .withMessage('Source code is required')
      .isString()
      .withMessage('Source code must be a string'),
    body('language_id')
      .notEmpty()
      .withMessage('Language ID is required')
      .bail()
      .custom((value) => typeof value === 'number' && Number.isInteger(value))
      .withMessage(`Language id should be an integer`),
    body('stdin').isArray().withMessage('stdin in should be an array'),
    body('expected_outputs').isArray().withMessage(`expected_outputs should be an array`),
    body('problemId')
      .notEmpty()
      .withMessage('Problem id is required')
      .isString()
      .withMessage('Problem id should be a string'),
  ];
};

export const createSheetValidator = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name of Playlist is required')
      .isString()
      .withMessage('Name of Playlist should be a string')
      .isLength({ min: 3, max: 100 })
      .withMessage('Name must be between 3 to 100 characters'),
    body('description').optional().trim().isString().withMessage('Description should be a string'),
    body('sheetVisibility')
      .trim()
      .notEmpty()
      .withMessage('Visibility is required')
      .isIn(['public', 'private'])
      .withMessage('Visibility must be either public or private'),
    body('tags')
      .isArray({ min: 1 })
      .withMessage('Tags must be an array with at least one valid tag'),
    body('problems').isArray().withMessage('Problem must be an array of valid ObjectIds'),
  ];
};

export const updateSheetValidator = () => {
  return [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty if provided')
      .isString()
      .withMessage('Name of playlist should be a string')
      .isLength({ min: 3, max: 100 })
      .withMessage('Name must be between 3 to 100 characters'),
    body('description')
      .optional({ nullable: true }) // Allow null or empty string to clear description
      .trim()
      .isString()
      .withMessage('Description should be a string'),
    body('visibility')
      .optional()
      .trim()
      .isIn(['PUBLIC', 'PRIVATE'])
      .withMessage('Visibility must be either PUBLIC or PRIVATE'),
    body('tags')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Tags must be an array with at least one valid tag element'),
    body('problems')
      .optional()
      .isArray()
      .withMessage('Problems must be formatted as an array of valid ObjectIds'),
  ];
};
