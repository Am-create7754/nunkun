import { motion } from 'framer-motion';
import { Coffee, Croissant, PawPrint, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="w-full px-4 md:px-12 py-6 max-w-[1400px] mx-auto">
      <div className="w-full flex flex-col md:flex-row h-[70vh] min-h-[500px] rounded-[32px] overflow-hidden shadow-lg">
        {/* Left Side */}
        <div className="w-full md:w-1/2 bg-brand-blue relative flex items-center justify-center p-8 lg:p-16 overflow-hidden">
        
        {/* Floating Doodles */}
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 text-[#0F2D80] opacity-50"
        >
          <Sparkles size={48} strokeWidth={1} />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 text-[#0F2D80] opacity-50"
        >
          <Coffee size={64} strokeWidth={1} />
        </motion.div>

        <motion.div 
          animate={{ x: [0, 10, 0], rotate: [0, 15, 0] }} 
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 right-1/4 text-[#0F2D80] opacity-50"
        >
          <PawPrint size={40} strokeWidth={1} />
        </motion.div>

        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }} 
          transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-1/3 left-1/4 text-[#0F2D80] opacity-50"
        >
          <Croissant size={56} strokeWidth={1} />
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-heading italic font-medium text-white text-6xl md:text-7xl lg:text-[100px] leading-[1.1] z-10 text-center md:text-left"
        >
          Delhi's<br />
          Happiest<br />
          Lil Bakery
        </motion.h1>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 h-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src="/images/hero.jpg" 
          alt="Warm sunlight shining on artisan pastries" 
          className="w-full h-full object-cover"
        />
      </div>
      </div>
    </section>
  );
}
