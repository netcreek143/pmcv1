import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, User as UserIcon, Mail, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string;
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function Profile() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [token]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'PROCESSING': return <Package className="h-5 w-5 text-blue-500" />;
      case 'SHIPPED': return <Truck className="h-5 w-5 text-purple-500" />;
      case 'DELIVERED': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CANCELLED': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="h-12 w-12 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.role}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  {user.email}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                  Joined {format(new Date(), 'MMMM yyyy')}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <button className="w-full text-left px-4 py-2 rounded-xl bg-orange-50 text-orange-700 font-bold text-sm transition-colors">
                  Order History
                </button>
                <button className="w-full text-left px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 font-bold text-sm transition-colors mt-2">
                  Account Settings
                </button>
                <button className="w-full text-left px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 font-bold text-sm transition-colors mt-2">
                  Shipping Addresses
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Order History</h1>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                          <p className="text-sm font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                          <p className="text-sm font-bold text-gray-900">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                          <p className="text-sm font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1.5">{order.status}</span>
                          </span>
                        </div>
                        <button className="text-orange-600 hover:text-orange-700 transition-colors">
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {order.items.map((item) => {
                          const images = JSON.parse(item.product.images);
                          return (
                            <div key={item.id} className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                              <img 
                                src={images[0]} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
