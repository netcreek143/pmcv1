import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tighter uppercase">Contact Us</h1>
            <p className="text-lg text-gray-600 mb-12">
              Have questions about our products or need help with a bulk order? 
              Our team is here to assist you. Reach out to us through any of the channels below.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="p-3 bg-brand-light rounded-xl mr-4">
                  <Mail className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Email Us</h3>
                  <p className="text-gray-600">hello@packmycake.com</p>
                  <p className="text-gray-600">support@packmycake.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-3 bg-brand-light rounded-xl mr-4">
                  <Phone className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Call Us</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-gray-500 text-sm">Mon-Sat, 10am - 7pm</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-3 bg-brand-light rounded-xl mr-4">
                  <MapPin className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Visit Our Warehouse</h3>
                  <p className="text-gray-600">123 Bakery Lane, Industrial Area Phase II,</p>
                  <p className="text-gray-600">Mumbai, Maharashtra 400001</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <Send className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-600">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-brand font-bold hover:text-brand-dark underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Name</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
                    <input 
                      type="email" required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Subject</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none transition-all"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Message</label>
                  <textarea 
                    rows={5} required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none transition-all"
                    placeholder="Tell us more..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-brand text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand-light"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
