import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Recycle, Globe } from 'lucide-react';

export default function Sustainability() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tighter uppercase">Our Commitment to Sustainability</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              At Pack My Cake, we believe that beautiful packaging shouldn't come at the cost of the planet. 
              We are on a journey to make our products as eco-friendly as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="text-center">
              <div className="h-20 w-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Recycle className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recyclable Materials</h3>
              <p className="text-gray-600">Over 80% of our products are made from recyclable paper and cardboard materials.</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Biodegradable Options</h3>
              <p className="text-gray-600">We are expanding our range of compostable and biodegradable packaging solutions.</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ethical Sourcing</h3>
              <p className="text-gray-600">We work with suppliers who prioritize sustainable forestry and ethical labor practices.</p>
            </div>
          </div>

          <div className="bg-green-600 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 lg:p-20 text-white">
                <h2 className="text-3xl font-bold mb-6">The Green Pack Initiative</h2>
                <p className="text-green-100 mb-8 text-lg leading-relaxed">
                  By 2028, we aim to have 100% of our product catalog made from recycled or sustainable materials. 
                  We are also working on reducing our carbon footprint across our supply chain.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <span className="font-bold">FSC Certified Materials</span>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" 
                  alt="Sustainability" 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
