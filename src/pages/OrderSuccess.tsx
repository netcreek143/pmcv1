import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useCartStore } from '../store/cart';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const clearCart = useCartStore(state => state.clearCart);
  const [searchParams] = useSearchParams();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    // Clear cart upon successful order
    clearCart();

    const orderId = searchParams.get('order_id');
    const redirectStatus = searchParams.get('redirect_status');
    const paymentIntent = searchParams.get('payment_intent');

    if (orderId && redirectStatus === 'succeeded' && paymentIntent && !isUpdating) {
      setIsUpdating(true);
      // Verify payment and update order status to paid
      fetch(`/api/orders/${orderId}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_intent: paymentIntent })
      }).catch(console.error);
    }
  }, [clearCart, searchParams, isUpdating]);

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-green-100 p-6 rounded-full mb-8 shadow-sm border border-green-200 relative"
      >
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
        <CheckCircle className="h-20 w-20 text-green-600 relative z-10" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 text-center tracking-tight"
      >
        Order Placed Successfully!
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-lg text-gray-600 mb-10 text-center max-w-lg leading-relaxed font-medium"
      >
        Thank you for your order. We've received it and will begin processing it right away. You will receive an email confirmation shortly.
      </motion.p>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <Link 
          to="/shop"
          className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-brand transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <Link 
          to="/"
          className="inline-flex items-center justify-center bg-white text-gray-900 px-8 py-4 rounded-full font-bold border border-gray-200 hover:border-gray-900 transition-colors shadow-sm"
        >
          Return to Home
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-16 flex items-center text-sm font-medium text-gray-500 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100"
      >
        <Package className="h-5 w-5 mr-2 text-brand" />
        Your packaging is being prepared with care.
      </motion.div>
    </div>
  );
}
