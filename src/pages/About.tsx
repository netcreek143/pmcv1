import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tighter uppercase">About Pack My Cake</h1>
          
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p>
              Welcome to <strong>Pack My Cake</strong>, your premier destination for high-quality bakery packaging solutions in India. 
              We understand that a cake isn't just a dessert; it's a celebration, a gift, and a masterpiece. 
              Our mission is to provide the perfect packaging that reflects the love and effort you put into your creations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Story</h2>
            <p>
              Founded with a passion for both baking and design, Pack My Cake started as a small initiative to help local bakers 
              find sturdy and elegant packaging. Today, we serve thousands of home bakers and commercial bakeries across the country, 
              offering a wide range of products from classic white boxes to premium gold-foiled boards.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Premium Quality:</strong> We use food-grade materials that are both sturdy and safe.</li>
              <li><strong>Elegant Design:</strong> Our packaging is designed to enhance the visual appeal of your baked goods.</li>
              <li><strong>Sustainability:</strong> We are committed to increasing our range of eco-friendly and recyclable packaging.</li>
              <li><strong>Fast Delivery:</strong> We know the baking business moves fast, and so do we.</li>
            </ul>

            <div className="mt-16 p-8 bg-orange-50 rounded-3xl border border-orange-100">
              <h3 className="text-xl font-bold text-orange-900 mb-2">Our Vision</h3>
              <p className="text-orange-800 italic">
                "To be the most trusted partner for every baker in India, providing packaging that turns every delivery into a delightful experience."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
