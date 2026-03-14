import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/useAuthStore';
import { ChevronRight, ShieldCheck, CreditCard, Truck, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [clientSecret, setClientSecret] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'razorpay'>('cod');

  useEffect(() => {
    if (items.length > 0 && paymentMethod === 'card') {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total: total() }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [items, paymentMethod]);

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderRes = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: total() })
      });
      const order = await orderRes.json();

      const options = {
        key: (import.meta as any).env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Pack My Cake',
        description: 'Order Payment',
        order_id: order.id,
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/verify-razorpay-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            // Place order
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            
            const res = await fetch('/api/orders', {
              method: 'POST',
              headers,
              body: JSON.stringify({
                customer: formData,
                items: items.map(item => ({
                  productId: item.id,
                  quantity: item.quantity,
                  price: item.price
                })),
                total: total()
              })
            });

            if (res.ok) {
              clearCart();
              navigate('/order-success');
            } else {
              setError('Failed to place order.');
            }
          } else {
            setError('Payment verification failed.');
          }
          setLoading(false);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: '#ea580c' }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      setError('An error occurred with payment.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#fdfbf7] flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">Add some items to your cart before proceeding to checkout.</p>
        <Link 
          to="/shop"
          className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg hover:-translate-y-1"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') return;
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customer: formData,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          total: total()
        })
      });

      if (res.ok) {
        clearCart();
        navigate('/order-success');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-24">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm font-medium text-gray-500">
            <Link to="/cart" className="hover:text-gray-900 transition-colors">Cart</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-900 font-bold">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Checkout Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Contact Info */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                  Contact Information
                </h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" name="email" required
                    value={formData.email} onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" name="firstName" required
                      value={formData.firstName} onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" name="lastName" required
                      value={formData.lastName} onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                    <input 
                      type="text" name="address" required
                      value={formData.address} onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium"
                      placeholder="Street address, apartment, suite, etc."
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                    <input 
                      type="text" name="city" required
                      value={formData.city} onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                    <input 
                      type="text" name="state" required
                      value={formData.state} onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">PIN Code</label>
                    <input 
                      type="text" name="pincode" required
                      value={formData.pincode} onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" name="phone" required
                      value={formData.phone} onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                  Payment
                </h2>
                
                <div className="space-y-4">
                  <div 
                    className={`border-2 rounded-xl p-5 flex items-center cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-orange-50 border-orange-200' : 'border-gray-200 hover:border-orange-200'}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <input 
                      type="radio" 
                      id="cod" 
                      name="payment" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500" 
                    />
                    <label htmlFor="cod" className="ml-4 flex-1 cursor-pointer">
                      <span className="block text-base font-bold text-gray-900">Cash on Delivery (COD)</span>
                      <span className="block text-sm text-gray-500 mt-1">Pay when your order arrives.</span>
                    </label>
                  </div>

                  {(import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY && (
                    <div 
                      className={`border-2 rounded-xl p-5 flex items-center cursor-pointer transition-colors ${paymentMethod === 'card' ? 'bg-orange-50 border-orange-200' : 'border-gray-200 hover:border-orange-200'}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <input 
                        type="radio" 
                        id="card" 
                        name="payment" 
                        checked={paymentMethod === 'card'} 
                        onChange={() => setPaymentMethod('card')}
                        className="h-5 w-5 text-orange-600 focus:ring-orange-500" 
                      />
                      <label htmlFor="card" className="ml-4 flex-1 cursor-pointer">
                        <span className="block text-base font-bold text-gray-900">Credit / Debit Card</span>
                        <span className="block text-sm text-gray-500 mt-1">Pay securely with Stripe.</span>
                      </label>
                    </div>
                  )}

                  <div 
                    className={`border-2 rounded-xl p-5 flex items-center cursor-pointer transition-colors ${paymentMethod === 'razorpay' ? 'bg-orange-50 border-orange-200' : 'border-gray-200 hover:border-orange-200'}`}
                    onClick={() => setPaymentMethod('razorpay')}
                  >
                    <input 
                      type="radio" 
                      id="razorpay" 
                      name="payment" 
                      checked={paymentMethod === 'razorpay'} 
                      onChange={() => setPaymentMethod('razorpay')}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500" 
                    />
                    <label htmlFor="razorpay" className="ml-4 flex-1 cursor-pointer">
                      <span className="block text-base font-bold text-gray-900">Razorpay</span>
                      <span className="block text-sm text-gray-500 mt-1">Pay securely with UPI, Cards, Netbanking.</span>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'card' && clientSecret && (
                  <div className="mt-8">
                    <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                      <PaymentForm clientSecret={clientSecret} formData={formData} totalAmount={total()} />
                    </Elements>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-center text-sm text-gray-500 bg-gray-50 py-3 rounded-lg">
                  <Lock className="h-4 w-4 mr-2 text-gray-400" />
                  Payments are secure and encrypted.
                </div>
              </div>

              {paymentMethod === 'cod' && (
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-5 rounded-full font-bold text-xl hover:bg-orange-600 transition-all duration-300 disabled:bg-gray-400 flex justify-center items-center shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Processing Order...
                    </span>
                  ) : (
                    `Place Order • ₹${total().toFixed(2)}`
                  )}
                </button>
              )}
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&q=80&w=100'} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-base font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-100 pt-6 space-y-4">
                <div className="flex justify-between text-base text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">₹{total().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base text-gray-600 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-base text-gray-600 font-medium">
                  <span>Taxes</span>
                  <span className="text-gray-900 font-bold">Included</span>
                </div>
                <div className="border-t-2 border-gray-900 pt-6 flex justify-between items-center mt-4">
                  <span className="text-xl font-extrabold text-gray-900">Total</span>
                  <span className="text-3xl font-extrabold text-gray-900">₹{total().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center mr-3">
                    <Truck className="h-5 w-5 text-orange-600" />
                  </div>
                  Free shipping on all orders
                </div>
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center mr-3">
                    <ShieldCheck className="h-5 w-5 text-orange-600" />
                  </div>
                  100% secure checkout
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
