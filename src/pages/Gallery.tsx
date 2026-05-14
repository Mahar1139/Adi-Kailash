import { motion } from "motion/react";
import { useState } from "react";
import { X, Maximize2 } from "lucide-react";

const IMAGES = [
  { id: 1, src: "./public/images/img1.jpg", title: "Adi Kailash Peak", category: "Sacred Peaks" },
  { id: 2, src: "./public/images/img5.jpg", title: "Panchachuli Range", category: "Landscape" },
  { id: 3, src: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200", title: "Om Parvat", category: "Divine Signs" },
  { id: 4, src: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200", title: "Snow View", category: "Architecture" },
  { id: 5, src: "./public/images/img2.jpg", title: "OM Parvat", category: "Culture" },
  { id: 6, src: "./public/images/img3.jpg", title: "Kali River Valley", category: "Landscape" },
  { id: 7, src: "./public/images/img4.jpeg", title: "Evening View", category: "Spiritual" },
  { id: 8, src: "./public/images/img6.jpeg", title: "Local Prayer Flags", category: "Culture" },
  { id: 9, src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200", title: "Snowy Pass", category: "Adventure" },
  { id: 10, src: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200", title: "Mountain Reflection", category: "Nature" },
];

export default function Gallery() {
  const [selectedImg, setSelectedImg] = useState<{src: string, title: string} | null>(null);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20">
          <div className="w-16 h-1.5 bg-primary mb-6" />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8"
          >
            Spiritual <span className="text-primary italic">Visions</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl text-[10px] font-black uppercase tracking-widest leading-relaxed">
            Witness the untouched beauty of the sacred peaks through our lens.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {IMAGES.map((img, idx) => (
            <motion.div 
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="relative group cursor-pointer overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all"
              onClick={() => setSelectedImg(img)}
            >
              <img 
                src={img.src} 
                alt={img.title} 
                className="w-full h-auto transition-transform duration-1000 group-hover:scale-110" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <div>
                  <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1">{img.category}</p>
                  <p className="text-white text-lg font-black uppercase tracking-tight">{img.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] bg-mountain-dark/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedImg(null)}>
          <button className="absolute top-8 right-8 text-white hover:text-primary transition-colors">
            <X size={32} />
          </button>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <img src={selectedImg.src} alt={selectedImg.title} className="w-full rounded-md shadow-2xl" />
            <div className="mt-6 text-center">
              <h2 className="text-xs text-white uppercase font-bold tracking-[0.2em]">{selectedImg.title}</h2>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
