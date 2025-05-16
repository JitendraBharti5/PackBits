import express from 'express';
import { getIngredientByName, searchIngredients } from '../controller/ingredient.controller.js';

const router = express.Router();
router.get('/ingredient/:name', getIngredientByName);
router.get('/search', searchIngredients);
  
export default router;