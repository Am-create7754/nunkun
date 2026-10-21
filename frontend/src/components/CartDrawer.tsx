import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CartDrawer() {
  const { 
    isCartOpen, closeCart, items, addItem, removeItem, getTotalPrice,
    deliveryDate, deliveryTimeSlot, deliveryMode, setDeliveryDetails
  } = useCartStore();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckoutPage = location.pathname === '/checkout';

  const handleContinueToCheckout = () => {
    closeCart();
    navigate('/checkout');
    // reset step after a short delay so the next time it opens it's on step 1
    setTimeout(() => setStep(1), 300);
  };

  const handleClose = () => {
    closeCart();
    setTimeout(() => setStep(1), 300);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 z-[140]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full md:w-[450px] bg-[#F7F3EA] shadow-2xl z-[150] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 md:p-8 flex items-center justify-between">
              <h2 className="font-heading text-3xl text-gray-900">
                {step === 1 ? 'Your Cart' : 'Schedule'}
              </h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 md:px-8 pb-6 flex gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-[#1F4ED8]"></div>
              <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-[#1F4ED8]' : 'bg-[#EFEAE0]'}`}></div>
              <div className="flex-1 h-1.5 rounded-full bg-[#EFEAE0]"></div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-2 hide-scrollbar">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {items.length === 0 ? (
                      <p className="text-gray-500 font-body text-center py-12">Your cart is empty.</p>
                    ) : (
                      items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1">
                            <h4 className="font-body font-bold text-gray-900">{item.name}</h4>
                            <p className="font-body text-sm text-gray-500">₹{item.price}</p>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-[#EFEAE0] rounded-full px-3 py-1.5">
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-gray-500 hover:text-gray-900 font-bold px-1"
                            >
                              -
                            </button>
                            <span className="font-body font-bold text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => {
                                const { quantity, ...itemWithoutQuantity } = item;
                                addItem(itemWithoutQuantity);
                              }}
                              className="w-5 h-5 rounded-full bg-[#1F4ED8] text-white flex items-center justify-center text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    {/* Mode */}
                    <div>
                      <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-3">Mode</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setDeliveryDetails(deliveryDate, deliveryTimeSlot, 'Delivery')}
                          className={`py-3 rounded-xl border-2 font-medium transition-colors ${deliveryMode === 'Delivery' ? 'border-[#1F4ED8] text-gray-900 bg-transparent' : 'border-transparent bg-[#EFEAE0] text-gray-700'}`}
                        >
                          Delivery
                        </button>
                        <button 
                          onClick={() => setDeliveryDetails(deliveryDate, deliveryTimeSlot, 'Pickup')}
                          className={`py-3 rounded-xl border-2 font-medium transition-colors ${deliveryMode === 'Pickup' ? 'border-[#1F4ED8] text-gray-900 bg-transparent' : 'border-transparent bg-[#EFEAE0] text-gray-700'}`}
                        >
                          Pickup
                        </button>
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        Date
                      </p>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={deliveryDate} 
                          onChange={(e) => setDeliveryDetails(e.target.value, deliveryTimeSlot, deliveryMode)} 
                          className="w-full p-4 rounded-xl border border-gray-300 bg-white outline-none transition-colors focus:border-[#1F4ED8]" 
                        />
                      </div>
                    </div>

                    {/* Time Slot */}
                    <div>
                      <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-3">Time Slot</p>
                      <div className="relative">
                        <select 
                          value={deliveryTimeSlot} 
                          onChange={(e) => setDeliveryDetails(deliveryDate, e.target.value, deliveryMode)} 
                          className="w-full p-4 rounded-xl border border-gray-300 bg-white outline-none focus:border-[#1F4ED8]"
                        >
                          <option value="10 AM - 12 PM">10 AM - 12 PM</option>
                          <option value="12 PM - 2 PM">12 PM - 2 PM</option>
                          <option value="2 PM - 4 PM">2 PM - 4 PM</option>
                          <option value="4 PM - 6 PM">4 PM - 6 PM</option>
                          <option value="6 PM - 8 PM">6 PM - 8 PM</option>
                        </select>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 md:p-8 bg-[#F7F3EA]">
              <div className="flex justify-between items-center mb-6">
                <span className="font-body text-gray-600">Subtotal</span>
                <span className="font-bold text-xl text-gray-900">₹{getTotalPrice()}</span>
              </div>
              
              {step === 1 ? (
                isCheckoutPage ? (
                  <div className="space-y-3">
                    <p className="text-sm text-center text-gray-500 font-medium">Add something else, these items are already in checkout.</p>
                    <button 
                      onClick={() => setStep(2)}
                      disabled={items.length === 0}
                      className="w-full bg-white text-[#1F4ED8] border-2 border-[#1F4ED8] py-4 rounded-full font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      Edit Date & Time <span>→</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setStep(2)}
                    disabled={items.length === 0}
                    className="w-full bg-[#1F4ED8] text-white py-4 rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    Continue <span>→</span>
                  </button>
                )
              ) : (
                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-full border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleContinueToCheckout}
                    className="flex-1 bg-[#1F4ED8] text-white py-4 rounded-full font-medium hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                  >
                    {isCheckoutPage ? 'Update Checkout' : 'Continue to checkout'} <span>→</span>
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
