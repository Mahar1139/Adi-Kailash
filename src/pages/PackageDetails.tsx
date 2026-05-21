import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { formatCurrency, cn } from "../lib/utils";
import { Check, MapPin, Coffee, Car, ShieldCheck, Calendar, Users, MessageSquare } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { TourPackage } from "../types";
import { SAMPLE_PACKAGES } from "../lib/data";
import Tilt from "react-parallax-tilt";

export default function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'info'>('itinerary');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "packages", id), (docSnap) => {
      if (docSnap.exists()) {
        setPkg({ id: docSnap.id, ...docSnap.data() } as TourPackage);
      } else {
        const fallback = SAMPLE_PACKAGES.find(p => p.id === id) || null;
        setPkg(fallback);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `packages/${id}`);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center pt-32 pb-24"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!pkg) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h1 className="text-4xl">Package not found</h1>
        <Link to="/packages" className="text-saffron mt-4 inline-block">Back to Packages</Link>
      </div>
    );
  }

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      packageId: pkg.id,
      packageName: pkg.title,
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      travelers: Number(formData.get('travelers')),
      travelDate: formData.get('travelDate'),
      specialRequests: formData.get('specialRequests') || "",
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "bookings"), data);
      toast.success("Booking enquiry sent successfully! Our team will contact you soon.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "bookings");
      toast.error("Failed to send booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20 bg-slate-surface">
      {/* Banner */}
      <div className="relative h-[65vh]">
        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-mountain-dark/90 via-mountain-dark/20 to-transparent" />
        <div className="absolute bottom-20 left-0 w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <div className="bg-primary text-white px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-[0.2em] inline-block mb-6 shadow-xl">
                {pkg.duration} Journey
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                {pkg.title}
              </h1>
              <div className="flex flex-wrap gap-8 text-white/90">
                <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-[10px] bg-white/10 backdrop-blur-md px-4 py-2 rounded-md border border-white/10">
                  <MapPin size={14} className="text-primary" /> Uttarakhand, India
                </div>
                <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-[10px] bg-white/10 backdrop-blur-md px-4 py-2 rounded-md border border-white/10">
                  <Car size={14} className="text-primary" /> Private Transport
                </div>
                <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-[10px] bg-white/10 backdrop-blur-md px-4 py-2 rounded-md border border-white/10">
                  <Coffee size={14} className="text-primary" /> All Meals
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
              <button 
                onClick={() => setActiveTab('itinerary')}
                className={cn(
                  "px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-md transition-all whitespace-nowrap border-2",
                  activeTab === 'itinerary' ? "bg-primary border-primary text-white shadow-xl" : "bg-white border-slate-100 text-gray-400 hover:text-mountain-dark"
                )}
              >
                Detailed Itinerary
              </button>
              <button 
                onClick={() => setActiveTab('info')}
                className={cn(
                  "px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-md transition-all whitespace-nowrap border-2",
                  activeTab === 'info' ? "bg-primary border-primary text-white shadow-xl" : "bg-white border-slate-100 text-gray-400 hover:text-mountain-dark"
                )}
              >
                Tour Information
              </button>
            </div>

            {activeTab === 'itinerary' ? (
              <div className="space-y-16">
                {pkg.itinerary && pkg.itinerary.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative pl-16 border-l-4 border-slate-100 last:border-transparent pb-16 last:pb-0"
                  >
                    <div className="absolute left-[-14px] top-0 w-6 h-6 bg-primary rounded-full shadow-lg border-4 border-white" />
                    <div className="mb-6">
                      <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase block mb-2">Day {item.day}</span>
                      <h3 className="text-3xl font-black text-mountain-dark uppercase tracking-tight">{item.title}</h3>
                    </div>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest leading-relaxed">{item.activities}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-12">
                {/* Add new details here */}
                {(pkg.baseCamp || pkg.altitude || pkg.grade || pkg.stay || pkg.distance || pkg.eligibilityAge || pkg.fitness || pkg.meals) && (
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Trip <span className="text-primary italic">Overview</span></h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                      {pkg.baseCamp && <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"><p className="text-[10px] text-gray-500 uppercase font-black mb-1">Base Camp</p><p className="font-bold">{pkg.baseCamp}</p></div>}
                      {pkg.altitude && <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"><p className="text-[10px] text-gray-500 uppercase font-black mb-1">Max Altitude</p><p className="font-bold">{pkg.altitude}</p></div>}
                      {pkg.grade && <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"><p className="text-[10px] text-gray-500 uppercase font-black mb-1">Grade</p><p className="font-bold">{pkg.grade}</p></div>}
                      {pkg.distance && <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"><p className="text-[10px] text-gray-500 uppercase font-black mb-1">Distance</p><p className="font-bold">{pkg.distance}</p></div>}
                      {pkg.stay && <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"><p className="text-[10px] text-gray-500 uppercase font-black mb-1">Stay / Accomm.</p><p className="font-bold">{pkg.stay}</p></div>}
                      {pkg.meals && <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"><p className="text-[10px] text-gray-500 uppercase font-black mb-1">Meals</p><p className="font-bold">{pkg.meals}</p></div>}
                      {pkg.eligibilityAge && <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"><p className="text-[10px] text-gray-500 uppercase font-black mb-1">Eligibility Age</p><p className="font-bold">{pkg.eligibilityAge}</p></div>}
                      {pkg.fitness && <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"><p className="text-[10px] text-gray-500 uppercase font-black mb-1">Fitness Req.</p><p className="font-bold">{pkg.fitness}</p></div>}
                    </div>
                  </div>
                )}
                
                {pkg.healthAwareness && (
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Health & <span className="text-primary italic">Awareness</span></h3>
                    <div className="bg-slate-50 p-6 rounded-xl border-l-[6px] border-red-500 shadow-sm leading-relaxed text-sm mb-16">
                      {pkg.healthAwareness}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-8">What's <span className="text-primary italic">Included</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pkg.includes && pkg.includes.map((item) => (
                      <div key={item} className="flex items-center gap-4 p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Check className="text-primary" size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-8 mt-16">
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Essential <span className="text-primary italic">Notes</span></h3>
                  <div className="p-8 bg-white rounded-xl border-l-[6px] border-primary shadow-xl">
                    <div className="flex gap-6">
                      <ShieldCheck className="text-primary shrink-0" size={32} />
                      <div>
                        <h4 className="font-black text-mountain-dark uppercase tracking-wide mb-2">Safety Protocols</h4>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">All our tours are led by certified local guides with high-altitude experience. Oxygen cylinders and medical kits are provided in transport.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 bg-white rounded-xl border-l-[6px] border-mountain-dark shadow-xl">
                    <div className="flex gap-6">
                      <Calendar className="text-mountain-dark shrink-0" size={32} />
                      <div>
                        <h4 className="font-black text-mountain-dark uppercase tracking-wide mb-2">Peak Season Info</h4>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">For {pkg.title}, the ideal window is between May and June for high visibility, or September to October for lush landscapes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} perspective={2000} scale={1.01} transitionSpeed={2500} glareEnable={true} glareMaxOpacity={0.1} glarePosition="all" trackOnWindow={true}>
                <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden transform-style-3d">
                  <div className="bg-mountain-dark p-10 text-white transform translate-z-[10px]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total package price</p>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-5xl font-black uppercase tracking-tighter">{formatCurrency(pkg.price)}</h2>
                      <span className="text-gray-400 font-bold text-[10px] uppercase">/ Person</span>
                    </div>
                  </div>
                  
                  <form onSubmit={handleBookingSubmit} className="p-10 space-y-8 transform translate-z-[20px] bg-white">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Full Name</label>
                      <div className="relative">
                        <input name="fullName" type="text" required placeholder="John Doe" className="input-field pl-12 shadow-inner" />
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Email Address</label>
                        <input name="email" type="email" required placeholder="john@email.com" className="input-field shadow-inner" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Phone Number</label>
                        <input name="phone" type="tel" required placeholder="+91" className="input-field shadow-inner" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Travel Date</label>
                      <input name="travelDate" type="date" required className="input-field shadow-inner" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Preferred Travelers</label>
                      <input name="travelers" type="number" required min="1" max="20" defaultValue="1" className="input-field shadow-inner" />
                    </div>
                    
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white py-6 rounded-2xl font-black shadow-xl shadow-red-500/20 hover:bg-red-700 hover:scale-[1.02] transform transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:text-gray-400 uppercase tracking-[0.2em] text-xs translate-z-[10px]"
                    >
                      {isSubmitting ? "Processing..." : "Confirm Booking Enquiry"}
                    </button>
                    <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">No payment required. Our team will contact you for verification.</p>
                  </form>
                </div>
              </Tilt>

              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} transitionSpeed={1000}>
                <div className="mt-8 p-8 bg-slate-900 rounded-[2rem] flex items-center gap-6 text-white border border-slate-800 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)] transform-style-3d">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 transform translate-z-[30px] shadow-lg">
                    <MessageSquare size={24} className="text-primary" />
                  </div>
                  <div className="transform translate-z-[20px]">
                    <h4 className="font-black text-sm uppercase tracking-tight">Need assistance?</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Talk to an expert at +91 9876543210</p>
                  </div>
                </div>
              </Tilt>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
