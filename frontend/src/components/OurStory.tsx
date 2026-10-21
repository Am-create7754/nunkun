import { motion } from 'framer-motion';

export default function OurStory() {
  return (
    <section id="our-story" className="py-24 bg-[#EFEAE0] relative overflow-hidden px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left Side: Editorial Image */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-5/12 aspect-[3/4] relative"
        >
          <div className="absolute inset-0 bg-brand-terracotta translate-x-4 translate-y-4 rounded-xl opacity-20"></div>
          <img 
            src="/images/sourdough.jpg" 
            alt="Artisan sourdough bread" 
            className="w-full h-full object-cover rounded-xl relative z-10 shadow-xl"
          />
        </motion.div>

        {/* Right Side: Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-7/12 space-y-8"
        >
          <div>
            <h2 className="font-heading italic text-5xl md:text-6xl text-brand-blue mb-4">
              Where Salt <br/>Meets Sugar
            </h2>
            <p className="font-heading text-xl text-gray-700 italic">
              Inspired by the majestic twin peaks of the Himalayas: Nun and Kun.
            </p>
          </div>

          <div className="space-y-6 text-gray-800 font-body leading-relaxed text-lg">
            <p>
              Standing side by side in Kargil, "Nun" translates to salt, and "Kun" means sugar. To us, they are more than just mountains; they represent the perfect balance that makes life—and food—complete. Just as a beautiful day needs both sunlight and shade, every truly great flavor relies on a touch of salt to elevate the sweet. That balance is the heartbeat of everything we bake.
            </p>
            
            <p>
              We started Nunkun with a simple yet rebellious question: <strong>Why does "indulgence" have to mean "guilty"?</strong>
            </p>

            <p>
              Born from the team behind Greenr, we wanted to strip away the "white nonsense." We define ourselves as a contemporary plant-forward bakery, but our methods are old-school. We believe in the luxury of time.
            </p>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 mt-6 border-t border-brand-clay/20">
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-xl text-brand-terracotta">A Clean Slate</h4>
              <p className="font-body text-sm text-gray-700">No processed white sugar, no refined maida, and no artificial additives. Treats that are kind to bodies and the planet.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-xl text-brand-terracotta">The Art of Slow Baking</h4>
              <p className="font-body text-sm text-gray-700">Naturally fermented breads, diverse whole flours (like black wheat and oats), and sweetness from natural sources.</p>
            </div>
          </div>

          <div className="pt-4">
            <p className="font-heading italic text-2xl text-brand-blue border-l-4 border-brand-terracotta pl-6 py-2">
              Real ingredients. Honest baking. Perfect balance.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
