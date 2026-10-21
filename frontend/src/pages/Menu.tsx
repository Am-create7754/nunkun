import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import CustomCakeModal from '../components/CustomCakeModal';
import ProductReviewModal from '../components/ProductReviewModal';
import { Sparkles, Search, Heart, MessageSquare } from 'lucide-react';
import api from '../api';

const categories = ['All', 'Pastries', 'Breads', 'Cakes', 'Drinks'];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filters, setFilters] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  
  const [menuData, setMenuData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Pagination
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Reviews
  const [selectedProductForReview, setSelectedProductForReview] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, [keyword, page]);

  useEffect(() => {
    // Fetch user favorites
    api.get('/users/favorites').then(res => setFavorites(res.data.map((f: any) => f._id))).catch(() => {});
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?keyword=${keyword}&pageNumber=${page}`);
      setMenuData(data.products);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId: string) => {
    try {
      await api.post('/users/favorites', { productId });
      setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFilter = (filter: string) => {
    setFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const filteredMenu = menuData.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesFilters = filters.every(f => item.tags && item.tags.includes(f.toUpperCase()));
    return matchesCategory && matchesFilters;
  });

  return (
    <div className="min-h-screen bg-brand-cream pt-12 pb-24 px-4 md:px-12 max-w-[1400px] mx-auto relative">
      
      <AnimatePresence>
        {isModalOpen && <CustomCakeModal onClose={() => setIsModalOpen(false)} />}
        {selectedProductForReview && (
          <ProductReviewModal product={selectedProductForReview} onClose={() => setSelectedProductForReview(null)} />
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="mb-16">
        {loading && <p className="text-gray-500 mb-4">Loading menu...</p>}
        <p className="text-brand-terracotta text-sm font-bold tracking-widest uppercase mb-4">Order Online</p>
        <h1 className="font-heading text-5xl md:text-7xl text-gray-900 mb-6">
          Fresh from the oven, <span className="italic text-brand-blue">to<br/>your door.</span>
        </h1>
        <p className="font-body text-gray-600 max-w-lg text-lg mb-6">
          Pick from our daily bake, customise a cake for the big day, and schedule pickup or delivery in a few taps.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-blue text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Sparkles size={18} />
            Build Custom Cake
          </button>
          
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>
      </div>

      {/* Catalog controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
        <div>
          <h2 className="font-heading text-3xl text-gray-900 mb-1">Today's Menu</h2>
          <p className="font-body text-gray-500 mb-6">Baked this morning. Limited quantities.</p>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${
                  activeCategory === cat 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-[#EFEAE0] text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => toggleFilter('Eggless')}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium flex items-center gap-2 transition-colors ${
              filters.includes('Eggless') ? 'border-gray-900 bg-white' : 'border-gray-300 bg-transparent text-gray-600 hover:border-gray-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full border border-current flex items-center justify-center"></span> Eggless
          </button>
          <button 
            onClick={() => toggleFilter('Vegan')}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium flex items-center gap-2 transition-colors ${
              filters.includes('Vegan') ? 'border-gray-900 bg-white' : 'border-gray-300 bg-transparent text-gray-600 hover:border-gray-400'
            }`}
          >
            🌱 Vegan
          </button>
          <button 
            onClick={() => toggleFilter('Gluten-Free')}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium flex items-center gap-2 transition-colors ${
              filters.includes('Gluten-Free') ? 'border-gray-900 bg-white' : 'border-gray-300 bg-transparent text-gray-600 hover:border-gray-400'
            }`}
          >
            🌾 Gluten-Free
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map(item => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={item._id} 
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full relative"
          >
            <div className="relative aspect-[4/3] bg-gray-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              
              <button 
                onClick={() => toggleFavorite(item._id)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-brand-terracotta hover:bg-white transition-colors"
              >
                <Heart size={20} fill={favorites.includes(item._id) ? "currentColor" : "none"} />
              </button>

              <div className="absolute top-4 left-4 flex gap-2">
                {item.tags?.map((tag: string) => (
                  <span key={tag} className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-800 uppercase tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-heading text-xl text-gray-900">{item.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-yellow-500 text-sm">
                    <span>★ {item.rating ? item.rating.toFixed(1) : 'New'}</span>
                    <span className="text-gray-400">({item.numReviews || 0})</span>
                  </div>
                </div>
                <span className="font-bold text-gray-900">₹{item.price}</span>
              </div>
              <p className="font-body text-gray-500 text-sm mb-6 flex-1">{item.description}</p>
              
              <div className="flex justify-between items-center mt-auto">
                <button 
                  onClick={() => setSelectedProductForReview(item)}
                  className="text-gray-500 hover:text-brand-blue flex items-center gap-1 text-sm font-medium transition-colors"
                >
                  <MessageSquare size={16} />
                  Reviews
                </button>
                <button 
                  onClick={() => addItem({ id: item._id, name: item.name, price: item.price, image: item.image })}
                  className="bg-brand-blue text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <span>+</span> Add
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                page === i + 1 ? 'bg-brand-blue text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
