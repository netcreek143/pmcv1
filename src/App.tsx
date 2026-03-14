import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, User, Search, Package, LogOut } from 'lucide-react';
import { useCartStore } from './store/cart';
import { useAuthStore } from './store/useAuthStore';
import { motion, AnimatePresence } from 'motion/react';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Categories = lazy(() => import('./pages/Categories'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Shipping = lazy(() => import('./pages/Shipping'));
const Returns = lazy(() => import('./pages/Returns'));
const Bulk = lazy(() => import('./pages/Bulk'));
const Custom = lazy(() => import('./pages/Custom'));
const Sustainability = lazy(() => import('./pages/Sustainability'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const Navbar = () => {
  const location = useLocation();
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { user, logout } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Hide navbar in admin area
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="bg-[#fdfbf7]/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <button className="p-2 -ml-2 mr-4 md:hidden text-gray-900 hover:text-brand transition-colors">
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gray-900 text-white p-1.5 rounded-lg group-hover:bg-brand transition-colors">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-brand transition-colors">
                PACK MY CAKE
              </span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-10">
            <Link to="/" className="text-sm font-bold text-gray-900 hover:text-brand transition-colors uppercase tracking-wider">Home</Link>
            <Link to="/shop" className="text-sm font-bold text-gray-900 hover:text-brand transition-colors uppercase tracking-wider">Shop</Link>
            <Link to="/categories" className="text-sm font-bold text-gray-900 hover:text-brand transition-colors uppercase tracking-wider">Categories</Link>
            <Link to="/about" className="text-sm font-bold text-gray-900 hover:text-brand transition-colors uppercase tracking-wider">About Us</Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearch}
                    className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center"
                  >
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-brand shadow-sm"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-900 hover:text-brand transition-colors relative z-10"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-900 hover:text-brand transition-colors group">
                  <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center group-hover:bg-brand transition-colors">
                    <User className="h-4 w-4 text-brand group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-bold hidden sm:block">Hi, {user.name.split(' ')[0]}</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-sm font-bold text-brand hover:text-brand-dark transition-colors uppercase tracking-wider hidden sm:block">Admin</Link>
                )}
                <button onClick={logout} className="text-gray-900 hover:text-brand transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-900 hover:text-brand transition-colors">
                <User className="h-5 w-5" />
              </Link>
            )}
            <Link to="/cart" className="text-gray-900 hover:text-brand transition-colors relative group">
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-brand text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm group-hover:bg-gray-900 transition-colors"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="bg-white text-gray-900 p-1.5 rounded-lg group-hover:bg-brand group-hover:text-white transition-colors">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-brand transition-colors">
                PACK MY CAKE
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium packaging solutions for bakeries, cafes, and confectioneries. Elevate your brand with our high-quality, food-grade packaging.
            </p>
            <div className="flex space-x-4">
              {/* Social icons placeholders */}
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand hover:text-white transition-all">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand hover:text-white transition-all">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-white uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm font-medium text-gray-400">
              <li><Link to="/shop" className="hover:text-brand transition-colors">All Products</Link></li>
              <li><Link to="/categories/cake-boxes" className="hover:text-brand transition-colors">Cake Boxes</Link></li>
              <li><Link to="/categories/cake-boards" className="hover:text-brand transition-colors">Cake Boards</Link></li>
              <li><Link to="/categories/cupcake-boxes" className="hover:text-brand transition-colors">Cupcake Boxes</Link></li>
              <li><Link to="/categories/accessories" className="hover:text-brand transition-colors">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm font-medium text-gray-400">
              <li><Link to="/contact" className="hover:text-brand transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-brand transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="hover:text-brand transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-brand transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/track-order" className="hover:text-brand transition-colors">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-white uppercase tracking-wider">Business</h4>
            <ul className="space-y-3 text-sm font-medium text-gray-400">
              <li><Link to="/bulk" className="hover:text-brand transition-colors">Wholesale Enquiry</Link></li>
              <li><Link to="/custom" className="hover:text-brand transition-colors">Custom Packaging</Link></li>
              <li><Link to="/about" className="hover:text-brand transition-colors">Our Story</Link></li>
              <li><Link to="/sustainability" className="hover:text-brand transition-colors">Sustainability</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-gray-500">
            &copy; {new Date().getFullYear()} Pack My Cake. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm font-medium text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/bulk" element={<Bulk />} />
            <Route path="/custom" element={<Custom />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
