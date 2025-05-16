import mongoose from 'mongoose';

const FoodItemSchema = new mongoose.Schema({
  product_name: { type: String, required: true,  unique: true},
  category: { type: String },
  ingredients_per_100ml: {
    type: Map,
    of: String
  },
  allergy_info: [String],
  veg_non_veg: { type: String, enum: ['veg', 'non-veg'], default: 'veg' },
  available_quantities: [String],
  side_effects: [String],
  harm_level: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  barcode: [String], 
  image_url: { type: String },
  nutrients_per_100ml: {
    type: Map,
    of: String
  },
});

export default mongoose.model('FoodItem', FoodItemSchema);
