import { motion } from "motion/react";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: (formData.get('name') as string) || '',
      mobile: (formData.get('mobile') as string) || '',
      message: (formData.get('message') as string) || '',
      destination: (formData.get('destination') as string) || 'General Inquiry',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "enquiries"), data);
      toast.success("Thank you! Your enquiry has been received. We will get back to you shortly.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "enquiries");
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-surface text-mountain-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-24">
          <div className="w-16 h-1.5 bg-primary mb-6" />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-bold font-serif mb-8"
          >
            Get in <span className="text-primary italic">Touch</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl text-lg font-light leading-relaxed italic">
            Our team is available 24/7 to assist in your divine journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Contact Details */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-12 card-white group hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                  <Phone size={28} />
                </div>
                <h3 className="font-bold text-gray-400 mb-2 uppercase tracking-[0.2em] text-[10px]">Direct Line</h3>
                <p className="text-mountain-dark text-xl font-bold font-serif">+91 9876543210</p>
                <p className="text-mountain-dark text-xl font-bold font-serif">+91 9123456780</p>
              </div>
              <div className="p-12 card-white group hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                  <Mail size={28} />
                </div>
                <h3 className="font-bold text-gray-400 mb-2 uppercase tracking-[0.2em] text-[10px]">Official Email</h3>
                <p className="text-mountain-dark text-lg font-bold font-serif truncate">info@adikailash.travel</p>
              </div>
            </div>

            <div className="p-12 card-white transition-all group overflow-hidden relative shadow-xl shadow-black/[0.02]">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-3xl font-bold font-serif">Our Base</h3>
                </div>
                <p className="text-gray-500 mb-10 font-light text-lg italic leading-relaxed">
                  Near Main Market, Town Hall Road,<br />
                  Dharchula, Pithoragarh, Uttarakhand,<br />
                  India - 262545
                </p>
                <div className="h-[300px] rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner">
                   <iframe 
                    src={import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=Dharchula,+Uttarakhand` : "https://maps.google.com/maps?q=Dharchula,+Uttarakhand+262545&t=&z=13&ie=UTF8&iwloc=&output=embed"}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-16 rounded-[3rem] bg-white border border-slate-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold font-serif mb-12 text-mountain-dark">Send an Enquiry</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 block">Full Name</label>
                  <input name="name" required type="text" placeholder="John Doe" className="w-full px-8 py-4 bg-slate-surface border border-slate-100 rounded-2xl focus:outline-none focus:border-primary text-mountain-dark font-medium transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 block">Mobile Number</label>
                  <input name="mobile" required type="tel" placeholder="+91" className="w-full px-8 py-4 bg-slate-surface border border-slate-100 rounded-2xl focus:outline-none focus:border-primary text-mountain-dark font-medium transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 block">Interested Package</label>
                  <select name="destination" className="w-full px-8 py-4 bg-slate-surface border border-slate-100 rounded-2xl focus:outline-none focus:border-primary text-mountain-dark font-medium transition-all appearance-none cursor-pointer italic">
                    <option value="Adi Kailash Yatra">Adi Kailash Yatra</option>
                    <option value="Om Parvat Tour">Om Parvat Tour</option>
                    <option value="Full Circuit">Full Spiritual Circuit</option>
                    <option value="General Info">Other Information</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 block">How can we help?</label>
                  <textarea name="message" required placeholder="Tell us about your soul's calling..." className="w-full px-8 py-4 bg-slate-surface border border-slate-100 rounded-2xl focus:outline-none focus:border-primary text-mountain-dark font-medium h-40 resize-none transition-all" />
                </div>
                <button 
                  disabled={isSubmitting}
                  className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:text-gray-400 "
                >
                  {isSubmitting ? "Sending..." : <>Send Message <Send size={18} /></>}
                </button>
              </form>

              <div className="mt-12 pt-10 border-t border-slate-100 flex items-center gap-4 text-primary font-bold justify-center cursor-pointer hover:bg-slate-50 p-6 rounded-3xl transition-all" onClick={() => window.open("https://wa.me/919876543210")}>
                <MessageCircle size={24} /> 
                <span className="uppercase tracking-widest text-xs">WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
