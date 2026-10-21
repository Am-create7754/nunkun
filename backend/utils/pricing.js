import mongoose from 'mongoose';
import Product from '../models/Product.js';
import CustomCake from '../models/CustomCake.js';
import Coupon from '../models/Coupon.js';

export const DELIVERY_FEE = 50;

const TIER_PRICES = { 1: 1200, 2: 2000, 3: 3500 };
const SHAPE_PRICES = { Round: 0, Square: 200, Heart: 300 };
const FLAVOR_PRICES = {
  'Pistachio Rose': 400,
  'Matcha': 400,
  'Coffee Caramel': 300,
  'Dark Chocolate': 200,
  'Red Velvet': 200,
};
const TOPPING_PRICE = 150;

const roundRupees = (n) => Math.round(n * 100) / 100;

// Same price table as the custom cake builder on the frontend
export const calculateCustomCakePrice = ({ tiers, shape, flavor, toppings = [] }) => {
  if (!TIER_PRICES[tiers]) throw new Error('Invalid number of tiers');
  return TIER_PRICES[tiers]
    + (SHAPE_PRICES[shape] || 0)
    + (FLAVOR_PRICES[flavor] || 0)
    + new Set(toppings).size * TOPPING_PRICE;
};

// Returns the coupon if the code is active and not expired, otherwise throws
export const findValidCoupon = async (code) => {
  const coupon = await Coupon.findOne({ code: String(code), isActive: true });
  if (!coupon) throw new Error('Invalid or inactive coupon');
  if (new Date(coupon.expiryDate) < new Date()) throw new Error('Coupon has expired');
  return coupon;
};

// Builds order items and totals from the database, ignoring any prices sent by the client.
// Cart ids are either a product id or `custom_cake_<customCakeId>`.
export const priceOrder = async ({ orderItems, couponApplied, pointsUsed, user }) => {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new Error('No order items');
  }

  const items = [];
  for (const item of orderItems) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new Error('Invalid item quantity');
    }

    const id = String(item.product || '');
    if (id.startsWith('custom_cake_')) {
      const cakeId = id.slice('custom_cake_'.length);
      const cake = mongoose.isValidObjectId(cakeId)
        && await CustomCake.findOne({ _id: cakeId, user: user._id });
      if (!cake) throw new Error('Custom cake not found');
      items.push({
        name: `Custom ${cake.shape} Cake (${cake.tiers} Tier${cake.tiers > 1 ? 's' : ''})`,
        quantity,
        image: '/images/hero.jpg',
        price: cake.price,
        customCake: cake._id,
      });
    } else {
      const product = mongoose.isValidObjectId(id) && await Product.findById(id);
      if (!product) throw new Error('Product not found');
      items.push({
        name: product.name,
        quantity,
        image: product.image,
        price: product.price,
        product: product._id,
      });
    }
  }

  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let couponDiscount = 0;
  if (couponApplied) {
    const coupon = await findValidCoupon(couponApplied);
    couponDiscount = (itemsPrice * coupon.discountPercentage) / 100;
  }

  const beforePoints = Math.max(0, itemsPrice + DELIVERY_FEE - couponDiscount);
  const requestedPoints = Math.max(0, Math.floor(Number(pointsUsed) || 0));
  // 1 point = 1 rupee; can't spend more points than the user has or than the order costs
  const points = Math.min(requestedPoints, user.points || 0, Math.floor(beforePoints));

  return {
    orderItems: items,
    pointsUsed: points,
    totalPrice: roundRupees(beforePoints - points),
  };
};
