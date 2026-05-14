import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Compass, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Packages", path: "/packages" },
  { name: "About", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        "sticky top-0 w-full z-50 transition-all duration-300 border-b",
        isScrolled ? "bg-white/95 backdrop-blur-md border-slate-100 py-3 shadow-sm" : "bg-white border-b-slate-100 py-4 shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-red-500/20">A</div>
            <span className="font-serif text-xl font-bold tracking-tight text-mountain-dark">
              Adi Kailash <span className="text-primary italic">Tour & Travel</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-bold transition-all hover:text-primary",
                  location.pathname === link.path ? "text-primary border-b-2 border-primary" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md transition-colors text-mountain-dark hover:bg-slate-100"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu overlay */}
    <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 w-full bg-white shadow-xl md:hidden py-10 px-6 border-b border-slate-100"
          >
            <div className="flex flex-col gap-6 text-center">
              <div className="flex justify-end mb-4">
                <button onClick={() => setIsOpen(false)} className="text-mountain-dark"><X /></button>
              </div>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/packages"
                className="bg-primary text-white px-8 py-3 rounded-sm text-sm font-bold uppercase tracking-widest"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
