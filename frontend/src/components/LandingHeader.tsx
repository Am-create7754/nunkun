import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function LandingHeader() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const handleOrderOnline = () => {
    if (isLoggedIn) {
      navigate('/menu');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="sticky top-0 z-50 h-20 bg-brand-cream/90 backdrop-blur-md border-b border-brand-clay/10 w-full flex justify-center">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-12 flex items-center justify-between">
        <div className="flex-1">
          <a href="/" className="font-heading italic font-bold text-3xl tracking-tight text-gray-900">
            Nun·Kun
          </a>
        </div>
        
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <a href="#menu" className="text-gray-800 hover:text-brand-terracotta transition-colors font-medium">Menu</a>
          <a href="#our-story" className="text-gray-800 hover:text-brand-terracotta transition-colors font-medium">Our Story</a>
          <a href="#say-hi" className="text-gray-800 hover:text-brand-terracotta transition-colors font-medium">Say Hi</a>
        </nav>

        <div className="flex-1 flex justify-end">
          <motion.button
            onClick={handleOrderOnline}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-blue text-white px-6 py-2.5 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            Order Online
          </motion.button>
        </div>
      </div>
    </header>
  );
}
