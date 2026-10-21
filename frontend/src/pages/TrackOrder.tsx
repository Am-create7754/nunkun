import { motion } from 'framer-motion';
import { Check, ChefHat, Package, Truck } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useEffect } from 'react';

const stages = [
  { name: 'Order Received', icon: Check, completed: true, active: false },
  { name: 'Baking', icon: ChefHat, completed: false, active: true, subtext: 'In progress...' },
  { name: 'Packaging', icon: Package, completed: false, active: false },
  { name: 'Out for Delivery', icon: Truck, completed: false, active: false },
];

export default function TrackOrder() {
  const { orders, fetchUserOrders } = useUserStore();
  const activeOrder = orders.find(o => o.status !== 'Delivered');

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  if (!activeOrder) {
    return (
      <div className="min-h-[70vh] bg-brand-cream flex flex-col items-center justify-center p-8 text-center">
        <h1 className="font-heading italic text-4xl text-gray-900 mb-4">No active orders</h1>
        <p className="font-body text-gray-500">You don't have any orders currently being baked.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-12 pb-24 px-4 md:px-12 max-w-5xl mx-auto w-full">
      
      {/* Header */}
      <div className="mb-12">
        <p className="text-brand-terracotta text-sm font-bold tracking-widest uppercase mb-4">Live Tracking</p>
        <h1 className="font-heading text-4xl md:text-5xl text-gray-900 mb-2">
          Order <span className="text-gray-500 font-light">#{activeOrder._id}</span>
        </h1>
        <p className="font-body text-gray-600 text-lg">
          {activeOrder.orderItems?.map(i => `${i.name} × ${i.quantity}`).join(', ')}
        </p>
      </div>

      {/* Tracking Card */}
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
        
        {/* Progress Bar Container */}
        <div className="relative pt-8 pb-16">
          
          {/* Background Line */}
          <div className="absolute top-14 left-0 w-full h-[3px] bg-[#EFEAE0] z-0"></div>
          
          {/* Active Line (progress) */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '40%' }} // Since step 2 is active
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-14 left-0 h-[3px] bg-brand-blue z-0"
          ></motion.div>

          <div className="relative z-10 flex justify-between">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={stage.name} className="flex flex-col items-center w-1/4">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${
                      stage.completed || stage.active 
                        ? 'bg-brand-blue text-white shadow-md' 
                        : 'bg-[#F7F3EA] text-gray-400 border-2 border-[#EFEAE0]'
                    }`}
                  >
                    <Icon size={20} strokeWidth={stage.completed || stage.active ? 2.5 : 1.5} />
                  </motion.div>
                  
                  <span className={`font-body font-bold text-sm text-center ${
                    stage.active ? 'text-gray-900' : (stage.completed ? 'text-gray-700' : 'text-gray-400')
                  }`}>
                    {stage.name}
                  </span>
                  
                  {stage.subtext && (
                    <span className="font-body text-xs text-brand-blue mt-1">
                      {stage.subtext}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-body text-sm text-gray-500 mb-1">Estimated delivery</p>
            <p className="font-body font-bold text-gray-900">Today, 4:30 – 5:00 PM</p>
          </div>
          
          <button className="text-brand-blue font-medium text-sm hover:underline">
            Contact baker
          </button>
        </div>

      </div>
    </div>
  );
}
