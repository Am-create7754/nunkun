import mongoose from 'mongoose';

const customCakeSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tiers: { type: Number, required: true },
  shape: { type: String, required: true },
  flavor: { type: String, required: true },
  toppings: [String],
  referenceImage: { type: String },
  price: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Baking, Delivered
}, { timestamps: true });

const CustomCake = mongoose.model('CustomCake', customCakeSchema);
export default CustomCake;
