import React from 'react';
import { motion } from 'motion/react';

export default function Returns() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tighter uppercase">Returns & Refunds</h1>
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p>We want you to be completely satisfied with your purchase. If there's an issue, we're here to help.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Damaged or Defective Items</h2>
            <p>If you receive a damaged or defective product, please contact us within 48 hours of delivery with photos of the damage. We will arrange a replacement or a full refund.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Non-Returnable Items</h2>
            <p>Due to the food-grade nature of our packaging products, we cannot accept returns for items that have been opened, used, or are in a non-resalable condition unless they were received damaged.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Refund Process</h2>
            <p>Once your return is approved, the refund will be processed to your original payment method within 7-10 business days.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
