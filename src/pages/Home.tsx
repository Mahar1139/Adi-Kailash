import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Compass, ShieldCheck, Heart, UserCheck, ArrowRight, Star, ChevronDown, MapPin, Clock, VolumeX, Volume2 } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { TourPackage } from "../types";
import FAQSection from "../components/FAQSection";
import Tilt from "react-parallax-tilt";

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
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const q = query(collection(db, "packages"), limit(3));
    const unsub = onSnapshot(q, (snap) => {
      const p = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as TourPackage);
      setPackages(p);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "packages");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="w-full bg-slate-900">
      {/* Hero Section Container */}
      <section className="relative w-full min-h-screen flex flex-col justify-end lg:justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 w-full h-full bg-slate-900 group">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover object-top lg:object-center"
          >
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Overlay to ensure text readability but less dark on mobile so video shows through */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent lg:bg-black/40 lg:backdrop-blur-[1px]" />
          
          <button 
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = !isMuted;
              }
              setIsMuted(!isMuted);
            }}
            className="absolute top-24 right-6 lg:bottom-12 lg:top-auto lg:right-12 z-30 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20 shadow-lg"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Hero Content */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-48 pb-16 lg:py-32">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Hero Section */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-6 lg:gap-8">
            <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-5 py-2 bg-white/10 text-white backdrop-blur-md text-xs font-bold rounded-full uppercase tracking-widest border border-white/20 inline-block mb-4 shadow-lg shadow-black/20">
              Divine Journey 2026
            </span>
            <h1 className="text-5xl md:text-8xl font-bold mt-6 leading-[1.1] text-white font-serif drop-shadow-2xl">
              Experience <br/><span className="text-primary italic">Divine Peaks</span> of Adi Kailash
            </h1>
            <p className="mt-8 text-white/80 text-lg leading-relaxed max-w-xl font-light drop-shadow-lg">
              Embark on a soul-stirring pilgrimage to Om Parvat and Adi Kailash. Discover the untouched beauty of the Kumaon Himalayas with safest hands.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <Link to="/packages" className="btn-primary shadow-lg shadow-primary/30">
              Book My Yatra
            </Link>
            <Link to="/gallery" className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold hover:bg-white/20 transition-all shadow-lg hover:shadow-xl">
              View Gallery
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 w-full">
            {[
              { title: "Safe Passage", desc: "Expert local guides", img: "/images/guide.jpg" },
              { title: "Sacred Stays", desc: "Best-in-class comfort", img: "/images/stay.jpg" },
              { title: "Full Support", desc: "24/7 travel assistance", img: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=600" },
            ].map((f, i) => (
              <Tilt key={f.title} glareEnable={true} glareMaxOpacity={0.3} glareColor="white" glarePosition="all" scale={1.02} transitionSpeed={2000}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", bounce: 0.3, duration: 1, delay: i * 0.2 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-3xl hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)] transition-all duration-500 group overflow-hidden relative flex flex-col items-center text-center style-3d"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6 shadow-2xl shadow-black/50 border border-white/20 relative z-10 transition-transform duration-500">
                    <img src={f.img} alt={f.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="relative z-10 font-bold text-white text-lg font-serif">{f.title}</div>
                  <div className="relative z-10 text-[10px] text-white/60 mt-2 font-bold uppercase tracking-widest leading-relaxed">
                    {f.desc}
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </div>

        {/* Right: Featured Widget */}
        <div className="lg:col-span-5 w-full mt-12 lg:mt-0">
           <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} transitionSpeed={2000} glareEnable={true} glareMaxOpacity={0.4} glarePosition="all" className="h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.3, duration: 1.5, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-[3rem] p-8 lg:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden h-full flex flex-col justify-center transform-style-3d"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10 text-center transform translate-z-[50px]">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop" 
                  alt="Adi Kailash" 
                  className="w-full h-48 object-cover rounded-3xl mb-8 shadow-2xl shadow-black/40 border border-white/10"
                />
                <h3 className="text-4xl font-bold mb-2 font-serif text-white drop-shadow-lg">Adi Kailash</h3>
                <p className="text-white/70 font-bold uppercase tracking-widest text-[10px] mb-8 drop-shadow-md">Pithoragarh, Uttarakhand</p>
                
                <div className="flex justify-between items-center bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 mb-8 shadow-inner">
                   <div className="text-left">
                     <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Starting from</p>
                     <p className="text-3xl font-bold text-primary drop-shadow-md">₹28,999</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Valid till</p>
                     <p className="text-sm font-bold text-white">June 2026</p>
                   </div>
                </div>

                <Link to="/packages" className="btn-primary w-full block text-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  Check Availability
                </Link>
              </div>
            </motion.div>
          </Tilt>
        </div>
        </div>
      </main>
      </section>

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
          
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : packages.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="py-20 text-center font-bold text-2xl text-gray-400 border-2 border-dashed border-gray-300 rounded-3xl"
            >
              No Package Available
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, idx) => (
                <Tilt key={pkg.id} tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1500} scale={1.03} transitionSpeed={1500} glareEnable={true} glareMaxOpacity={0.2} glarePosition="all" className="h-full">
                  <motion.div
                    initial={{ opacity: 0, x: idx % 3 === 0 ? -200 : idx % 3 === 2 ? 200 : 0, y: 200, rotate: idx % 3 === 0 ? -45 : idx % 3 === 2 ? 45 : 90, scale: 0.5 }}
                    whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 1.5, delay: idx * 0.2 }}
                    className="card-white group h-full flex flex-col"
                  >
                    <div className="h-64 overflow-hidden relative">
                      <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2" />
                      <div className="absolute top-6 left-6 px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">
                        {pkg.duration}
                      </div>
                    </div>
                    <div className="p-10 flex-1 flex flex-col justify-between">
                      <h3 className="text-2xl font-bold text-mountain-dark mb-3 font-serif group-hover:text-primary transition-colors">{pkg.title}</h3>
                      <div className="pt-6 border-t border-slate-50 flex justify-between items-center mt-auto">
                        <span className="text-2xl font-bold text-mountain-dark">{formatCurrency(pkg.price)}</span>
                        <Link to={`/package/${pkg.id}`} className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-90 relative z-20" onClick={(e) => e.stopPropagation()}>
                          <ArrowRight size={20} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </Tilt>
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
          ].map((stat, i) => (
            <motion.div 
               initial={{ opacity: 0, scale: 0.1, rotate: 360, y: 150 }}
               whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
               viewport={{ once: true, margin: "-50px" }}
               transition={{ type: "spring", bounce: 0.6, duration: 1.5, delay: i * 0.15 }}
               key={stat.label} 
               className="group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 transition-transform group-hover:rotate-12">
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-bold text-mountain-dark mb-1 font-serif">{stat.val}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <FAQSection />
    </div>
  );
}
