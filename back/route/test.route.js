import express from 'express';
import {
  getProductResult,
  testProductAgainstProfile
} from '../controller/test.controller.js';

const router = express.Router();

router.get('/result/:id', getProductResult);
router.get('/test/:id', testProductAgainstProfile);

export default router;
