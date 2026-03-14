import React from 'react';
import { motion } from 'motion/react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tighter uppercase">Terms of Service</h1>
          
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p className="text-sm text-gray-400">Last Updated: March 14, 2026</p>
            
            <p>
              By accessing and using the Pack My Cake website, you agree to comply with and be bound by the following terms and conditions. 
              Please read them carefully.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Use of the Website</h2>
            <p>
              You must be at least 18 years old to use this website. You agree to use the website only for lawful purposes 
              and in a way that does not infringe the rights of others.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Product Information</h2>
            <p>
              We strive to provide accurate descriptions and images of our products. However, we do not warrant that the 
              descriptions or other content are completely accurate, reliable, or error-free.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Pricing and Payments</h2>
            <p>
              All prices are in Indian Rupees (INR) and are subject to change without notice. 
              Payments are processed securely through our third-party payment processor, Stripe.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Shipping and Delivery</h2>
            <p>
              Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers 
              or other factors outside our control.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Limitation of Liability</h2>
            <p>
              Pack My Cake shall not be liable for any direct, indirect, incidental, or consequential damages resulting from 
              the use or inability to use our products or website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the website after any changes 
              constitutes your acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Governing Law</h2>
            <p>
              These terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction 
              of the courts in Mumbai.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
