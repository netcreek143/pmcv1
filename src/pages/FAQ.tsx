import React from 'react';
import { motion } from 'motion/react';

const faqs = [
  {
    question: "What is the minimum order quantity?",
    answer: "We don't have a strict minimum order quantity for most items. However, buying in bulk (packs of 10, 50, or 100) often provides better value. Some specialized items may have a minimum pack size."
  },
  {
    question: "How long does delivery take?",
    answer: "For major cities in India, delivery typically takes 3-5 business days. For other regions, it may take 5-7 business days. We provide tracking information as soon as your order is shipped."
  },
  {
    question: "Do you offer custom branding on boxes?",
    answer: "Yes, we offer custom printing for bulk orders (minimum 500-1000 units depending on the product). Please contact our support team for a personalized quote."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns for damaged or defective items within 48 hours of delivery. Due to the food-grade nature of our products, we cannot accept returns for items that have been opened or used."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within India. We are looking to expand our shipping capabilities to other countries in the near future."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking link. You can also view your order status in your Profile page under Order History."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tighter uppercase text-center">Frequently Asked Questions</h1>
          
          <div className="space-y-6 mt-12">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-4">Still have questions?</p>
            <a 
              href="/contact" 
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
