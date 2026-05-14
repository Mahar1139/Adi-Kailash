import { useState, useEffect } from "react";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, BookMarked, MessageSquare, Package, LogOut, Trash2, CheckCircle, Clock, Edit } from "lucide-react";
import { toast } from "react-toastify";
import { Booking, Enquiry, TourPackage } from "../types";
import { formatCurrency, cn } from "../lib/utils";
import PackageForm from "../components/PackageForm";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'enquiries' | 'packages'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditingPackage, setIsEditingPackage] = useState<TourPackage | null>(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [confirmDeleteBookingId, setConfirmDeleteBookingId] = useState<string | null>(null);
  const [confirmDeletePackageId, setConfirmDeletePackageId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let listenersUnsub: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
          listenersUnsub = setupListeners();
        } else {
          toast.error("Unauthorized access.");
          navigate("/admin/login");
        }
      } else {
        if (listenersUnsub) {
           listenersUnsub();
           listenersUnsub = null;
        }
        navigate("/admin/login");
      }
    });

    return () => {
      if (listenersUnsub) {
        listenersUnsub();
      }
      unsubscribe();
    };
  }, [navigate]);

  const setupListeners = () => {
    const bQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const eQuery = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));

    const unsubB = onSnapshot(bQuery, (snap) => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "bookings"));

    const unsubE = onSnapshot(eQuery, (snap) => {
      setEnquiries(snap.docs.map(d => ({ id: d.id, ...d.data() } as Enquiry)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "enquiries"));

    const pQuery = query(collection(db, "packages"));
    const unsubP = onSnapshot(pQuery, (snap) => {
      setPackages(snap.docs.map(d => ({ id: d.id, ...d.data() } as TourPackage)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "packages"));

    return () => {
      unsubB();
      unsubE();
      unsubP();
    };
  };

  const handleLogout = () => {
    signOut(auth);
    navigate("/admin/login");
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, "bookings", id));
      toast.info("Booking deleted.");
    } catch (e) {
      toast.error("Failed to delete.");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status });
      toast.success(`Booking ${status}`);
    } catch (e) {
      toast.error("Status update failed.");
    }
  };

  const handleDeletePackage = async (id: string) => {
    try {
      await deleteDoc(doc(db, "packages", id));
      toast.info("Package deleted.");
    } catch (e) {
      toast.error("Failed to delete.");
    }
  };

  if (!isAdmin) return <div className="h-screen flex items-center justify-center">Authenticating...</div>;

  return (
    <div className="min-h-screen bg-slate-surface flex">
      {/* Sidebar */}
      <aside className="w-72 bg-mountain-dark text-white hidden md:flex flex-col border-r border-white/5">
        <div className="p-10">
          <div className="w-10 h-1 bg-primary mb-4" />
          <h2 className="text-xl font-black uppercase tracking-tighter">Admin <span className="text-primary">Portal</span></h2>
        </div>
        <nav className="flex-grow mt-4 px-6 space-y-3">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={cn("w-full flex items-center gap-4 p-5 rounded-md transition-all font-black uppercase tracking-widest text-[10px]", activeTab === 'bookings' ? "bg-primary text-white shadow-xl" : "text-gray-400 hover:text-white hover:bg-white/5")}
          >
            <BookMarked size={16} /> Bookings
          </button>
          <button 
            onClick={() => setActiveTab('enquiries')}
            className={cn("w-full flex items-center gap-4 p-5 rounded-md transition-all font-black uppercase tracking-widest text-[10px]", activeTab === 'enquiries' ? "bg-primary text-white shadow-xl" : "text-gray-400 hover:text-white hover:bg-white/5")}
          >
            <MessageSquare size={16} /> Enquiries
          </button>
          <button 
            onClick={() => setActiveTab('packages')}
            className={cn("w-full flex items-center gap-4 p-5 rounded-md transition-all font-black uppercase tracking-widest text-[10px]", activeTab === 'packages' ? "bg-primary text-white shadow-xl" : "text-gray-400 hover:text-white hover:bg-white/5")}
          >
            <Package size={16} /> Packages
          </button>
        </nav>
        <div className="p-10">
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors font-black uppercase tracking-widest text-[10px]">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-grow p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
              {activeTab === 'bookings' ? 'Manage Bookings' : activeTab === 'enquiries' ? 'Recent Enquiries' : 'Tour Packages'}
            </h1>
            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Real-time System Active
            </div>
          </div>
        </header>

        {activeTab === 'bookings' && (
          <div className="space-y-8">
            {bookings.length === 0 ? (
              <div className="p-32 text-center bg-white rounded-xl border border-slate-100 shadow-inner">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active bookings found.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <motion.div 
                  layout
                  key={booking.id}
                  className="bg-white p-10 rounded-xl shadow-sm border border-slate-100 hover:shadow-xl transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10"
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={cn(
                        "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm",
                        booking.status === 'confirmed' ? "bg-green-500 text-white" : 
                        booking.status === 'cancelled' ? "bg-red-500 text-white" : "bg-primary text-white"
                      )}>
                        {booking.status}
                      </span>
                      <span className="text-gray-300 font-bold text-[10px] uppercase tracking-widest">ID: #{booking.id.slice(-6)}</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tight mb-3">{booking.fullName}</h3>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      <span className="text-primary">{booking.packageName}</span>
                      <span>{booking.email}</span>
                      <span>{booking.phone}</span>
                      <span>{booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 bg-slate-surface p-4 rounded-lg">
                    <button 
                      onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                      className="p-3 bg-white text-green-600 shadow-md hover:bg-green-600 hover:text-white rounded-md transition-all active:scale-95"
                      title="Confirm"
                    >
                      <CheckCircle size={24} />
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(booking.id, 'pending')}
                      className="p-3 bg-white text-primary shadow-md hover:bg-primary hover:text-white rounded-md transition-all active:scale-95"
                      title="Waitlist"
                    >
                      <Clock size={24} />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirmDeleteBookingId === booking.id) {
                          handleDeleteBooking(booking.id);
                          setConfirmDeleteBookingId(null);
                        } else {
                          setConfirmDeleteBookingId(booking.id);
                          setTimeout(() => setConfirmDeleteBookingId(null), 3000);
                        }
                      }}
                      className={cn("p-3 bg-white shadow-md rounded-md transition-all active:scale-95", confirmDeleteBookingId === booking.id ? "text-white bg-red-600 px-4" : "text-gray-400 hover:bg-red-600 hover:text-white")}
                      title={confirmDeleteBookingId === booking.id ? "Confirm delete?" : "Delete"}
                    >
                      {confirmDeleteBookingId === booking.id ? <span className="font-bold text-xs uppercase tracking-widest whitespace-nowrap">Confirm?</span> : <Trash2 size={24} />}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-white p-10 rounded-xl shadow-sm border border-slate-100 hover:shadow-xl transition-all relative group">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="font-black text-2xl uppercase tracking-tight">{enquiry.name}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-slate-surface px-3 py-1 rounded-md">
                    {enquiry.createdAt?.toDate ? enquiry.createdAt.toDate().toLocaleDateString() : new Date(enquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-6 bg-slate-surface rounded-md border border-slate-100 mb-8">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] italic leading-relaxed">"{enquiry.message}"</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{enquiry.mobile}</span>
                  {enquiry.destination && (
                    <div className="text-[10px] uppercase font-black text-gray-300 tracking-widest">
                      Interested: <span className="text-mountain-dark ml-1">{enquiry.destination}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="space-y-8">
            <div className="flex justify-end mb-6">
              <button onClick={() => setIsAddingPackage(true)} className="btn-primary">Add New Package</button>
            </div>
            {packages.length === 0 ? (
              <div className="p-32 text-center bg-white rounded-xl border border-slate-100 shadow-inner">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No packages found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {packages.map((pkg) => (
                  <motion.div layout key={pkg.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
                    <img src={pkg.image} alt={pkg.title} className="w-full h-48 object-cover rounded-md mb-6" />
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{pkg.title}</h3>
                        <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-sm font-bold uppercase tracking-widest">{pkg.category}</span>
                      </div>
                      <span className="text-2xl font-serif text-mountain-dark font-black">{formatCurrency(pkg.price)}</span>
                    </div>
                    <p className="text-gray-500 font-light leading-relaxed mb-6 line-clamp-2">{pkg.description}</p>
                    <div className="grid grid-cols-2 gap-y-2 mb-6">
                       <p className="text-xs text-gray-500"><span className="font-bold text-black uppercase tracking-widest text-[8px]">Duration:</span> {pkg.duration}</p>
                       {pkg.baseCamp && <p className="text-xs text-gray-500"><span className="font-bold text-black uppercase tracking-widest text-[8px]">Base Camp:</span> {pkg.baseCamp}</p>}
                       {pkg.grade && <p className="text-xs text-gray-500"><span className="font-bold text-black uppercase tracking-widest text-[8px]">Grade:</span> {pkg.grade}</p>}
                       {pkg.stay && <p className="text-xs text-gray-500"><span className="font-bold text-black uppercase tracking-widest text-[8px]">Stay:</span> {pkg.stay}</p>}
                    </div>
                    <div className="flex items-center gap-4 justify-end border-t border-slate-100 pt-6">
                      <button onClick={() => setIsEditingPackage(pkg)} className="text-mountain-dark hover:text-primary transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Edit size={16} /> Edit
                      </button>
                      <button onClick={() => {
                        if (confirmDeletePackageId === pkg.id) {
                          handleDeletePackage(pkg.id);
                          setConfirmDeletePackageId(null);
                        } else {
                          setConfirmDeletePackageId(pkg.id);
                          setTimeout(() => setConfirmDeletePackageId(null), 3000);
                        }
                      }} className={cn("transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", confirmDeletePackageId === pkg.id ? "text-red-600" : "text-gray-400 hover:text-red-600")}>
                        <Trash2 size={16} /> {confirmDeletePackageId === pkg.id ? "Confirm?" : "Delete"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {(isAddingPackage || isEditingPackage) && (
               <PackageForm
                 initialData={isEditingPackage}
                 onClose={() => {
                   setIsAddingPackage(false);
                   setIsEditingPackage(null);
                 }}
               />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
