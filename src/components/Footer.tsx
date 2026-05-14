import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-mountain-dark text-white pt-24 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-serif text-2xl font-bold mb-6 text-white">
              Adi Kailash <span className="text-primary italic">Tour & Travel</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">
              Experience the divine beauty of the Kumaon Himalayas. Facilitating sacred pilgrimages with safety and devotion since 2012.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-primary transition-all text-white"><Facebook size={20} /></a>
              <a href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-primary transition-all text-white"><Instagram size={20} /></a>
              <a href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-primary transition-all text-white"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-8 uppercase tracking-[0.2em] text-[10px] text-gray-400">Navigation</h4>
            <ul className="space-y-4 text-sm text-gray-300 font-medium">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/packages" className="hover:text-primary transition-colors">Tour Packages</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8 uppercase tracking-[0.2em] text-[10px] text-gray-400">Office Base</h4>
            <ul className="space-y-6 text-sm text-gray-300 font-medium font-serif">
              <li className="flex gap-4">
                <MapPin className="text-primary flex-shrink-0" size={20} />
                <span className="leading-relaxed italic">Main Market, Dharchula, Pithoragarh,<br />Uttarakhand, India - 262545</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-primary" size={20} />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-primary" size={20} />
                <span>info@adikailash.travel</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8 uppercase tracking-[0.2em] text-[10px] text-gray-400">Stay Updated</h4>
            <p className="text-gray-300 text-sm mb-6 font-light">Join our spiritual community for seasonal updates.</p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email address"
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm w-full focus:outline-none focus:border-primary text-white"
              />
              <button className="w-full bg-primary py-4 rounded-2xl hover:bg-red-700 transition-all font-bold text-sm tracking-widest uppercase text-white shadow-lg shadow-red-500/10">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
          <p>© 2026 Adi Kailash Tour & Travel.</p>
          <div className="flex gap-10 mt-6 md:mt-0">
            <Link to="/admin/login" className="hover:text-primary">Admin</Link>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
