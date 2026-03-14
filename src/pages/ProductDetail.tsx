import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { Minus, Plus, ShoppingBag, Heart, Share2, ShieldCheck, Truck, RotateCcw, ChevronRight, Star, Package, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string;
  category: { name: string };
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gray-900 hover:bg-orange-600 transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const images = JSON.parse(product.images || '[]');
  const mainImage = images[activeImage] || 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&q=80&w=800';
  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: mainImage
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm font-medium text-gray-500">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link to="/shop" className="hover:text-gray-900 transition-colors">Shop</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link to={`/category/${product.category?.name.toLowerCase().replace(/ /g, '-')}`} className="hover:text-gray-900 transition-colors">
              {product.category?.name}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-900 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col-reverse md:flex-row gap-6"
          >
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 flex-shrink-0 hide-scrollbar pb-2 md:pb-0">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-24 md:w-24 md:h-28 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                      activeImage === idx ? 'border-orange-500 shadow-md' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Main Image */}
            <div className="flex-1 bg-white rounded-3xl overflow-hidden aspect-[4/5] relative shadow-sm border border-gray-100 group">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                referrerPolicy="no-referrer" 
              />
              {discountPercentage > 0 && (
                <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-orange-600 uppercase tracking-wider">{product.category?.name}</span>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">(4.9/5 from 128 reviews)</span>
            </div>
            
            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-extrabold text-gray-900">₹{product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-xl text-gray-400 line-through font-medium mb-1">₹{product.compareAtPrice.toFixed(2)}</span>
              )}
              <span className="text-sm font-medium text-gray-500 mb-2 ml-2">incl. of all taxes</span>
            </div>

            <div className="prose prose-lg text-gray-600 mb-10 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center border-2 border-gray-200 rounded-full h-14 w-36 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 text-gray-500 hover:text-orange-600 transition-colors h-full flex items-center justify-center"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly 
                  className="w-full text-center border-none focus:ring-0 p-0 font-bold text-lg text-gray-900 bg-transparent"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 text-gray-500 hover:text-orange-600 transition-colors h-full flex items-center justify-center"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 h-14 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl ${
                  isAdded 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-900 text-white hover:bg-orange-600 hover:-translate-y-1'
                }`}
              >
                <ShoppingBag className="h-5 w-5 mr-3" />
                {isAdded ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 py-8 border-y border-gray-200 mb-10">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center mr-3">
                  <Truck className="h-5 w-5 text-orange-600" />
                </div>
                Free shipping over ₹2000
              </div>
              <div className="flex items-center text-sm font-medium text-gray-700">
                <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center mr-3">
                  <ShieldCheck className="h-5 w-5 text-orange-600" />
                </div>
                100% Secure Payment
              </div>
              <div className="flex items-center text-sm font-medium text-gray-700">
                <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center mr-3">
                  <RotateCcw className="h-5 w-5 text-orange-600" />
                </div>
                7 Days Return Policy
              </div>
              <div className="flex items-center text-sm font-medium text-gray-700">
                <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center mr-3">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
                Premium Food Grade
              </div>
            </div>

            {/* Bulk Order CTA */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-8 border border-orange-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-200 rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Need this in bulk?</h3>
                <p className="text-gray-600 mb-6 font-medium">Get special wholesale pricing for orders above 500 units. Perfect for bakeries and cafes.</p>
                <Link to="/bulk" className="inline-flex items-center px-6 py-3 bg-white text-orange-600 font-bold rounded-full border border-orange-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 shadow-sm hover:shadow-md">
                  Request Wholesale Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
