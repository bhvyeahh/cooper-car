"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  AlertTriangle, 
  Loader2, 
  ShieldAlert, 
  Terminal,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS & COMPONENTS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HexBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
       style={{
         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
       }}
  />
);

// Destructive variant of the skewed button
const ActionButton = ({ onClick, disabled, loading, children }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={cn(
      "relative group overflow-hidden font-black uppercase tracking-wider py-4 px-8 skew-x-[-12deg] w-full transition-all duration-300 active:scale-[0.98]",
      disabled ? "opacity-50 cursor-not-allowed grayscale" : "hover:scale-[1.02]",
      "bg-red-600 text-black shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500"
    )}
  >
    <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-white/20" />
    <span className="relative flex items-center justify-center gap-2 skew-x-[12deg]">
      {loading ? <Loader2 className="animate-spin" /> : children}
    </span>
  </button>
);

export default function ManagePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("Confirm Abort Sequence: Are you sure you want to cancel?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("Error processing cancellation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <HexBackground />
      
      {/* Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-amber-500 to-zinc-900 opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900/90 border border-zinc-800 p-8 relative z-10 backdrop-blur-md"
      >
        {/* Header Section */}
        <div className="mb-10 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-sm animate-pulse ${message ? "bg-white" : "bg-amber-500"}`} />
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                {message ? "System Notification" : "Access Terminal"}
            </span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
            Manage <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200">Booking</span>
          </h1>
        </div>

        {message ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "p-6 border-l-4 mb-6 skew-x-[-6deg]", 
              message.includes("refunded") || message.toLowerCase().includes("success")
                ? "bg-green-950/30 border-green-500 text-green-400" 
                : "bg-red-950/30 border-red-500 text-red-400"
            )}
          >
            <div className="skew-x-[6deg] flex items-start gap-3">
              {message.includes("refunded") ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
              <div>
                <div className="font-bold uppercase tracking-wider text-sm mb-1">Status Report</div>
                <div className="text-sm font-mono opacity-90">{message}</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Ticket Info */}
            <div className="space-y-6 mb-10">
              <div className="group relative overflow-hidden bg-zinc-950 border border-zinc-800 p-5 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500 skew-x-[-12deg]">
                     <Calendar className="w-6 h-6 skew-x-[12deg]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Current Slot</div>
                    <div className="font-bold text-white italic text-lg">Check Email for Data</div>
                    <div className="text-xs text-zinc-600 font-mono mt-1">Token: {token.slice(0, 8)}...</div>
                  </div>
                </div>
              </div>
              
              {/* Warning Box */}
              <div className="p-5 bg-red-950/10 border border-red-900/50 flex gap-4">
                <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div className="text-xs space-y-2">
                  <span className="font-black text-red-500 uppercase tracking-wider block border-b border-red-900/30 pb-1 mb-1">
                    Cancellation Protocol
                  </span>
                  <ul className="space-y-1 text-red-200/70 font-mono">
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        <span>{">"} 24 Hours: Refund ($9.00)</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        <span>{"<"} 24 Hours: Forfeit Deposit</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <ActionButton onClick={handleCancel} disabled={loading}>
              INITIATE CANCELLATION
            </ActionButton>
            
            <div className="mt-4 text-center">
                <button 
                    onClick={() => router.push('/')}
                    className="text-[10px] text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}