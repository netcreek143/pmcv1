import React from 'react';
import { motion } from 'motion/react';
import { Palette, Scissors, CheckCircle } from 'lucide-react';

export default function Custom() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tighter uppercase">Custom Packaging</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl">
            Make your brand stand out with personalized packaging. From custom sizes to branded printing, we bring your vision to life.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="p-3 bg-orange-50 rounded-xl mr-4">
                  <Palette className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Branded Printing</h3>
                  <p className="text-gray-600">Add your logo, brand colors, and custom designs to our high-quality boxes.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-3 bg-orange-50 rounded-xl mr-4">
                  <Scissors className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Dimensions</h3>
                  <p className="text-gray-600">Need a specific size? We can manufacture boxes tailored to your unique product dimensions.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-3 bg-orange-50 rounded-xl mr-4">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Low Minimums</h3>
                  <p className="text-gray-600">We offer custom branding starting from as low as 500 units for select products.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800" 
                alt="Custom Packaging" 
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs">
                <p className="text-gray-900 font-bold italic">"Our custom boxes from Pack My Cake helped us increase our brand recognition by 40%!"</p>
                <p className="text-gray-500 text-sm mt-2">- Sarah, Boutique Baker</p>
              </div>
            </div>
          </div>

          <div className="text-center bg-gray-900 text-white rounded-3xl p-16">
            <h2 className="text-3xl font-bold mb-6">Ready to start your custom project?</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">
              Our design experts are ready to help you create packaging that leaves a lasting impression.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-orange-600 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange-700 transition-colors shadow-xl"
            >
              Request a Consultation
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
