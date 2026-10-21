import { motion } from 'framer-motion';
import { User, Heart, RotateCcw, Download } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Account() {
  const { points, orders } = useUserStore();
  const userName = useAuthStore(state => state.userName) || 'Anya';
  const addItem = useCartStore(state => state.addItem);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    api.get('/users/favorites').then(res => setFavorites(res.data)).catch(console.error);
  }, []);

  const downloadInvoice = (order: any) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Nun Kun Bakery - Invoice", 14, 22);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 32);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 40);
    
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows: any[] = [];
    
    order.orderItems.forEach((item: any) => {
      tableRows.push([item.name, item.quantity, `Rs. ${item.price}`, `Rs. ${item.price * item.quantity}`]);
    });
    
    (doc as any).autoTable({
      startY: 50,
      head: [tableColumn],
      body: tableRows,
    });
    
    doc.text(`Total Price: Rs. ${order.totalPrice}`, 14, (doc as any).lastAutoTable.finalY + 10);
    doc.save(`Invoice_${order._id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-12 pb-24 px-4 md:px-12 max-w-[1400px] mx-auto w-full">
      
      {/* Header */}
      <div className="mb-12">
        <p className="text-brand-terracotta text-sm font-bold tracking-widest uppercase mb-4">My Account</p>
        <h1 className="font-heading text-5xl md:text-6xl text-gray-900">
          Welcome back, {userName}.
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Rewards Card */}
        <div className="lg:col-span-1 bg-brand-blue rounded-[32px] p-8 md:p-10 text-white flex flex-col justify-between shadow-sm min-h-[360px]">
          <div>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-8">
              <User size={24} />
            </div>
            <p className="font-body text-white/80 mb-2">Reward points</p>
            <h2 className="font-heading text-6xl md:text-7xl mb-4">{points.toLocaleString()}</h2>
            <p className="font-body text-white/90 text-sm">260 points to your next free pastry</p>
          </div>
          
          <div className="mt-8">
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-brand-terracotta rounded-full"
              ></motion.div>
            </div>
          </div>
        </div>

        {/* Favorites Card */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-3xl flex items-center gap-3 text-gray-900">
              <Heart className="text-brand-terracotta" size={24} strokeWidth={2.5} />
              Favorites
            </h3>
            <Link to="/favorites" className="text-brand-blue font-medium text-sm hover:underline">Manage</Link>
          </div>

          <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x">
            {favorites.length === 0 ? <p className="text-gray-500 text-sm">No favorites added yet.</p> : null}
            {favorites.map((fav, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={fav._id} 
                className="min-w-[200px] sm:min-w-[240px] flex-shrink-0 bg-[#F7F3EA] rounded-2xl p-3 flex flex-col snap-start"
              >
                <div className="aspect-[4/3] w-full rounded-xl overflow-hidden mb-4">
                  <img src={fav.image} alt={fav.name} className="w-full h-full object-cover" />
                </div>
                <div className="px-1 flex-1 flex flex-col">
                  <h4 className="font-body font-bold text-gray-900 mb-1">{fav.name}</h4>
                  <p className="font-body text-sm text-gray-500 mt-auto">₹{fav.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100">
        <h3 className="font-heading text-3xl text-gray-900 mb-8">Order history</h3>
        
        <div className="space-y-4">
          {orders.map((order, i) => (
            <div key={order._id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 ${i !== orders.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center gap-6 mb-4 sm:mb-0">
                <div className="w-12 h-12 rounded-full bg-[#F7F3EA] flex items-center justify-center font-bold text-gray-700 text-sm">
                  {order._id.substring(order._id.length - 4)}
                </div>
                <div>
                  <h4 className="font-body font-bold text-gray-900">Order {order._id.substring(order._id.length - 6)}</h4>
                  <p className="font-body text-sm text-gray-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems?.length || 0} items • ₹{order.totalPrice}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => downloadInvoice(order)}
                  className="px-5 py-2 rounded-full border border-gray-300 font-medium text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Invoice
                </button>
                <button 
                  onClick={() => {
                    // Re-add the original items so the server can price them again
                    order.orderItems.forEach((item: any) => {
                      const id = item.product || (item.customCake && `custom_cake_${item.customCake}`);
                      if (!id) return;
                      for (let i = 0; i < item.quantity; i++) {
                        addItem({ id, name: item.name, price: item.price, image: item.image });
                      }
                    });
                  }}
                  className="px-5 py-2 rounded-full border border-gray-300 font-medium text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Re-order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
