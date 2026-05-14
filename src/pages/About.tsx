import { motion } from "motion/react";
import { Shield, Users, Leaf, Calendar, Heart, Award } from "lucide-react";

const VALUES = [
  { title: "Safe Journey", desc: "Your safety is our top priority with high-altitude ready logistics.", icon: Shield },
  { title: "Local Expertise", desc: "Our guides are born and raised in Dharchula and the Kumaon region.", icon: Users },
  { title: "Sustainable Travel", desc: "We prioritize eco-friendly protocols to protect the pristine Himalayas.", icon: Leaf },
  { title: "Cultural Respect", desc: "Helping you connect with local traditions and spiritual heritages.", icon: Heart },
  { title: "24/7 Support", desc: "Round the clock assistance from start to end of your yatra.", icon: Calendar },
  { title: "Best Pricing", desc: "Premium spiritual experiences at the most competitive costs.", icon: Award },
];

export default function About() {
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
            Our <span className="text-primary italic">Heritage</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl text-lg font-light leading-relaxed italic">
            12+ years of pioneering safe expeditions to the sacred peaks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-40">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold font-serif mb-8 leading-tight">
              Pioneers of <span className="text-primary italic">Himalayan Yatras</span>
            </h2>
            <div className="space-y-6 text-gray-500 text-lg font-light leading-relaxed">
              <p>
                Founded in the heart of Dharchula, Adi-Kailash Tours was born from a deep love for our mountains and a mission to make sacred pilgrimages accessible and safe for everyone.
              </p>
              <p>
                As a licensed operator by the UK Tourism Board, we prioritize safety above all else, ensuring every pilgrim experiences the divine silence of the Himalayas without compromise.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="relative group curso-pointer"
          >
            <div className="relative w-full rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
              <img 
                src="/images/about.jpg" 
                alt="Mountain View" 
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-primary text-white p-10 rounded-[2rem] shadow-xl hidden lg:block transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">
              <p className="text-5xl font-bold mb-1 font-serif">12+</p>
              <p className="text-xs font-bold uppercase tracking-widest">Years Excellence</p>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {VALUES.map((val, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.1 }} 
              viewport={{ once: true }}
              className="p-12 card-white group hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <val.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif">{val.title}</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Message */}
        <div className="mt-40 p-20 rounded-[4rem] bg-white border border-slate-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-10 flex items-center justify-center text-3xl font-bold text-primary border border-primary/20 shadow-sm font-serif">
            AM
          </div>
          <h2 className="text-3xl font-bold font-serif italic mb-8 leading-relaxed">"Our aim is not just to take you to the mountains, but to help you find the mountain within yourself."</h2>
          <div className="space-y-1">
            <p className="font-bold text-mountain-dark uppercase tracking-widest text-xs">Amit Mahar</p>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest">Founder, Adi-Kailash Tours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
