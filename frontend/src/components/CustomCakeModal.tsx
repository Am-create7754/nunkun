import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import api from '../api';

const steps = ['Tiers', 'Shape', 'Flavor', 'Toppings', 'Reference'];

const flavors = ['Vanilla Bean', 'Dark Chocolate', 'Red Velvet', 'Pistachio Rose', 'Matcha', 'Coffee Caramel'];
const toppingsList = ['Fresh Berries', 'Edible Flowers', 'Gold Leaf', 'Macarons', 'Chocolate Shards', 'Salted Caramel Drip'];

interface Props {
  onClose: () => void;
}

export default function CustomCakeModal({ onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    tiers: 1,
    shape: 'Round',
    flavor: 'Vanilla Bean',
    toppings: [] as string[],
    reference: null as string | null,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addItem = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);

  const calculatePrice = () => {
    let price = 0;
    // Tiers
    if (selections.tiers === 1) price += 1200;
    if (selections.tiers === 2) price += 2000;
    if (selections.tiers === 3) price += 3500;
    
    // Shape
    if (selections.shape === 'Square') price += 200;
    if (selections.shape === 'Heart') price += 300;
    
    // Flavor
    if (selections.flavor === 'Pistachio Rose' || selections.flavor === 'Matcha') price += 400;
    else if (selections.flavor === 'Coffee Caramel') price += 300;
    else if (selections.flavor === 'Dark Chocolate' || selections.flavor === 'Red Velvet') price += 200;
    
    // Toppings
    price += (selections.toppings.length * 150);

    return price;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(c => c + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const toggleTopping = (topping: string) => {
    setSelections(prev => ({
      ...prev,
      toppings: prev.toppings.includes(topping)
        ? prev.toppings.filter(t => t !== topping)
        : [...prev.toppings, topping]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelections(prev => ({ ...prev, reference: file.name }));
    }
  };

  const handleSubmit = async () => {
    const price = calculatePrice();
    const cakeName = `Custom ${selections.shape} Cake (${selections.tiers} Tier${selections.tiers > 1 ? 's' : ''})`;
    
    try {
      // The server recalculates the price; the cart uses the saved cake's id and price
      const { data } = await api.post('/custom-cakes', {
        tiers: selections.tiers,
        shape: selections.shape,
        flavor: selections.flavor,
        toppings: selections.toppings,
        referenceImage: selections.reference,
      });

      addItem({
        id: `custom_cake_${data._id}`,
        name: cakeName,
        price: data.price ?? price,
        image: '/images/hero.jpg' // Use a default image for custom cakes
      });

      onClose();
      openCart();
    } catch (error: any) {
      console.error('Error creating custom cake:', error);
      alert(error.response?.status === 401
        ? 'Please log in to order a custom cake.'
        : 'Error saving custom cake. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-brand-blue rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Left Text & Stepper */}
        <div className="w-full md:w-5/12 flex flex-col justify-center text-white p-8 md:p-12 overflow-y-auto hidden md:flex">
          <p className="text-white/70 text-sm font-bold tracking-widest uppercase mb-4">Cake Customiser</p>
          <h2 className="font-heading text-5xl mb-6 leading-tight">
            Design your <span className="italic">dream cake.</span>
          </h2>
          <p className="font-body text-white/80 max-w-sm mb-12">
            A guided 5-step builder — tell us about the occasion and we'll bake it just right.
          </p>

          {/* Stepper */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              return (
                <div key={step} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isActive || isPast ? 'bg-white text-brand-blue' : 'border border-white/30 text-white/50'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`font-medium transition-colors ${
                    isActive || isPast ? 'text-white' : 'text-white/50'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Interactive Card */}
        <div className="w-full md:w-7/12 bg-[#F7F3EA] p-8 md:p-12 min-h-[500px] flex flex-col m-4 rounded-[32px] overflow-y-auto relative">
          
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                
                {/* Step 1: Tiers */}
                {currentStep === 0 && (
                  <div>
                    <h2 className="font-heading text-3xl text-gray-900 mb-8">How many tiers?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[1, 2, 3].map(num => (
                        <button 
                          key={num}
                          onClick={() => setSelections({...selections, tiers: num})}
                          className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition-all ${
                            selections.tiers === num 
                              ? 'border-[#1F4ED8] bg-white' 
                              : 'border-transparent bg-[#EFEAE0] hover:bg-white'
                          }`}
                        >
                          <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#C96B4B] fill-current">
                            {num === 1 && <rect x="10" y="20" width="20" height="10" rx="2" />}
                            {num === 2 && <>
                              <rect x="14" y="12" width="12" height="8" rx="2" />
                              <rect x="8" y="20" width="24" height="10" rx="2" />
                            </>}
                            {num === 3 && <>
                              <rect x="16" y="4" width="8" height="8" rx="2" />
                              <rect x="12" y="12" width="16" height="8" rx="2" />
                              <rect x="6" y="20" width="28" height="10" rx="2" />
                            </>}
                          </svg>
                          <span className="font-medium text-gray-900">{num} tier{num > 1 ? 's' : ''}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Shape */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="font-heading text-3xl text-gray-900 mb-8">Pick a shape</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {['Round', 'Square', 'Heart'].map(shape => (
                        <button 
                          key={shape}
                          onClick={() => setSelections({...selections, shape})}
                          className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition-all ${
                            selections.shape === shape 
                              ? 'border-[#1F4ED8] bg-white' 
                              : 'border-transparent bg-[#EFEAE0] hover:bg-white'
                          }`}
                        >
                          <svg width="48" height="48" viewBox="0 0 48 48" className="text-[#C96B4B] fill-current">
                            {shape === 'Round' && <circle cx="24" cy="24" r="16" />}
                            {shape === 'Square' && <rect x="10" y="10" width="28" height="28" rx="4" />}
                            {shape === 'Heart' && <path d="M24 40l-16-16c-4.4-4.4-4.4-11.6 0-16s11.6-4.4 16 0c4.4-4.4 11.6-4.4 16 0s4.4 11.6 0 16L24 40z" transform="scale(0.8) translate(6, 4)" />}
                          </svg>
                          <span className="font-medium text-gray-900">{shape}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Flavor */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="font-heading text-3xl text-gray-900 mb-8">Choose a flavor</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {flavors.map(flavor => (
                        <button 
                          key={flavor}
                          onClick={() => setSelections({...selections, flavor})}
                          className={`p-5 rounded-2xl border-2 text-left transition-all ${
                            selections.flavor === flavor 
                              ? 'border-[#1F4ED8] bg-white' 
                              : 'border-transparent bg-[#EFEAE0] hover:bg-white'
                          }`}
                        >
                          <span className="font-medium text-gray-900 text-lg">{flavor}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Toppings */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="font-heading text-3xl text-gray-900 mb-8">Add toppings (optional)</h2>
                    <div className="flex flex-wrap gap-3">
                      {toppingsList.map(topping => (
                        <button 
                          key={topping}
                          onClick={() => toggleTopping(topping)}
                          className={`px-5 py-3 rounded-full border border-gray-300 transition-all ${
                            selections.toppings.includes(topping) 
                              ? 'bg-[#1F4ED8] border-[#1F4ED8] text-white' 
                              : 'bg-transparent text-gray-700 hover:border-gray-500'
                          }`}
                        >
                          {topping}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Reference */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="font-heading text-3xl text-gray-900 mb-6">Upload a reference (optional)</h2>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/png, image/jpeg"
                      onChange={handleFileUpload}
                    />

                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 mb-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${selections.reference ? 'border-[#1F4ED8] bg-blue-50/50' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                      {selections.reference ? (
                        <>
                          <CheckCircle2 className="text-[#1F4ED8] mb-3" size={32} />
                          <p className="font-medium text-gray-900 mb-1">{selections.reference}</p>
                          <p className="text-sm text-[#1F4ED8]">Click to change</p>
                        </>
                      ) : (
                        <>
                          <Upload className="text-gray-400 mb-3" size={32} />
                          <p className="font-medium text-gray-700 mb-1">Click to upload a photo</p>
                          <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                        </>
                      )}
                    </div>

                    <div className="bg-[#EFEAE0] rounded-xl p-6 font-body text-sm space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tiers</span>
                        <span className="font-bold text-gray-900">{selections.tiers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shape</span>
                        <span className="font-bold text-gray-900">{selections.shape}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Flavor</span>
                        <span className="font-bold text-gray-900">{selections.flavor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Toppings</span>
                        <span className="font-bold text-gray-900">{selections.toppings.length ? selections.toppings.join(', ') : 'None'}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-3 mt-3">
                        <span className="text-gray-500">Estimated Price</span>
                        <span className="font-bold text-gray-900 text-lg">₹{calculatePrice()}</span>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center bg-[#F7F3EA] z-10 sticky bottom-0">
            <button 
              onClick={handleBack}
              className={`font-medium text-gray-600 hover:text-gray-900 transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
            >
              Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button 
                onClick={handleNext}
                className="bg-[#1F4ED8] text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Next <span>→</span>
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                className="bg-[#C96B4B] text-white px-8 py-3 rounded-full font-medium hover:bg-[#b05d41] transition-colors flex items-center gap-2"
              >
                <Sparkles size={18} />
                Request Quote
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
