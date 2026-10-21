import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import LandingHeader from './components/LandingHeader';
import StoreHeader from './components/StoreHeader';
import Footer from './components/Footer';
import StoreFooter from './components/StoreFooter';
import CartDrawer from './components/CartDrawer';
import { motion } from 'framer-motion';
import { Star, Heart, Coffee } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import TrackOrder from './pages/TrackOrder';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Favorites from './pages/Favorites';

function BackgroundDoodles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-[20%] right-[5%] text-brand-blue">
        <Star size={24} strokeWidth={1} />
      </motion.div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, delay: 1 }} className="absolute top-[60%] left-[2%] text-brand-blue">
        <Heart size={32} strokeWidth={1} />
      </motion.div>
      <motion.div animate={{ rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 7, delay: 2 }} className="absolute top-[80%] right-[10%] text-brand-blue">
        <Coffee size={28} strokeWidth={1} />
      </motion.div>
    </div>
  );
}

function LandingLayout() {
  return (
    <>
      <LandingHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <CartDrawer />
      <div className="flex-1">
        <Outlet />
      </div>
      <StoreFooter />
    </div>
  );
}


function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-brand-cream selection:bg-brand-blue selection:text-white relative flex flex-col">
        <BackgroundDoodles />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Routes>
            {/* Landing Route */}
            <Route element={<LandingLayout />}>
              <Route path="/" element={<Home />} />
            </Route>

            {/* Auth Route */}
            <Route path="/auth" element={<Auth />} />

            {/* Store Routes */}
            <Route element={<StoreLayout />}>
              <Route path="/menu" element={<Menu />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/account" element={<Account />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
