import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, ShieldCheck, Zap, X, Send, CheckCircle2 } from 'lucide-react';

export default function Bulk() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset success state and close modal after 2 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 2000);
  };

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
              <Truck className="h-10 w-10 text-brand mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Priority Shipping</h3>
              <p className="text-gray-600">Bulk orders get priority processing and specialized logistics handling.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <ShieldCheck className="h-10 w-10 text-brand mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Assurance</h3>
              <p className="text-gray-600">Every batch undergoes rigorous quality checks before dispatch.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <Zap className="h-10 w-10 text-brand mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tiered Pricing</h3>
              <p className="text-gray-600">The more you buy, the more you save with our volume-based discounts.</p>
            </div>
          </div>

          <div className="bg-brand rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Get a Custom Quote</h2>
              <p className="text-brand-light mb-8 max-w-2xl text-lg">
                Tell us about your requirements, and our wholesale team will get back to you with a competitive quote within 24 hours.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-block bg-white text-brand px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-light hover:text-brand-dark transition-all shadow-xl active:scale-95"
              >
                Get Started
              </button>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </motion.div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20 overflow-hidden"
            >
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                  <p className="text-gray-600">Our wholesale team will contact you shortly.</p>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Bulk Enquiry</h3>
                  <p className="text-gray-600 mb-8">Fill in your details and we'll get back to you.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 ml-1">Full Name</label>
                      <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-900 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 ml-1">Email Address</label>
                        <input 
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-900 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 ml-1">Phone Number</label>
                        <input 
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-900 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 ml-1">Requirements / Message</label>
                      <textarea 
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-900 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all resize-none"
                        placeholder="Tell us about your requirements..."
                      ></textarea>
                    </div>

                    <button 
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full bg-gray-900 text-white rounded-2xl py-4 font-bold uppercase tracking-widest hover:bg-brand transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
                    >
                      {isSubmitting ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Submit Quote Request
                          <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
