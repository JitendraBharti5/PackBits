import fs from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import FoodItem from '../model/product.model.js';

import pkg from '@zxing/library';
const {
  MultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  BinaryBitmap,
  HybridBinarizer,
  RGBLuminanceSource
} = pkg;

const decodeBarcode = async (imageBuffer) => {
  try {
    
    const { data, info } = await sharp(imageBuffer)
      .resize(400, 400, { fit: 'inside' })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height } = info;

    const luminanceSource = new RGBLuminanceSource(data, width, height);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    const reader = new MultiFormatReader();
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.CODE_128,
      BarcodeFormat.EAN_13,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
    ]);
    reader.setHints(hints);

    const result = reader.decode(binaryBitmap);
    return result?.getText() || null;
  } catch (err) {
    console.error('Barcode scanning error:', err);
    return null;
  }
};


const scanBarcodeFromImage = async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    console.log("Received image, processing for barcode...");

    const result = await decodeBarcode(imageBuffer);
    if (!result) {
      return res.status(400).json({ error: "No barcode found in the image" });
    }

    res.json({ barcode: result });
  } catch (err) {
    console.error("Error during barcode scanning:", err);
    res.status(500).json({ error: "Failed to scan barcode from image." });
  }
};

const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFoodItemById = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSuggestions = async (req, res) => {
  try {
    const query = req.query.query;
    const suggestions = await FoodItem.find({
      product_name: { $regex: query, $options: 'i' },
    }).select('product_name _id');
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductQuantities = async (req, res) => {
  try {
    const productName = req.query.name;
    if (!productName) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const foodItem = await FoodItem.findOne({ product_name: productName }).select('available_quantities');
    if (!foodItem) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(foodItem.available_quantities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFoodItemByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    
    const foodItem = await FoodItem.findOne({ barcode: { $in: [barcode] } });

    if (!foodItem) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export {
  scanBarcodeFromImage,
  getAllFoodItems,
  getFoodItemById,
  getSuggestions,
  getProductQuantities,
  getFoodItemByBarcode
};
