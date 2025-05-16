import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  maxConsumption: {
    '1-10 years': {
      type: Number, 
      required: true,
    },
    '10-16 years': {
      type: Number,
      required: true,
    },
    '16+ years': {
      type: Number, 
      required: true,
    },
  },
  restrictedFor: {
    type:[String], 
    default:[String],
  },
  category: {
    type: String,
    enum:String,
    required: true,
  },
  harmLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    required: true,
  },
  sideEffects: {
    type:[String],
    default:[String],
  },
}, {
  timestamps: true
});

export default mongoose.model('Ingredient', ingredientSchema);
