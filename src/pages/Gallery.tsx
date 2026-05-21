import { motion } from "motion/react";
import { useState } from "react";
import { X, Maximize2 } from "lucide-react";
import Tilt from "react-parallax-tilt";

const IMAGES = [
  { id: 1, src: "/images/img1.jpg", title: "Adi Kailash Peak", category: "Sacred Peaks" },
  { id: 2, src: "/images/img2.jpg", title: "Om Parvat", category: "Divine Signs" },
  { id: 3, src: "/images/img3.jpg", title: "Kali River Valley", category: "Landscape" },
  { id: 4, src: "/images/img4.jpeg", title: "Evening View", category: "Spiritual" },
  { id: 5, src: "/images/img5.jpg", title: "Panchachuli Range", category: "Landscape" },
  { id: 6, src: "/images/img6.jpeg", title: "Local Prayer Flags", category: "Culture" },
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
            <Tilt key={img.id} glareEnable={true} glareMaxOpacity={0.4} glareColor="white" glarePosition="all" scale={1.02} tiltMaxAngleY={8} tiltMaxAngleX={8} transitionSpeed={1000} className="break-inside-avoid">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="relative group cursor-pointer overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.2)] transition-all transform-style-3d mb-8"
                onClick={() => setSelectedImg(img)}
              >
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-auto transition-transform duration-1000 group-hover:scale-110 relative z-0" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mountain-dark/90 via-mountain-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8 z-10">
                  <div className="transform translate-z-[40px]">
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1 shadow-black drop-shadow-md">{img.category}</p>
                    <p className="text-white text-2xl font-serif drop-shadow-lg">{img.title}</p>
                  </div>
                </div>
              </motion.div>
            </Tilt>
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
