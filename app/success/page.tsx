"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Download, Terminal, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Reuse Hex Background
const HexBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
       style={{
         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
       }}
  />
);

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
      <HexBackground />
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-zinc-950 to-zinc-950 pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center">
        
        {/* Success Icon */}
        <motion.div 
          initial={{ scale: 0, rotate: -45 }} 
          animate={{ scale: 1, rotate: 0 }} 
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative mx-auto mb-10 w-24 h-24"
        >
          <div className="absolute inset-0 bg-amber-500 skew-x-[-12deg] shadow-[0_0_40px_rgba(245,158,11,0.4)]" />
          <div className="absolute inset-0 flex items-center justify-center skew-x-[-12deg]">
             <div className="skew-x-[12deg]">
                <Check className="w-12 h-12 text-black stroke-[4]" />
             </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          
          {/* Header */}
          <div className="mb-8">
             <div className="flex items-center justify-center gap-2 mb-2 text-amber-500 font-mono text-xs uppercase tracking-[0.2em]">
                <ShieldCheck className="w-4 h-4" />
                <span>Sequence Complete</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9]">
               Booking <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">Secured</span>
             </h1>
          </div>

          <p className="text-zinc-500 text-lg mb-10 font-mono border-b border-zinc-800 pb-8 max-w-xs mx-auto">
             Slot reserved. Confirmation packet sent to your inbox.
          </p>

          {/* Next Steps "Data Card" */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 mb-8 text-left relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            
            <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-zinc-600" />
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Mission Protocol</span>
            </div>
            
            <ul className="space-y-4">
              {[
                "Check email for management uplink.",
                "Await SMS arrival notification.",
                "Secure water/power access point."
              ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm text-zinc-300">
                    <span className="font-mono text-amber-500/50 font-bold">0{i+1}</span>
                    <span className="uppercase font-bold tracking-wide">{step}</span>
                  </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <Link href="/">
            <button className="relative group w-full overflow-hidden bg-white text-black font-black uppercase tracking-wider py-4 px-8 skew-x-[-12deg] transition-all hover:bg-amber-500">
               <span className="flex items-center justify-center gap-2 skew-x-[12deg]">
                  Return to Base <ArrowRight className="w-5 h-5" />
               </span>
            </button>
          </Link>

        </motion.div>
      </div>
    </main>
  );
}