import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['allergy', 'precondition'],
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

export default mongoose.model('Option', optionSchema);
