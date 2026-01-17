"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Clock, 
  Shield, Zap, Droplets, Loader2,
  Calendar
} from "lucide-react";
import { format, addDays, startOfToday } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- DATA ---
const SERVICES = [
  {
    id: "maintenance",
    title: "The Daily",
    price: 150,
    duration: "1.5h",
    desc: "Wash & Sealant",
    icon: Droplets,
  },
  {
    id: "correction",
    title: "Correction",
    price: 450,
    duration: "6h",
    desc: "Polish & Shine",
    icon: Shield,
  },
  {
    id: "ceramic",
    title: "Ceramic Pro",
    price: 890,
    duration: "1 Day",
    desc: "5-Year Coating",
    icon: Zap,
  },
];

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

// --- MICRO COMPONENTS ---

// 1. Hex Background
const HexBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
       style={{
         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
       }}
  />
);

// 2. Skewed Button
const ActionButton = ({ onClick, disabled, loading, children, variant = "primary", className }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={cn(
      "relative group overflow-hidden font-black uppercase tracking-wider py-4 px-8 skew-x-[-12deg] w-full transition-all duration-300 active:scale-[0.98]",
      disabled ? "opacity-50 cursor-not-allowed grayscale" : "hover:scale-[1.02]",
      variant === "primary" 
        ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
        : "bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700",
      className
    )}
  >
    <div className={cn(
      "absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out",
      variant === "primary" ? "bg-white/30" : "bg-white/5"
    )} />
    <span className="relative flex items-center justify-center gap-2 skew-x-[12deg]">
      {loading ? <Loader2 className="animate-spin" /> : children}
    </span>
  </button>
);

// 3. Progress "Fuel Gauge"
const ProgressGauge = ({ step }: { step: number }) => (
  <div className="flex items-center gap-1 mb-6 md:mb-10 w-full px-1">
    {[1, 2, 3].map((num) => (
      <div key={num} className="flex-1 flex flex-col gap-2">
        <div 
          className={cn(
            "h-1 md:h-2 w-full skew-x-[-20deg] transition-all duration-500",
            step >= num ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-zinc-800"
          )} 
        />
        <span className={cn(
          "text-[8px] md:text-[10px] font-mono uppercase tracking-widest text-center transition-colors duration-300",
          step >= num ? "text-amber-500" : "text-zinc-600"
        )}>
          {num === 1 ? "Select" : num === 2 ? "Date" : "Info"}
        </span>
      </div>
    ))}
  </div>
);

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: "",
    serviceName: "",
    price: 0,
    date: startOfToday(),
    time: "",
    name: "",
    email: "",
    phone: "",
  });

  const dates = Array.from({ length: 14 }).map((_, i) => addDays(startOfToday(), i));

  // Scroll to top when changing steps on mobile
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleServiceSelect = (service: any) => {
    setFormData({ ...formData, serviceId: service.id, serviceName: service.title, price: service.price });
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
        }),
      });

      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Something went wrong");
    } catch (err) {
      alert("Error initiating checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500 selection:text-black flex flex-col lg:flex-row">
      <HexBackground />

      {/* --- SIDEBAR / MOBILE HEADER --- */}
      <div className="lg:w-[400px] w-full bg-zinc-900/90 border-b lg:border-b-0 lg:border-r border-zinc-800 p-4 lg:p-8 flex flex-row lg:flex-col justify-between lg:justify-start items-center lg:items-stretch sticky top-0 lg:relative z-50 backdrop-blur-md lg:h-auto lg:min-h-screen">
        
        {/* Branding */}
        <div className="lg:mb-10">
           <div className="flex items-center gap-2 mb-1 lg:mb-2">
             <div className="w-2 h-2 bg-amber-500 rounded-sm animate-pulse" />
             <span className="text-amber-500 font-mono text-[10px] lg:text-xs uppercase tracking-widest">System Online</span>
           </div>
           <h1 className="text-xl lg:text-5xl font-black italic tracking-tighter text-white leading-none">
             CONFIG<span className="text-zinc-600 hidden lg:inline"><br />URATOR</span>
             <span className="text-zinc-600 lg:hidden">.</span>
           </h1>
        </div>

        {/* Desktop-Only: Spec Sheet Details */}
        <div className="hidden lg:block flex-1 space-y-6">
          <div className="relative p-6 border-l-2 border-amber-500 bg-black/40">
            <span className="absolute top-0 right-0 bg-zinc-800 text-[10px] px-2 py-1 text-zinc-400 font-mono uppercase">Spec 01</span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Selected Package</span>
            <div className="text-2xl font-black italic text-white">{formData.serviceName || "---"}</div>
            <div className="text-amber-500 font-mono text-sm mt-1">{formData.serviceId ? "Active Selection" : "Pending..."}</div>
          </div>

          <div className="relative p-6 border-l-2 border-zinc-700 bg-black/40">
             <span className="absolute top-0 right-0 bg-zinc-800 text-[10px] px-2 py-1 text-zinc-400 font-mono uppercase">Spec 02</span>
             <span className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Execution Time</span>
             <div className="text-xl font-bold text-white flex items-center gap-2">
               <Calendar className="w-4 h-4 text-zinc-500" />
               {format(formData.date, "MMM dd").toUpperCase()}
             </div>
             <div className="text-xl font-bold text-white flex items-center gap-2 mt-1">
               <Clock className="w-4 h-4 text-zinc-500" />
               {formData.time || "--:--"}
             </div>
          </div>
        </div>

        {/* Total Price */}
        <div className="lg:mt-8 lg:pt-8 lg:border-t lg:border-zinc-800 flex flex-col items-end lg:items-start">
           <span className="text-zinc-500 text-[10px] lg:text-sm uppercase tracking-widest font-bold">Total</span>
           <div className="text-2xl lg:text-5xl font-black italic text-white tracking-tighter">
             ${formData.price}
           </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 relative z-10 flex flex-col w-full max-w-[100vw] overflow-hidden">
        
        {/* Decorative Top Line (Desktop Only) */}
        <div className="h-2 w-full bg-zinc-900 border-b border-zinc-800 hidden lg:flex">
            {Array(20).fill(0).map((_,i) => (
                <div key={i} className="flex-1 border-r border-zinc-800/50" />
            ))}
        </div>

        <div className="flex-1 w-full">
          <div className="max-w-3xl mx-auto p-4 md:p-8 lg:p-16 pb-24">
            <ProgressGauge step={step} />

            <AnimatePresence mode="wait">
              {/* STEP 1: SELECT TRIM LEVEL (Services) */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-4 md:mb-8 flex items-center gap-3">
                    <span className="text-amber-500">01.</span> Select Protocol
                  </h2>
                  
                  <div className="grid gap-4">
                    {SERVICES.map((s) => (
                      <div key={s.id} onClick={() => handleServiceSelect(s)}
                        className="group relative cursor-pointer overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500 transition-all duration-300 p-5 md:p-8 active:scale-[0.98]"
                      >
                        {/* Hover Grid Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] transition-opacity duration-300" />
                        
                        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start sm:items-center gap-4 md:gap-6 w-full sm:w-auto">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-black border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-amber-500 group-hover:border-amber-500 transition-all duration-300 skew-x-[-12deg] shrink-0">
                              <s.icon className="w-5 h-5 md:w-6 md:h-6 skew-x-[12deg]" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl md:text-2xl font-black italic text-white uppercase group-hover:text-amber-500 transition-colors">{s.title}</h3>
                              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] md:text-xs font-mono text-zinc-500 uppercase mt-1">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration}</span>
                                <span className="hidden sm:inline w-1 h-1 bg-zinc-700 rounded-full" />
                                <span>{s.desc}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price Display */}
                          <div className="w-full sm:w-auto text-right border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 mt-2 sm:mt-0 flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                             <span className="text-[10px] text-zinc-600 uppercase tracking-widest sm:order-2">Est. Cost</span>
                             <span className="text-2xl md:text-3xl font-black italic text-white block group-hover:translate-x-0 md:group-hover:translate-x-[-10px] transition-transform duration-300 sm:order-1">${s.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PIT STOP (Date & Time) */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 md:space-y-8">
                  <div className="flex items-center justify-between mb-4 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-black uppercase italic flex items-center gap-3">
                        <span className="text-amber-500">02.</span> Schedule
                    </h2>
                    <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white text-[10px] md:text-sm uppercase font-bold tracking-widest flex items-center gap-2 px-2 py-1 border border-zinc-800 rounded">
                        <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Back
                    </button>
                  </div>
                  
                  {/* Date Scroller */}
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest font-bold ml-1">Select Date</label>
                    <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide snap-x -mx-4 px-4 md:mx-0 md:px-0">
                      {dates.map((date, i) => {
                        const isSelected = format(date, "yyyy-MM-dd") === format(formData.date, "yyyy-MM-dd");
                        return (
                          <button key={i} onClick={() => setFormData({...formData, date})}
                            className={cn(
                              "flex-shrink-0 w-16 h-20 md:w-20 md:h-24 flex flex-col items-center justify-center border transition-all snap-start skew-x-[-6deg]",
                              isSelected ? "bg-amber-500 text-black border-amber-500" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600"
                            )}
                          >
                            <span className={cn("text-[8px] md:text-[10px] uppercase font-bold mb-1 skew-x-[6deg]", isSelected ? "text-black/70" : "text-zinc-600")}>
                                {format(date, "MMM")}
                            </span>
                            <span className="text-xl md:text-2xl font-black italic skew-x-[6deg]">{format(date, "dd")}</span>
                            <span className="text-[8px] md:text-[10px] uppercase font-bold mt-1 skew-x-[6deg]">{format(date, "EEE")}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Grid */}
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest font-bold ml-1">Select Arrival Time</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                      {TIME_SLOTS.map((t) => (
                        <button key={t} onClick={() => setFormData({...formData, time: t})}
                          className={cn(
                            "py-3 md:py-4 text-xs md:text-sm font-mono font-bold border skew-x-[-6deg] transition-all relative overflow-hidden group",
                            formData.time === t 
                                ? "bg-white text-black border-white" 
                                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-amber-500/50 hover:text-white"
                          )}
                        >
                          <span className="relative z-10 skew-x-[6deg] block">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 md:pt-8">
                    <ActionButton onClick={() => setStep(3)} disabled={!formData.time}>
                        Confirm Slot <ArrowRight className="w-5 h-5" />
                    </ActionButton>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DRIVER DETAILS */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 md:space-y-8">
                   <div className="flex items-center justify-between mb-4 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-black uppercase italic flex items-center gap-3">
                        <span className="text-amber-500">03.</span> Details
                    </h2>
                    <button onClick={() => setStep(2)} className="text-zinc-500 hover:text-white text-[10px] md:text-sm uppercase font-bold tracking-widest flex items-center gap-2 px-2 py-1 border border-zinc-800 rounded">
                        <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Back
                    </button>
                  </div>
                  
                  <div className="space-y-4 md:space-y-5">
                    {/* Custom Input Styles - text-base prevents iOS zoom */}
                    <div className="group">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2 block group-focus-within:text-amber-500 transition-colors">Full Name</label>
                        <input type="text" 
                            className="w-full bg-zinc-900 border-b-2 border-zinc-800 p-3 md:p-4 text-base text-white placeholder:text-zinc-700 focus:border-amber-500 focus:bg-zinc-900/50 outline-none transition-all font-mono" 
                            placeholder="ENTER NAME"
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>
                    <div className="group">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2 block group-focus-within:text-amber-500 transition-colors">Email Coordinates</label>
                        <input type="email" 
                            className="w-full bg-zinc-900 border-b-2 border-zinc-800 p-3 md:p-4 text-base text-white placeholder:text-zinc-700 focus:border-amber-500 focus:bg-zinc-900/50 outline-none transition-all font-mono" 
                            placeholder="ENTER EMAIL"
                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>
                    <div className="group">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2 block group-focus-within:text-amber-500 transition-colors">Mobile Uplink</label>
                        <input type="tel" 
                            className="w-full bg-zinc-900 border-b-2 border-zinc-800 p-3 md:p-4 text-base text-white placeholder:text-zinc-700 focus:border-amber-500 focus:bg-zinc-900/50 outline-none transition-all font-mono" 
                            placeholder="ENTER PHONE"
                            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                        />
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="bg-zinc-900/50 border border-zinc-800 p-4 flex gap-4 items-start md:items-center rounded-sm">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-amber-500 shrink-0 mt-1 md:mt-0" />
                    <div>
                        <div className="text-white font-bold text-sm uppercase">Secure Reservation</div>
                        <div className="text-zinc-500 text-xs mt-1">Small deposit of $10.00 required to lock your slot.</div>
                    </div>
                  </div>

                  <ActionButton onClick={handleSubmit} disabled={loading || !formData.name || !formData.email}>
                      Initiate Sequence ($10)
                  </ActionButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}