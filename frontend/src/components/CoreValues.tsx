import { motion } from 'framer-motion';
import { Leaf, WheatOff, Tag, PawPrint } from 'lucide-react';

export default function CoreValues() {
  const values = [
    { name: 'Vegan', icon: Leaf },
    { name: 'Gluten-Free', icon: WheatOff },
    { name: 'Clean Label', icon: Tag },
    { name: 'Pet Friendly', icon: PawPrint },
  ];

  return (
    <section className="py-24 bg-brand-cream relative overflow-hidden">
      
      {/* Decorative Doodles */}
      {/* Far Left Sparkle */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute left-[5%] top-1/2 -translate-y-1/2 text-brand-blue"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20M4.929 4.929l14.142 14.142M4.929 19.071L19.071 4.929"/>
        </svg>
      </motion.div>

      {/* Top Left Leaf */}
      <motion.div 
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute left-[20%] top-[15%] text-brand-blue"
      >
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C12 2 4 10 4 18C4 23.5228 8.47715 28 12 28C15.5228 28 20 23.5228 20 18C20 10 12 2 12 2Z" />
          <path d="M12 28V12" />
        </svg>
      </motion.div>

      {/* Bottom Right Whisk */}
      <motion.div 
        animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
        className="absolute right-[20%] bottom-[10%] text-brand-blue"
      >
        <svg width="32" height="40" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 30V18" />
          <path d="M12 18C6 18 6 6 12 2C18 6 18 18 12 18Z" />
          <path d="M12 18C9 18 9 9 12 5C15 9 15 18 12 18Z" />
        </svg>
      </motion.div>

      <div className="max-w-5xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div 
                key={value.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center gap-6"
              >
                <div className="w-20 h-20 rounded-full border border-gray-800 flex items-center justify-center hover:bg-gray-800 hover:text-brand-cream transition-colors group cursor-pointer">
                  <Icon size={28} strokeWidth={1} className="text-gray-800 group-hover:text-brand-cream transition-colors" />
                </div>
                <p className="font-heading italic text-gray-800 text-xl tracking-wide">{value.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
