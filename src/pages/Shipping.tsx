import React from 'react';
import { motion } from 'motion/react';

export default function Shipping() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tighter uppercase">Shipping Policy</h1>
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p>We ship across India using reliable courier partners. Here's what you need to know about our shipping process:</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Shipping Charges</h2>
            <p>Standard shipping charges apply to all orders below ₹2,000. Orders above ₹2,000 qualify for free standard shipping.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Delivery Timeline</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Metro Cities:</strong> 3-5 business days.</li>
              <li><strong>Other Cities:</strong> 5-7 business days.</li>
              <li><strong>Remote Areas:</strong> 7-10 business days.</li>
            </ul>
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Order Tracking</h2>
            <p>Once your order is dispatched, you will receive a tracking ID via email and SMS. You can use this ID to track your shipment on our partner's website.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
