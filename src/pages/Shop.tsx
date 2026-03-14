import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, ShoppingBag, Package, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useCartStore } from '../store/cart';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: string;
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);

  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const productsUrl = new URL('/api/products', window.location.origin);
    if (searchQuery) productsUrl.searchParams.append('search', searchQuery);
    if (categoryQuery) productsUrl.searchParams.append('category', categoryQuery);

    Promise.all([
      fetch(productsUrl.toString()).then(res => res.json()),
      fetch('/api/categories').then(res => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [searchQuery, categoryQuery]);

  const clearFilters = () => {
    setSearchParams({});
  };

  const toggleCategory = (slug: string) => {
    if (categoryQuery === slug) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      setSearchParams(newParams);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('category', slug);
      setSearchParams(newParams);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" as const }
    }
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen">
      {/* Header Banner */}
      <div className="bg-gray-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Shop Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Discover our premium range of bakery packaging solutions designed to make your creations stand out.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-between items-center mb-8 pb-6 border-b border-gray-200 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-gray-600 font-medium">Showing <span className="text-gray-900 font-bold">{products.length}</span> products</p>
            {(searchQuery || categoryQuery) && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                    Search: {searchQuery}
                    <button onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('search');
                      setSearchParams(newParams);
                    }} className="ml-1.5 hover:text-orange-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {categoryQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold">
                    Category: {categories.find(c => c.slug === categoryQuery)?.name || categoryQuery}
                    <button onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('category');
                      setSearchParams(newParams);
                    }} className="ml-1.5 hover:text-gray-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button 
                  onClick={clearFilters}
                  className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors underline underline-offset-4"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
            <div className="relative">
              <select className="appearance-none bg-transparent pr-8 py-2 font-medium text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0 hidden md:block">
            <div className="space-y-10 sticky top-24">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Categories</h3>
                <ul className="space-y-3">
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <label className="flex items-center group cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={categoryQuery === cat.slug}
                          onChange={() => toggleCategory(cat.slug)}
                          className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 transition-colors cursor-pointer" 
                        /> 
                        <span className={`ml-3 transition-colors ${categoryQuery === cat.slug ? 'text-orange-600 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Price Range</h3>
                <ul className="space-y-3">
                  <li><label className="flex items-center group cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 transition-colors cursor-pointer" /> <span className="ml-3 text-gray-600 group-hover:text-gray-900 transition-colors">Under ₹500</span></label></li>
                  <li><label className="flex items-center group cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 transition-colors cursor-pointer" /> <span className="ml-3 text-gray-600 group-hover:text-gray-900 transition-colors">₹500 - ₹1000</span></label></li>
                  <li><label className="flex items-center group cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 transition-colors cursor-pointer" /> <span className="ml-3 text-gray-600 group-hover:text-gray-900 transition-colors">Over ₹1000</span></label></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[4/5] rounded-2xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {products.map(product => {
                  const images = JSON.parse(product.images || '[]');
                  const mainImage = images[0] || 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&q=80&w=400';
                  return (
                    <motion.div key={product.id} variants={itemVariants} className="group flex flex-col">
                      <Link to={`/product/${product.slug}`} className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-[4/5] mb-4">
                        <img 
                          src={mainImage} 
                          alt={product.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {product.compareAtPrice && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Sale
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent flex justify-center">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              addItem({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: mainImage,
                                quantity: 1
                              });
                            }}
                            className="bg-white text-gray-900 font-bold py-3 px-6 rounded-full w-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors shadow-lg"
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
                          </button>
                        </div>
                      </Link>
                      <div className="flex flex-col flex-grow">
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{product.category?.name}</div>
                        <Link to={`/product/${product.slug}`} className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                          {product.name}
                        </Link>
                        <div className="mt-auto flex items-center gap-2">
                          <span className="text-lg font-extrabold text-gray-900">₹{product.price.toFixed(2)}</span>
                          {product.compareAtPrice && (
                            <span className="text-sm text-gray-400 line-through font-medium">₹{product.compareAtPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 max-w-md mx-auto">We couldn't find any products matching your current filters. Try adjusting your search criteria.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-6 bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
