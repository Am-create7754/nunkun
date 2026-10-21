import { motion } from 'framer-motion';

export default function CustomerSnapshot() {
  return (
    <section className="pb-24 pt-12 bg-brand-cream relative overflow-hidden flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32 px-8">
      {/* Left Polaroid */}
      <motion.div 
        initial={{ opacity: 0, rotate: -15, x: -50 }}
        whileInView={{ opacity: 1, rotate: -6, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="bg-white p-4 pb-12 shadow-xl hover:shadow-2xl transition-shadow relative max-w-sm"
        style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#E5E0D8]/80 backdrop-blur-sm -rotate-2 z-10 opacity-70" />
        <div className="w-full h-auto aspect-square overflow-hidden bg-gray-100">
          <img src="/images/polaroid-1.jpg" alt="Customers enjoying matcha" className="w-full h-full object-cover" />
        </div>
        <p className="font-heading italic text-center mt-6 text-xl text-gray-800">
          Our weekly matcha<br/>break!
        </p>
      </motion.div>

      {/* Right Polaroid */}
      <motion.div 
        initial={{ opacity: 0, rotate: 15, x: 50 }}
        whileInView={{ opacity: 1, rotate: 4, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
        className="bg-white p-4 pb-12 shadow-xl hover:shadow-2xl transition-shadow relative max-w-sm mt-12 md:mt-0"
        style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 bg-[#E5E0D8]/80 backdrop-blur-sm rotate-3 z-10 opacity-70" />
        <div className="w-full h-auto aspect-square overflow-hidden bg-gray-100">
          <img src="/images/polaroid-2.jpg" alt="Dog at bakery" className="w-full h-full object-cover" />
        </div>
        <p className="font-heading italic text-center mt-6 text-xl text-gray-800">
          Charlie loved the<br/>muffins!
        </p>
      </motion.div>
    </section>
  );
}
