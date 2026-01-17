"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  useMotionTemplate, 
  useMotionValueEvent,
  AnimatePresence 
} from "framer-motion";
import { 
  ArrowRight, 
  Check,
  ChevronDown, 
  MapPin, 
  Phone, 
  Shield, 
  Star, 
  Zap, 
  Menu, 
  X,
  Gauge,
  Trophy,
  Timer
} from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITIES ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (e: globalThis.MouseEvent) => 
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);
  return mousePosition;
};

// --- CUSTOM COMPONENTS ---

// 1. Carbon Fiber Button
// A button that looks like a push-to-start engine button
const EngineButton = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative group overflow-hidden bg-amber-500 text-black font-black uppercase tracking-wider py-4 px-8 skew-x-[-12deg]",
        className
      )}
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      <span className="relative inline-flex items-center gap-2 skew-x-[12deg]">
        {children}
      </span>
    </motion.button>
  );
};

// 2. Speed Card
// A card with aggressive slanted edges
const SpeedCard = ({ children, className, index = 0 }: { children: React.ReactNode; className?: string; index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        "relative bg-zinc-900 border-l-4 border-zinc-800 hover:border-amber-500 transition-colors duration-300 p-8 overflow-hidden group",
        className
      )}
    >
      {/* Hover Grid Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// 3. Hex Pattern Background
const HexBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
       style={{
         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
       }}
  />
);

// --- SECTIONS ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/0",
        isScrolled ? "bg-zinc-950/80 backdrop-blur-md border-white/10 py-4" : "py-8 bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-1 group cursor-pointer">
          <div className="w-8 h-8 bg-amber-500 text-black flex items-center justify-center font-black skew-x-[-12deg]">
            <span className="skew-x-[12deg]">C</span>
          </div>
          <span className="text-xl font-black text-white uppercase tracking-tighter italic group-hover:text-amber-500 transition-colors">
            ooper<span className="text-amber-500">Detail</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {["Garage", "Packages", "Process", "Reviews"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors relative"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <Link href="/booking" className="hidden md:block">
           <button className="border border-white/20 px-6 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all duration-300">
             Reserve Slot
           </button>
        </Link>

        {/* Mobile Menu */}
        <button className="md:hidden text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  
  return (
    <section className="relative h-screen w-full overflow-hidden bg-zinc-950 flex items-center">
      {/* Dynamic Background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1614207213854-4693b1675a33?q=80&w=2574&auto=format&fit=crop" 
          alt="Lamborghini Detail" 
          className="w-full h-full object-cover scale-110"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-20">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-[2px] w-12 bg-amber-500" />
            <span className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm">
              Elite Mobile Detailing
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-10"
          >
            Showroom <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">
              Condition.
            </span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-6 items-start md:items-center"
          >
            <Link href="/booking">
              <EngineButton>
                Start Your Build <ArrowRight className="w-5 h-5" />
              </EngineButton>
            </Link>
            <p className="text-zinc-400 max-w-sm text-sm leading-relaxed border-l border-zinc-700 pl-4">
              Premium automotive care delivered to your driveway. 
              Specializing in paint correction and ceramic protection.
            </p>
          </motion.div>
        </div>
      </div>

      {/* RPM Gauge Decoration */}
      <div className="absolute bottom-10 right-10 hidden md:block opacity-20 animate-pulse">
        <Gauge className="w-32 h-32 text-white" strokeWidth={1} />
      </div>
    </section>
  );
};

const StatsBar = () => {
  return (
    <div className="bg-amber-500 relative z-30 py-6">
      <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "Vehicles Detailed", value: "500+" },
          { label: "5-Star Reviews", value: "100%" },
          { label: "Service Area", value: "Metro Area" },
          { label: "Insured", value: "Fully Covered" },
        ].map((stat, i) => (
          <div key={i} className="text-black flex flex-col items-center md:items-start border-r border-black/10 last:border-0">
            <span className="text-3xl font-black italic tracking-tighter">{stat.value}</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- SERVICES (The "Spec Sheet") ---
const Services = () => {
  const services = [
    {
      title: "The Daily Driver",
      subtitle: "Maintenance Wash",
      price: "$150",
      features: ["Foam Cannon Pre-Soak", "Two-Bucket Hand Wash", "Wheel Deep Clean", "Interior Vacuum & Wipe", "Spray Wax Application"],
      icon: Trophy
    },
    {
      title: "The Enthusiast",
      subtitle: "Enhancement Detail",
      price: "$350",
      features: ["Iron Decontamination", "Clay Bar Treatment", "1-Step Machine Polish", "Leather Conditioning", "6-Month Sealant"],
      icon: Zap,
      popular: true
    },
    {
      title: "The Concours",
      subtitle: "Correction & Coating",
      price: "$850+",
      features: ["Multi-Step Paint Correction", "Ceramic Coating (3+ Years)", "Engine Bay Detail", "Carpet Extraction", "Windshield Coating"],
      icon: Shield
    }
  ];

  return (
    <section id="packages" className="py-32 bg-zinc-950 relative z-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <span className="text-amber-500 font-mono text-sm uppercase tracking-widest">Select Your Trim Level</span>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mt-2">
              Service <span className="text-zinc-700">Specs</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <div className="w-12 h-1 bg-amber-500 skew-x-[-20deg]" />
            <div className="w-4 h-1 bg-zinc-700 skew-x-[-20deg]" />
            <div className="w-2 h-1 bg-zinc-700 skew-x-[-20deg]" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <SpeedCard key={i} index={i} className={cn("h-full flex flex-col", s.popular && "border-l-amber-500 bg-zinc-900/80")}>
               {s.popular && (
                 <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold uppercase px-3 py-1">
                   Most Popular
                 </div>
               )}
               <div className="mb-8">
                 <s.icon className={cn("w-10 h-10 mb-6", s.popular ? "text-amber-500" : "text-zinc-600")} strokeWidth={1.5} />
                 <h3 className="text-2xl font-black text-white uppercase italic">{s.title}</h3>
                 <p className="text-zinc-500 text-sm uppercase tracking-wider mt-1">{s.subtitle}</p>
               </div>
               
               <ul className="space-y-4 mb-12 flex-grow">
                 {s.features.map((f, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                     <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                     {f}
                   </li>
                 ))}
               </ul>

               <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-500 uppercase">Starting At</span>
                   <span className="text-3xl font-black text-white italic">{s.price}</span>
                 </div>
                 <Link href="/booking">
                    <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                 </Link>
               </div>
            </SpeedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- SHOWCASE (The "Gallery") ---
const Showcase = () => {
  return (
    <section className="py-20 bg-black overflow-hidden">
      <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <div
            key={i}
            className="min-w-[400px] md:min-w-[600px] aspect-[16/9] relative skew-x-[-6deg] overflow-hidden border-2 border-zinc-800 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <img
              src={`https://images.unsplash.com/photo-${
                i % 2 === 0
                  ? "1605559424843-9e4c228bf1c2"
                  : "1503376763036-066120622c74"
              }?q=80&w=1000&auto=format&fit=crop`}
              alt="Car Detail"
              className="w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h4 className="text-white font-black uppercase text-xl italic">
                Project 0{i + 1}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


// --- PROCESS (The "Blueprint") ---
const Process = () => {
  return (
    <section id="process" className="py-32 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-20 items-center">
        <div className="relative">
            <div className="absolute -inset-4 bg-amber-500/20 blur-3xl rounded-full opacity-20" />
            <img 
                src="https://images.pexels.com/photos/4870692/pexels-photo-4870692.jpeg" 
                alt="Polishing Process" 
                className="relative z-10 w-full rounded-sm grayscale contrast-125 border border-zinc-800"
            />
            {/* Tech Specs Overlay */}
            <div className="absolute -bottom-6 -right-6 bg-zinc-900 p-6 border border-zinc-800 z-20 max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                    <Timer className="text-amber-500 w-5 h-5" />
                    <span className="text-white font-bold uppercase text-xs">Precision Timing</span>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">
                    Every vehicle undergoes a strict 4-stage decontamination process before any machine touches the paint.
                </p>
            </div>
        </div>

        <div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-10">
                The <span className="text-amber-500">Method</span>
            </h2>
            
            <div className="space-y-8">
                {[
                    { title: "Decontamination", desc: "Chemical iron removal and clay bar treatment to remove embedded road grime." },
                    { title: "Correction", desc: "Dual-action machine polishing to level clear coat and remove swirl marks." },
                    { title: "Protection", desc: "Application of SiO2 Ceramic Sealant for hydrophobic water beading." }
                ].map((step, i) => (
                    <div key={i} className="group cursor-default">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-3xl font-black text-zinc-800 group-hover:text-amber-500 transition-colors italic">0{i+1}</span>
                            <h3 className="text-xl font-bold text-white uppercase">{step.title}</h3>
                        </div>
                        <p className="text-zinc-500 pl-12 border-l border-zinc-800 group-hover:border-amber-500 transition-colors duration-300">
                            {step.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

// --- TESTIMONIALS (The "Paddock") ---
const Reviews = () => {
  return (
    <section id="reviews" className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900 to-transparent skew-x-[-12deg] pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        <h2 className="text-center text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-20">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300">Feedback</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
            {[
                { name: "Marcus T.", car: "Ferrari 488", text: "Oscar is the only person I trust with my paint. The ceramic coating is absolutely bulletproof." },
                { name: "Jessica L.", car: "Tesla Model X", text: "Looks better than the day I picked it up from the dealership. Worth every penny." },
                { name: "Ryan B.", car: "BMW M4", text: "Professional, punctual, and obsessed with details. The interior feels brand new." }
            ].map((review, i) => (
                <div key={i} className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-8 hover:border-amber-500/50 transition-colors duration-300">
                    <div className="flex gap-1 text-amber-500 mb-6">
                        <Star className="fill-current w-4 h-4" />
                        <Star className="fill-current w-4 h-4" />
                        <Star className="fill-current w-4 h-4" />
                        <Star className="fill-current w-4 h-4" />
                        <Star className="fill-current w-4 h-4" />
                    </div>
                    <p className="text-gray-300 italic mb-6">"{review.text}"</p>
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <span className="font-bold text-white uppercase">{review.name}</span>
                        <span className="text-xs text-amber-500 font-mono">{review.car}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  )
}

const Footer = () => {
    return (
        <footer className="bg-black text-zinc-500 py-20 px-6 border-t border-zinc-900">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-2xl font-black text-white italic uppercase">
                    Cooper<span className="text-amber-500">.</span>
                </div>
                
                <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="hover:text-white transition-colors">Email</a>
                    <a href="#" className="hover:text-white transition-colors">Book Now</a>
                </div>

                <div className="text-xs uppercase tracking-widest text-zinc-700">
                    © 2026 Cooper's Mobile Detail
                </div>
            </div>
        </footer>
    )
}


// --- MAIN PAGE ---

export default function Home() {
  const { x, y } = useMousePosition();
  
  return (
    <main className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black overflow-x-hidden font-sans">
        <HexBackground />
      
      {/* Custom Crosshair Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-amber-500 pointer-events-none z-[100] hidden md:block mix-blend-difference"
        animate={{ x: x - 3, y: y - 3 }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 border-r-2 border-b-2 border-amber-500 pointer-events-none z-[100] hidden md:block mix-blend-difference"
        animate={{ x: x - 20, y: y - 20 }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      />
      
      <Navbar />
      <Hero />
      <StatsBar />
      <Services />
      <Showcase />
      <Process />
      <Reviews />
      <Footer />
    </main>
  );
}