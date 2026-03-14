import React from 'react';
import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tighter uppercase">Privacy Policy</h1>
          
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p className="text-sm text-gray-400">Last Updated: March 14, 2026</p>
            
            <p>
              At Pack My Cake, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, 
              and safeguard your personal information when you visit our website and use our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, place an order, 
              or contact our support team. This may include your name, email address, phone number, and shipping address.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>To process and fulfill your orders.</li>
              <li>To communicate with you about your orders and provide customer support.</li>
              <li>To send you promotional offers and updates (you can opt-out at any time).</li>
              <li>To improve our website and services.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Data Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. 
              Your payment information is processed securely through Stripe and is never stored on our servers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Cookies</h2>
            <p>
              We use cookies to enhance your experience on our website, such as keeping you logged in and remembering items in your cart. 
              You can choose to disable cookies through your browser settings, but this may affect some functionality of the site.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@packmycake.com.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
