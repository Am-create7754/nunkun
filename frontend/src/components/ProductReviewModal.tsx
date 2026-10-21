import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

interface ProductReviewModalProps {
  product: any;
  onClose: () => void;
}

export default function ProductReviewModal({ product, onClose }: ProductReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post(`/products/${product._id}/reviews`, { rating, comment });
      setSuccess('Review submitted successfully!');
      setTimeout(() => {
        onClose();
        window.location.reload(); // Quick way to refresh reviews in UI
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-xl"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-heading text-2xl text-gray-900">Reviews for {product.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {product.reviews?.length === 0 ? (
            <p className="text-gray-500 mb-6">No reviews yet.</p>
          ) : (
            <div className="space-y-4 mb-8">
              {product.reviews?.map((r: any, i: number) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{r.name}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(r.rating)].map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-heading text-xl text-gray-900 mb-4">Write a Review</h3>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white"
                  rows={3}
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-brand-blue text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
