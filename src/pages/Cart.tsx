import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center px-4 py-24">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-full shadow-sm border border-gray-100 mb-8"
        >
          <ShoppingBag className="h-16 w-16 text-gray-300" />
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Your cart is empty
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-500 mb-8 text-center max-w-md"
        >
          Looks like you haven't added anything to your cart yet. Discover our premium packaging collection.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/shop" className="inline-flex items-center px-8 py-4 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-gray-900 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
          <span className="text-gray-500 font-medium">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.li 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start group"
                    >
                      <div className="flex-shrink-0 w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden mb-6 sm:mb-0 border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                      
                      <div className="sm:ml-8 flex-1 flex flex-col justify-between w-full h-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors">
                              <Link to={`/product/${item.id}`}>{item.name}</Link>
                            </h3>
                            <p className="mt-2 text-sm font-medium text-gray-500">₹{item.price.toFixed(2)} / unit</p>
                          </div>
                          <p className="text-xl font-extrabold text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center border-2 border-gray-200 rounded-full h-12 w-32 bg-white">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-4 text-gray-500 hover:text-orange-600 transition-colors h-full flex items-center justify-center"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <input 
                              type="number" 
                              value={item.quantity} 
                              readOnly 
                              className="w-full text-center border-none focus:ring-0 p-0 font-bold text-gray-900 bg-transparent"
                            />
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-4 text-gray-500 hover:text-orange-600 transition-colors h-full flex items-center justify-center"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-sm font-bold text-gray-400 hover:text-red-500 flex items-center transition-colors p-2 rounded-full hover:bg-red-50"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>
              
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-100">
                  <div className="py-5 flex items-center justify-between">
                    <dt className="text-gray-500 font-medium">Subtotal</dt>
                    <dd className="font-bold text-gray-900 text-base">₹{total().toFixed(2)}</dd>
                  </div>
                  <div className="py-5 flex items-center justify-between">
                    <dt className="text-gray-500 font-medium">Shipping</dt>
                    <dd className="font-medium text-gray-900">Calculated at checkout</dd>
                  </div>
                  <div className="py-5 flex items-center justify-between">
                    <dt className="text-gray-500 font-medium">Tax</dt>
                    <dd className="font-medium text-gray-900">Calculated at checkout</dd>
                  </div>
                  <div className="py-6 flex items-center justify-between border-t-2 border-gray-900 mt-2">
                    <dt className="text-xl font-extrabold text-gray-900">Total</dt>
                    <dd className="text-2xl font-extrabold text-gray-900">₹{total().toFixed(2)}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8">
                <Link to="/checkout" className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-gray-900 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  or{' '}
                  <Link to="/shop" className="text-orange-600 font-bold hover:text-orange-700 transition-colors">
                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <ShieldCheck className="h-5 w-5 text-green-500 mr-3" />
                  Secure Checkout
                </div>
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <Truck className="h-5 w-5 text-orange-500 mr-3" />
                  Free shipping on orders over ₹2000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

