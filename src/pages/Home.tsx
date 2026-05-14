import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Compass, ShieldCheck, Heart, UserCheck, ArrowRight, Star, ChevronDown, MapPin, Clock } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { TourPackage } from "../types";
import FAQSection from "../components/FAQSection";

const HIGHLIGHTS = [
  { title: "Adi Kailash Yatra", desc: "The divine replica of Mt. Kailash.", icon: Compass },
  { title: "Om Parvat Darshan", desc: "Nature's miracle – snow forming the Om symbol.", icon: Star },
  { title: "Narayan Ashram", desc: "A place of peace and spiritual wisdom.", icon: Heart },
  { title: "Gunji Village", desc: "Cultural crossroad of heritage and beauty.", icon: UserCheck },
];

const FAQS = [
  { q: "What is the best time for Adi Kailash Yatra?", a: "The best time is from late May to early July and from September to October." },
  { q: "Is a permit required?", a: "Yes, inner line permits are mandatory and we handle the entire process for you." },
  { q: "What is the difficulty level of the trek?", a: "The journey is now mostly by road, but some moderate hiking may be involved for better views." },
];

export default function Home() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  
  useEffect(() => {
    const q = query(collection(db, "packages"), limit(3));
    const unsub = onSnapshot(q, (snap) => {
      const p = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as TourPackage);
      setPackages(p);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "packages");
    });
    return () => unsub();
  },[]);
  return (
    <div className="relative min-h-screen pt-4 overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 px-6 py-12 lg:py-24 items-center">
        {/* Left: Hero Section */}
        <div className="lg:col-span-7 flex flex-col justify-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-5 py-2 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest border border-primary/20 inline-block mb-4">
              Divine Journey 2026
            </span>
            <h1 className="text-5xl md:text-8xl font-bold mt-6 leading-[1.1] text-mountain-dark font-serif">
              Experience <br/><span className="text-primary italic">Divine Peaks</span> of Adi Kailash
            </h1>
            <p className="mt-8 text-gray-500 text-lg leading-relaxed max-w-xl font-light">
              Embark on a soul-stirring pilgrimage to Om Parvat and Adi Kailash. Discover the untouched beauty of the Kumaon Himalayas with safest hands.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <Link to="/packages" className="btn-primary">
              Book My Yatra
            </Link>
            <Link to="/gallery" className="px-8 py-3 bg-white border border-slate-200 rounded-full text-mountain-dark font-bold hover:bg-slate-50 transition-all shadow-sm">
              View Gallery
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            {[
              { title: "Safe Passage", desc: "Expert local guides", img: "/images/guide.jpg" },
              { title: "Sacred Stays", desc: "Best-in-class comfort", img: "/images/stay.jpg" },
              { title: "Full Support", desc: "24/7 travel assistance", img: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=600" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 group overflow-hidden relative flex flex-col items-center text-center hover:-translate-y-2"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6 shadow-lg border-2 border-primary/10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 relative">
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="relative z-10 font-bold text-mountain-dark text-lg font-serif">{f.title}</div>
                <div className="relative z-10 text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest leading-relaxed">
                  {f.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Featured Widget */}
        <div className="lg:col-span-5">
           <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-[3rem] p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden"
          >
            <div className="relative z-10 text-center">
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop" 
                alt="Adi Kailash" 
                className="w-full h-48 object-cover rounded-3xl mb-8 shadow-inner"
              />
              <h3 className="text-4xl font-bold mb-2 font-serif text-mountain-dark">Adi Kailash</h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-8">Pithoragarh, Uttarakhand</p>
              
              <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                 <div className="text-left">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Starting from</p>
                   <p className="text-3xl font-bold text-primary">₹28,999</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Valid till</p>
                   <p className="text-sm font-bold text-mountain-dark">June 2026</p>
                 </div>
              </div>

              <Link to="/packages" className="btn-primary w-full block text-center">
                Check Availability
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Adventure Section */}
      <section className="relative py-32 overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2000" 
            alt="Himalayan Adventure" 
            className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-bold font-serif mb-8 leading-tight text-white drop-shadow-2xl">
              Rediscover the <br/><span className="text-primary italic">Spirit of Adventure</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg font-light text-white/90 mb-12 italic drop-shadow-sm">
              "Beyond the peaks, there is a silence that speaks to the soul. We take you to the places where nature and divinity become one."
            </p>
            <Link to="/packages" className="btn-primary px-12 py-4">
              Explore Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="py-24 bg-slate-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl text-mountain-dark font-serif mb-4">Divine <span className="text-primary italic">Destinations</span></h2>
              <p className="text-gray-400 font-light max-w-md">Our hand-picked packages for the ultimate pilgrimage.</p>
            </div>
            <Link to="/packages" className="text-primary font-bold text-sm tracking-widest uppercase hover:underline">View All</Link>
          </div>
          
          {packages.length === 0 ? (
            <div className="py-20 text-center font-bold text-2xl text-gray-400">
              No Package Available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="card-white group"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2" />
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">
                      {pkg.duration}
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-bold text-mountain-dark mb-3 font-serif group-hover:text-primary transition-colors">{pkg.title}</h3>
                    <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-2xl font-bold text-mountain-dark">{formatCurrency(pkg.price)}</span>
                      <Link to={`/package/${pkg.id}`} className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-90">
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: "Happy Pilgrims", val: "500+", icon: Heart },
            { label: "Safe Passage", val: "Verified", icon: ShieldCheck },
            { label: "Licensed Travel", val: "UK Tourism", icon: MapPin },
            { label: "Years Service", val: "12+ Years", icon: Clock },
          ].map(stat => (
            <div key={stat.label} className="group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 transition-transform group-hover:rotate-12">
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-bold text-mountain-dark mb-1 font-serif">{stat.val}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <FAQSection />
    </div>
  );
}
