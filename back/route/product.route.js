import express from 'express';
import {
  getAllFoodItems,
  getFoodItemById,
  getSuggestions,
  getProductQuantities,
  getFoodItemByBarcode,
  scanBarcodeFromImage
} from '../controller/product.controller.js';
import multer from 'multer';
const upload = multer(); 
const router = express.Router();



router.get('/', getAllFoodItems);
router.get('/result/:id', getFoodItemById);
router.get('/suggestions', getSuggestions); // ?query=
router.get('/quantities', getProductQuantities); // ?name=
router.get('/barcode/:barcode', getFoodItemByBarcode);
router.post('/scan-image', upload.single('image'), scanBarcodeFromImage);

export default router;
