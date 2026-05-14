import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

const FAQS = [
  {
    question: "What is the total duration of the Adi Kailash & Om Parvat Yatra?",
    answer: "A complete yatra from Kathgodam or Haldwani usually takes 7 to 8 days, including travel, acclimatization, and the darshan of both Adi Kailash and Om Parvat."
  },
  {
    question: "How much trekking distance is involved?",
    answer: "The yatra is largely motorable via sturdy 4x4 vehicles from Dharchula. However, depending on road conditions and current infrastructure, you may need to trek for 2 to 5 km. Basic physical fitness is required."
  },
  {
    question: "What is the best time to go?",
    answer: "The ideal periods are early summer (mid-May to June) and post-monsoon (September to October). The region receives heavy snowfall in winter and landslides during the monsoon (July-August)."
  },
  {
    question: "What is the minimum and maximum age limit?",
    answer: "Generally, pilgrims between 15 and 55 years of age are permitted. Those above 55 or below 15 must obtain special medical clearance and ensure they are physically fit to endure the high altitudes."
  },
  {
    question: "How is the weather and temperature?",
    answer: "Temperatures range from 5°C to 15°C during the day and can drop below freezing (-2°C to -5°C) at night at higher camps like Gunji and Jolingkong. Expect strong, chilly winds."
  },
  {
    question: "Will my mobile network work?",
    answer: "Mobile connectivity is extremely limited. BSNL networks work selectively near Dharchula and Gunji, but you should prepare to be mostly off-grid during the actual yatra."
  },
  {
    question: "What are the health and blood pressure (BP) requirements?",
    answer: "The yatra reaches altitudes up to 4,700 meters. A normal BP reading (around 120/80 mmHg) is highly recommended. High-altitude sickness (AMS) is a risk, so it's mandatory to consult your doctor, acclimatize properly, and carry prescribed altitude meds."
  },
  {
    question: "What essential items should I carry?",
    answer: "Pack heavy woolens, thermal innerwear, waterproof jackets, sturdy trekking shoes, a personal first-aid kit, power banks (electricity is scarce), UV sunglasses, and multiple copies of valid ID proofs like Aadhar Card or Passport."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 mb-6">
            Frequently Asked <span className="text-primary italic">Questions</span>
          </h2>
          <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
            Everything you need to know about the sacred yatra to Adi Kailash and Om Parvat.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index} 
                className={cn(
                  "border rounded-xl transition-all duration-300",
                  isOpen ? "border-primary shadow-md bg-white" : "border-slate-200 bg-slate-50 hover:border-primary/50"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={cn(
                    "font-bold text-lg pr-8 transition-colors",
                    isOpen ? "text-primary" : "text-slate-800"
                  )}>
                    {faq.question}
                  </span>
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300",
                    isOpen ? "bg-primary text-white rotate-180" : "bg-slate-200 text-slate-500"
                  )}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-slate-600 font-light leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
