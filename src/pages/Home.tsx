import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Package, ShoppingBag } from 'lucide-react';
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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          setFeaturedProducts(data.slice(0, 4));
        } else {
          console.error('Expected array, got:', data);
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#fdfbf7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
              className="z-10"
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-brand-light text-brand-dark text-xs font-bold tracking-wider uppercase mb-6">
                Premium Bakery Packaging
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                Elevate Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">
                  Bakes & Cakes
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg font-medium leading-relaxed">
                High-quality, sturdy, and beautiful packaging solutions designed specifically for professional bakers and confectioneries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop" className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white bg-gray-900 hover:bg-brand transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Shop Collection
                </Link>
                <Link to="/bulk" className="inline-flex justify-center items-center px-8 py-4 border-2 border-gray-200 text-base font-bold rounded-full text-gray-900 bg-transparent hover:border-gray-900 transition-all duration-300">
                  Wholesale Enquiry
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" as const }}
              className="relative h-[500px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&q=80&w=1000" 
                alt="Premium Cake Boxes" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-y border-gray-100 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { icon: Truck, title: "Pan India Delivery", desc: "Fast & reliable shipping" },
              { icon: ShieldCheck, title: "Premium Quality", desc: "Food-grade materials" },
              { icon: Package, title: "Bulk Discounts", desc: "Special rates for bakers" },
              { icon: Star, title: "Top Rated", desc: "Trusted by 10,000+ bakers" }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex flex-col items-center group">
                <div className="h-16 w-16 rounded-2xl bg-brand-light flex items-center justify-center mb-4 group-hover:bg-brand-light/70 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-brand" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Trending Now</h2>
              <p className="mt-3 text-lg text-gray-600">Our most popular packaging solutions this week.</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center text-brand font-bold hover:text-brand-dark transition-colors group">
              View All Products <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[4/5] rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {featuredProducts.map((product) => {
                const images = JSON.parse(product.images);
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
                      <div className="absolute inset-0 bg-brand/50 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-60"></div>
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
                          className="bg-white text-gray-900 font-bold py-3 px-6 rounded-full w-full flex items-center justify-center hover:bg-brand hover:text-white transition-colors shadow-lg"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
                        </button>
                      </div>
                    </Link>
                    <div className="flex flex-col flex-grow">
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{product.category.name}</div>
                      <Link to={`/product/${product.slug}`} className="text-lg font-bold text-gray-900 hover:text-brand transition-colors line-clamp-2 mb-2">
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
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-[#fdfbf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="mt-4 text-lg text-gray-600">Find exactly what you need for your creations.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {[
              { name: 'Cake Boxes', image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&q=80&w=800' },
              { name: 'Cake Boards', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800' },
              { name: 'Cupcake Boxes', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800' },
              { name: 'Macaron Boxes', image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800' },
              { name: 'Bags & Totes', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800' },
              { name: 'Accessories', image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&q=80&w=800' },
            ].map((category, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link to={`/category/${category.name.toLowerCase().replace(/ /g, '-')}`} className="group relative block rounded-3xl overflow-hidden aspect-[4/3] bg-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <span className="inline-flex items-center text-sm font-bold text-white/90 group-hover:text-brand transition-colors">
                      Explore Collection <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 text-center">
            <Link to="/categories" className="inline-flex justify-center items-center px-8 py-4 border-2 border-gray-900 text-base font-bold rounded-full text-gray-900 bg-transparent hover:bg-gray-900 hover:text-white transition-all duration-300">
              View All Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
