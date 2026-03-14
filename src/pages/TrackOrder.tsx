import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setError('Order not found. Please check your Order ID.');
      }
    } catch (err) {
      setError('Failed to track order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { status: 'PENDING', label: 'Order Placed', icon: Package },
    { status: 'PROCESSING', label: 'Processing', icon: Search },
    { status: 'SHIPPED', label: 'Shipped', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = order ? steps.findIndex(s => s.status === order.status) : -1;

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tighter uppercase text-center">Track Your Order</h1>
          
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 mb-12">
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Enter Order ID (e.g. #12345678)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand outline-none transition-all font-bold"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-brand text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand-light disabled:opacity-50"
              >
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </form>
            {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
          </div>

          {order && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm"
            >
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Order Status</h3>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">{order.status}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Estimated Delivery</h3>
                  <p className="text-lg font-bold text-gray-900 mt-1">3-5 Business Days</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-brand -translate-y-1/2 z-0 transition-all duration-1000"
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>
                
                <div className="relative z-10 flex justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <div key={step.status} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isCompleted ? 'bg-brand text-white shadow-lg shadow-brand-light' : 'bg-white border-2 border-gray-200 text-gray-300'
                        } ${isCurrent ? 'ring-4 ring-brand-light' : ''}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className={`mt-4 text-xs font-bold uppercase tracking-wider ${
                          isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">Order Summary</h4>
                <div className="space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.product.name} x {item.quantity}</span>
                      <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-between border-t border-gray-100">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-extrabold text-brand text-lg">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
