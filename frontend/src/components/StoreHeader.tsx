import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 h-20 bg-brand-cream/90 backdrop-blur-md border-b border-brand-clay/10 w-full flex justify-center">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-12 flex items-center justify-between">
        <div className="flex-1">
          <Link to="/" className="font-heading italic font-bold text-3xl tracking-tight text-gray-900">
            Nun·Kun
          </Link>
        </div>
        
        <nav className="hidden md:flex flex-1 justify-center gap-8 items-center">
          <Link to="/menu" className="text-gray-800 hover:text-brand-blue transition-colors font-medium">Menu</Link>
          <Link to="/track-order" className="text-gray-800 hover:text-brand-blue transition-colors font-medium">Track Order</Link>
          <Link to="/account" className="text-gray-800 hover:text-brand-blue transition-colors font-medium">My Account</Link>
          {isLoggedIn && (
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition-colors font-medium cursor-pointer">Logout</button>
          )}
        </nav>

        <div className="flex-1 flex justify-end">
          <motion.button
            onClick={useCartStore(state => state.openCart)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-blue text-white px-6 py-2.5 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow flex items-center gap-2"
          >
            <ShoppingBag size={18} />
            <span>Cart {totalItems > 0 && `(${totalItems})`}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
