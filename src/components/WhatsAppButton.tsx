import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export default function WhatsAppButton() {
  const phoneNumber = "919876543210";
  const message = "Hello! I'm interested in the Adi Kailash Yatra. Please provide more details.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center border-4 border-white/20 group hover:pr-6"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} className="shrink-0" />
      <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-3 transition-all duration-300 ease-in-out whitespace-nowrap font-bold text-sm">
        Chat with us
      </span>
    </motion.a>
  );
}
