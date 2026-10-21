import { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';
import { useCartStore } from '../store/useCartStore';

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/users/favorites');
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: string) => {
    try {
      await api.post('/users/favorites', { productId });
      setFavorites(favorites.filter((f) => f._id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading your favorites...</div>;

  return (
    <div className="min-h-screen bg-brand-cream pt-12 pb-24 px-4 md:px-12 max-w-[1400px] mx-auto w-full">
      <div className="mb-12">
        <h1 className="font-heading text-5xl text-gray-900 flex items-center gap-4">
          <Heart className="text-brand-terracotta" size={40} fill="currentColor" />
          Your Wishlist
        </h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <p className="text-xl text-gray-500 font-body">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeFavorite(item._id)}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-heading text-lg text-gray-900 mb-1">{item.name}</h3>
                <p className="font-bold text-gray-900 mb-4">₹{item.price}</p>
                <button 
                  onClick={() => addItem({ id: item._id, name: item.name, price: item.price, image: item.image })}
                  className="mt-auto w-full py-2 bg-brand-blue text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
