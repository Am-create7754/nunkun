import { motion } from 'framer-motion';

const columns = [
  // Column 1
  [
    { src: '/images/croissants.jpg', alt: 'Croissants', tag: 'Vegan 🌱' },
    { src: '/images/macarons.jpg', alt: 'Macarons', tag: 'Best Seller' },
    { src: '/images/muffins.jpg', alt: 'Blueberry Muffins' },
  ],
  // Column 2
  [
    { src: '/images/croissant-single.jpg', alt: 'Single Croissant', tag: 'Vegan 🌱' },
    { src: '/images/choc-muffins.jpg', alt: 'Chocolate Muffins' },
    { src: '/images/sourdough.jpg', alt: 'Sourdough Bread', tag: 'Must Try' },
  ],
  // Column 3
  [
    { src: '/images/cinnamon-rolls.jpg', alt: 'Cinnamon Rolls' },
    { src: '/images/macarons.jpg', alt: 'Macarons', tag: 'Best Seller' },
    { src: '/images/danish.jpg', alt: 'Danish Pastry', tag: 'Must Try' },
  ],
  // Column 4
  [
    { src: '/images/brownies.jpg', alt: 'Brownies' },
    { src: '/images/cinnamon-rolls.jpg', alt: 'Cinnamon Rolls', tag: 'Vegan 🌱' },
    { src: '/images/choc-muffins.jpg', alt: 'Chocolate Muffins' },
  ]
];

export default function MasonryGallery() {
  return (
    <section id="menu" className="py-24 bg-brand-cream px-4 md:px-8 max-w-[1400px] mx-auto w-full">
      
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h2 className="font-heading italic text-5xl md:text-6xl text-gray-900 leading-tight">
          From the<br />morning bake.
        </h2>
        <p className="font-body text-gray-600 max-w-sm text-left md:text-right">
          A handpicked rotation of pastries, breads and sweets — everything baked in-house, every single day.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4 md:gap-6 w-full">
            {col.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 + colIndex * 0.1 }}
                className="relative rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow group cursor-pointer w-full"
              >
                <motion.img 
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  src={item.src} 
                  alt={item.alt} 
                  className="w-full h-auto object-cover rounded-[20px] bg-gray-100"
                />
                
                {item.tag && (
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm pointer-events-none z-10 tracking-wide
                    ${item.tag.includes('Vegan') ? 'bg-[#F7F3EA] text-gray-800' : ''}
                    ${item.tag.includes('Best Seller') ? 'bg-[#C96B4B] text-white' : ''}
                    ${item.tag.includes('Must Try') ? 'bg-[#1F4ED8] text-white' : ''}
                  `}>
                    {item.tag}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
