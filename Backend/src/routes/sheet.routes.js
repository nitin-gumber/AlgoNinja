import express from 'express';

import { createSheetValidator, updateSheetValidator } from '../validators/validate.js';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.middleware.js';
import { isAuthenticated, checkAdmin } from '../middlewares/auth.middleware.js';

import {
  createSheet,
  getSheet,
  updateSheet,
  deleteSheet,
  getSheetProblems,
  addProblemToSheet,
  removeProblemFromSheet,
  getUserSheets,
  getPublicSheets,
  cloneSheet,
  pinSheet,
  unpinSheet,
  getFeaturedSheets,
} from '../controllers/sheet.controller.js';

const sheetRoutes = express.Router();

// ==========================================
// 1. STATIC ROUTES
// ==========================================

sheetRoutes.get('/public', isAuthenticated, getPublicSheets);

sheetRoutes.get('/featured', isAuthenticated, getFeaturedSheets);

sheetRoutes.get('/user', isAuthenticated, getUserSheets);

sheetRoutes.post(
  '/create',
  createSheetValidator(),
  handleValidationErrors,
  isAuthenticated,
  createSheet,
);

// ==========================================
// 2. DYNAMIC/ID ROUTES
// ==========================================

sheetRoutes.post('/:id/clone', isAuthenticated, cloneSheet);

sheetRoutes.post('/:id/pin', isAuthenticated, checkAdmin, pinSheet);

sheetRoutes.post('/:id/unpin', isAuthenticated, checkAdmin, unpinSheet);

sheetRoutes.get('/:id', isAuthenticated, getSheet);

sheetRoutes.put(
  '/:id/update',
  updateSheetValidator(),
  handleValidationErrors,
  isAuthenticated,
  updateSheet,
);

sheetRoutes.delete('/:id/delete', isAuthenticated, deleteSheet);

sheetRoutes.get('/:id/problems', isAuthenticated, getSheetProblems);

sheetRoutes.put('/:sheetId/problems/:problemId', isAuthenticated, addProblemToSheet);

sheetRoutes.delete('/:sheetId/problems/:problemId', isAuthenticated, removeProblemFromSheet);

export default sheetRoutes;
