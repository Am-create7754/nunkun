import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Banknote, Sparkles, Tag } from 'lucide-react';

import api from '../api';

export default function Checkout() {
  const { items, getTotalPrice, clearCart, deliveryDate, deliveryTimeSlot } = useCartStore();
  const { points } = useUserStore(); // User points
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });
  const [showErrors, setShowErrors] = useState(false);

  // Coupons & Points
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');
  
  const baseTotalPrice = getTotalPrice();
  const deliveryFee = 50;
  
  const couponDiscount = (baseTotalPrice * discountPercent) / 100;
  const pointsDiscount = usePoints ? points : 0; // 1 point = 1 rupee discount
  const finalPrice = Math.max(0, baseTotalPrice + deliveryFee - couponDiscount - pointsDiscount);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-brand-cream">
        <h1 className="font-heading text-4xl text-gray-900 mb-4">Your cart is empty</h1>
        <p className="font-body text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={() => navigate('/menu')} 
          className="bg-[#1F4ED8] text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (showErrors) setShowErrors(false);
  };

  const handleApplyCoupon = async () => {
    try {
      const res = await api.post('/coupons/validate', { code: couponCode });
      setDiscountPercent(res.data.discountPercentage);
      setCouponMsg(`Coupon applied: ${res.data.discountPercentage}% off!`);
    } catch (err: any) {
      setCouponMsg(err.response?.data?.message || 'Invalid coupon');
      setDiscountPercent(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim() || !formData.address.trim() || !deliveryDate) {
      setShowErrors(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const orderData = {
        orderItems: items.map(i => ({ name: i.name, quantity: i.quantity, image: i.image, price: i.price, product: i.id })),
        deliveryAddress: `${formData.firstName} ${formData.lastName}, ${formData.address}`,
        phone: formData.phone,
        paymentMethod: paymentMethod,
        totalPrice: finalPrice,
        deliveryDate: deliveryDate,
        deliveryTimeSlot: deliveryTimeSlot,
        couponApplied: discountPercent > 0 ? couponCode : undefined,
        pointsUsed: usePoints ? points : 0
      };

      const { data } = await api.post('/orders', orderData);

      if (paymentMethod === 'Card' || paymentMethod === 'UPI') {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_MOCK_KEY_ID',
          amount: data.razorpayOrder.amount, 
          currency: 'INR',
          name: 'Nun Kun Bakery',
          description: 'Bakery Order',
          order_id: data.razorpayOrder.id,
          handler: async function (response: any) {
            await api.post('/orders/verify-payment', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            clearCart();
            navigate('/track-order');
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            contact: formData.phone
          },
          theme: {
            color: '#1F4ED8'
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        clearCart();
        navigate('/track-order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-12 pb-24 px-4 md:px-12 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-24">
      
      {/* Checkout Form */}
      <div className="flex-1 space-y-12">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl text-gray-900 mb-2">Complete Order</h1>
          <p className="font-body text-gray-500">You're just one step away from deliciousness.</p>
        </div>

        <div className="space-y-10">
          
          {/* Contact Details */}
          <section>
            <h2 className="font-heading text-2xl text-gray-900 mb-6">Contact & Delivery</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className={`w-full p-4 rounded-xl border bg-white outline-none transition-colors ${showErrors && !formData.firstName.trim() ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-[#1F4ED8]'}`} />
                </div>
                <div className="relative">
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className={`w-full p-4 rounded-xl border bg-white outline-none transition-colors ${showErrors && !formData.lastName.trim() ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-[#1F4ED8]'}`} />
                </div>
              </div>

              <div className="relative pt-2">
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className={`w-full p-4 rounded-xl border bg-white outline-none transition-colors ${showErrors && !formData.phone.trim() ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-[#1F4ED8]'}`} />
              </div>

              <div className="relative pt-2">
                <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Delivery Address" className={`w-full p-4 rounded-xl border bg-white outline-none transition-colors ${showErrors && !formData.address.trim() ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-[#1F4ED8]'}`} rows={3}></textarea>
              </div>



            </div>
          </section>

          {/* Payment Method */}
          <section className="pt-2">
            <h2 className="font-heading text-2xl text-gray-900 mb-6">Payment Method</h2>
            <div className="space-y-4">
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'UPI' ? 'border-[#1F4ED8] bg-white' : 'border-gray-200 bg-transparent hover:bg-white'}`}>
                <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-[#1F4ED8]" />
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1F4ED8]">
                  <Wallet size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-body font-bold text-gray-900">UPI / QR Code</h4>
                  <p className="font-body text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'Card' ? 'border-[#1F4ED8] bg-white' : 'border-gray-200 bg-transparent hover:bg-white'}`}>
                <input type="radio" name="payment" value="Card" checked={paymentMethod === 'Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-[#1F4ED8]" />
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1F4ED8]">
                  <CreditCard size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-body font-bold text-gray-900">Credit / Debit Card</h4>
                  <p className="font-body text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-[#1F4ED8] bg-white' : 'border-gray-200 bg-transparent hover:bg-white'}`}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-[#1F4ED8]" />
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1F4ED8]">
                  <Banknote size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-body font-bold text-gray-900">Cash on Delivery</h4>
                  <p className="font-body text-sm text-gray-500">Pay when you receive your order</p>
                </div>
              </label>
            </div>
          </section>

        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="w-full lg:w-[400px]">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 sticky top-28">
          <h2 className="font-heading text-2xl text-gray-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-body font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                  <p className="font-body text-xs text-gray-500 mt-1">₹{item.price} × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Promo Code" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none text-sm"
                />
              </div>
              <button onClick={handleApplyCoupon} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium">Apply</button>
            </div>
            {couponMsg && <p className={`mt-2 text-sm ${discountPercent > 0 ? 'text-green-600' : 'text-red-500'}`}>{couponMsg}</p>}
          </div>

          {points > 0 && (
            <div className="mb-6 pb-6 border-b border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} className="mt-1" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Use Loyalty Points</p>
                  <p className="text-gray-500 text-xs">You have {points} points (₹{points} off)</p>
                </div>
              </label>
            </div>
          )}

          <div className="space-y-3 font-body text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{baseTotalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discountPercent}%)</span>
                <span>-₹{couponDiscount}</span>
              </div>
            )}
            {usePoints && (
              <div className="flex justify-between text-green-600">
                <span>Points Applied</span>
                <span>-₹{pointsDiscount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t border-gray-100 mt-3">
              <span>Total</span>
              <span>₹{finalPrice}</span>
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder}
            className="w-full mt-8 bg-[#C96B4B] text-white py-4 rounded-full font-bold hover:bg-[#b05d41] transition-colors flex justify-center items-center gap-2 shadow-sm"
          >
            <Sparkles size={18} />
            Place Order (₹{finalPrice})
          </button>
          
        </div>
      </div>

    </div>
  );
}
