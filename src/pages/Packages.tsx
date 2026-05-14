import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../lib/utils";
import { Check, Clock, Users } from "lucide-react";
import { TourPackage } from "../types";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

export default function Packages() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "packages"));
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-32 pb-24"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-24">
          <div className="w-16 h-1.5 bg-primary mb-6" />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-bold font-serif mb-8"
          >
            Spiritual <span className="text-primary italic">Journeys</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl text-lg font-light leading-relaxed italic">
            "The journey of a thousand peaks begins with a single step of faith."
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="py-20 text-center font-bold text-2xl text-gray-500">
            No Package Available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {packages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card-white flex flex-col h-full group"
              >
                <div className="relative h-80 overflow-hidden">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-6 left-6 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    {pkg.category}
                  </div>
                </div>

                <div className="p-12 flex-grow flex flex-col">
                  <div className="mb-8 font-serif">
                    <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest mb-3 italic">
                      <Clock size={12} /> {pkg.duration}
                    </div>
                    <h2 className="text-3xl font-bold text-mountain-dark mb-4">{pkg.title}</h2>
                    <p className="text-gray-500 font-light leading-relaxed line-clamp-3 text-sm">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-10 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Starting from</p>
                      <p className="text-3xl font-bold text-mountain-dark font-serif">{formatCurrency(pkg.price)}</p>
                    </div>
                    <Link 
                      to={`/package/${pkg.id}`} 
                      className="btn-primary w-14 h-14 !px-0 flex items-center justify-center rounded-2xl shadow-xl shadow-red-500/10"
                    >
                      <ArrowRightNav size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowRightNav({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
