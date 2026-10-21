import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      customCake: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomCake' },
    }
  ],
  deliveryAddress: { type: String, required: true },
  phone: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  deliveryTimeSlot: { type: String, required: true },
  couponApplied: { type: String },
  pointsUsed: { type: Number, default: 0 },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Baking, Out for Delivery, Delivered
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
