import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getCategoryImage = (slug: string) => {
    switch (slug) {
      case 'cake-boxes': return 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&q=80&w=800';
      case 'cake-boards': return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800';
      case 'cupcake-boxes': return 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800';
      case 'accessories': return 'https://images.unsplash.com/photo-1516054144838-f911e3e73657?auto=format&fit=crop&q=80&w=800';
      default: return 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&q=80&w=800';
    }
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4"
          >
            Browse Categories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Explore our wide range of packaging solutions tailored for every bakery need.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl h-64 shadow-sm border border-gray-100"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={getCategoryImage(category.slug)} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h2 className="text-3xl font-bold text-white mb-2">{category.name}</h2>
                  <p className="text-gray-200 text-sm mb-6 max-w-md line-clamp-2">
                    {category.description || `Premium quality ${category.name.toLowerCase()} for your professional bakery needs.`}
                  </p>
                  <Link 
                    to={`/shop?category=${category.slug}`}
                    className="inline-flex items-center text-white font-bold group/link"
                  >
                    View Collection
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
