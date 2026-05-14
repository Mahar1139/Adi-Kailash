import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { Lock, LogIn, Mail, Key } from "lucide-react";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userAuth;
      try {
        // Attempt normal login
        const result = await signInWithEmailAndPassword(auth, email, password);
        userAuth = result.user;
      } catch (err: any) {
        // If user doesn't exist and matches the bootstrap credentials, create it
        if ((err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') && 
            email === "asmaharg1139@gmail.com" && 
            password === "Admin@123") {
          
          const result = await createUserWithEmailAndPassword(auth, email, password);
          userAuth = result.user;
          
          // Initialize in Firestore as admin
          await setDoc(doc(db, "users", userAuth.uid), {
            email: email,
            role: 'admin',
            uid: userAuth.uid
          });
          await setDoc(doc(db, "users", "admin_bootstrap_locked"), { locked: true });
          
          toast.success("Admin Account Initialized!");
        } else {
          throw err;
        }
      }

      const user = userAuth;

      // Check if user is admin in Firestore
      let userDoc;
      try {
        userDoc = await getDoc(doc(db, "users", user.uid));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        return;
      }
      
      if (email === "asmaharg1139@gmail.com" || (userDoc?.exists() && userDoc.data().role === 'admin')) {
        if (email === "asmaharg1139@gmail.com" && (!userDoc?.exists() || userDoc.data().role !== 'admin')) {
          try {
            await setDoc(doc(db, "users", user.uid), {
               email: user.email,
               role: 'admin',
               uid: user.uid
            });
            await setDoc(doc(db, "users", "admin_bootstrap_locked"), { locked: true });
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
            return;
          }
        }
        
        toast.success("Welcome back, Admin!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Unauthorized access.");
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        toast.error("Invalid email or password.");
      } else if (!error.message.includes('authInfo')) {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-surface flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-xl shadow-2xl p-12 text-center border border-slate-100"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-md flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20 shadow-inner">
          <Lock size={40} />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Admin Console</h1>
        <p className="text-gray-500 mb-10 text-[10px] font-black uppercase tracking-widest leading-relaxed">
          Please enter your administrative credentials to access the dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-6 text-left">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-surface border border-slate-100 rounded-md py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all font-bold text-sm"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-surface border border-slate-100 rounded-md py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all font-bold text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-primary text-white py-5 rounded-md font-black hover:bg-red-700 transition-all shadow-xl disabled:bg-gray-200 uppercase tracking-[0.2em] text-xs mt-8"
          >
            {loading ? "Authenticating..." : <><LogIn size={20} /> Login Securely</>}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed text-center">Adi Kailash Tour & Travel Portal</p>
        </div>
      </motion.div>
    </div>
  );
}

