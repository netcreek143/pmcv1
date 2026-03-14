import React from 'react';
import { motion } from 'motion/react';
import { Truck, ShieldCheck, Zap } from 'lucide-react';

export default function Bulk() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tighter uppercase">Wholesale & Bulk Enquiry</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl">
            Are you a large-scale bakery or a distributor? We offer special pricing and dedicated support for bulk orders.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <Truck className="h-10 w-10 text-orange-600 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Priority Shipping</h3>
              <p className="text-gray-600">Bulk orders get priority processing and specialized logistics handling.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <ShieldCheck className="h-10 w-10 text-orange-600 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Assurance</h3>
              <p className="text-gray-600">Every batch undergoes rigorous quality checks before dispatch.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <Zap className="h-10 w-10 text-orange-600 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tiered Pricing</h3>
              <p className="text-gray-600">The more you buy, the more you save with our volume-based discounts.</p>
            </div>
          </div>

          <div className="bg-orange-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Get a Custom Quote</h2>
            <p className="text-orange-100 mb-8 max-w-2xl text-lg">
              Tell us about your requirements, and our wholesale team will get back to you with a competitive quote within 24 hours.
            </p>
            <a 
              href="mailto:wholesale@packmycake.com" 
              className="inline-block bg-white text-orange-600 px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange-50 transition-colors shadow-xl"
            >
              Email Wholesale Team
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
