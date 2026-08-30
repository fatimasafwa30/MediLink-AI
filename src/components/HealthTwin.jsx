import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Droplet, ShieldCheck, User } from 'lucide-react';
import { usePatient } from '../context/PatientContext';

const HealthTwin = ({ data: propData }) => {
  const { activePatient } = usePatient();
  
  // Use active patient biometrics if available, fallback to props
  const data = activePatient?.biometrics || propData || {
    heartRate: 74,
    oxygen: 98,
    stress: 42,
    hydration: 80,
    score: 82
  };

  const patientName = activePatient?.fullName || 'Johnathan Doe';
  const bloodType = activePatient?.bloodType || 'B+';
  const age = activePatient?.age || 28;

  return (
    <section className="py-24 bg-surface w-full overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, var(--accent) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.05 }}></div>
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-orbitron text-xs tracking-wider uppercase mb-2">
            <Activity size={12} className="animate-heartbeat" /> Real-Time Biometric Digital Twin
          </div>
          <h2 className="font-orbitron text-4xl font-bold text-text mt-2">
            {patientName}'s Living <span className="text-accent">Health Twin</span>
          </h2>
          <p className="text-text-muted font-sans mt-3 max-w-xl mx-auto">
            Live neural reflection of {patientName} (Age {age}, Blood {bloodType}) — tracking hemodynamics and autonomic vitals in real time.
          </p>
        </div>

        <div className="relative w-full max-w-4xl min-h-[550px] flex flex-col lg:flex-row items-center justify-center pt-4">
          {/* SVG Silhouette */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none hidden md:flex">
            <svg viewBox="0 0 400 800" className="h-full w-auto drop-shadow-[0_0_30px_rgba(220,38,38,0.2)]">
              {/* Simplified Human Silhouette Outline */}
              <path d="M200 40 C 230 40, 250 60, 250 100 C 250 140, 220 160, 200 160 C 180 160, 150 140, 150 100 C 150 60, 170 40, 200 40 Z" fill="transparent" stroke="var(--accent)" strokeWidth="2" opacity="0.3" />
              <path d="M150 160 Q 100 180, 80 250 L 60 400 Q 50 450, 70 450 Q 90 450, 110 400 L 140 250 L 140 450 L 120 750 Q 120 780, 150 780 Q 170 780, 170 750 L 200 500 L 230 750 Q 230 780, 250 780 Q 280 780, 280 750 L 260 450 L 260 250 L 290 400 Q 310 450, 330 450 Q 350 450, 340 400 L 320 250 Q 300 180, 250 160 Z" fill="transparent" stroke="var(--accent)" strokeWidth="2" opacity="0.3" />
              
              {/* Heart Hotspot */}
              <circle cx="210" cy="220" r="15" fill="var(--accent-deep)" className="animate-heartbeat" />
              <circle cx="210" cy="220" r="25" fill="none" stroke="var(--accent)" strokeWidth="1" className="animate-pulse-ring" />
              <line x1="210" y1="220" x2="320" y2="150" stroke="var(--accent)" strokeWidth="1" opacity="0.5" strokeDasharray="4 4" />

              {/* Lungs Hotspot */}
              <path d="M180 200 Q 160 220, 170 260 Q 190 250, 195 210 Z" fill="var(--accent)" opacity="0.4" className="animate-breathe" />
              <path d="M220 200 Q 240 220, 230 260 Q 210 250, 205 210 Z" fill="var(--accent)" opacity="0.4" className="animate-breathe" />
              <line x1="175" y1="230" x2="80" y2="150" stroke="var(--accent)" strokeWidth="1" opacity="0.5" strokeDasharray="4 4" />

              {/* Brain Hotspot */}
              <ellipse cx="200" cy="90" rx="35" ry="30" fill="var(--accent)" opacity="0.1" className="animate-pulse-slow" />
              <line x1="200" y1="70" x2="100" y2="50" stroke="var(--accent)" strokeWidth="1" opacity="0.5" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Metric Cards - responsive positioning */}
          <div className="w-full lg:absolute lg:top-8 lg:left-24 glass p-4 rounded-2xl lg:animate-float mb-4 lg:mb-0 lg:max-w-xs z-10" style={{ animationDelay: '0s' }}>
            <div className="text-xs font-sans text-text-muted mb-1 flex items-center justify-between">
              <span>Stress Index</span>
              <span className="font-orbitron font-bold text-accent">{data.stress}%</span>
            </div>
            <div className="text-text font-bold font-sans">
              {data.stress > 60 ? 'High' : data.stress > 35 ? 'Moderate' : 'Calm'}
            </div>
            <div className="w-full h-2 mt-2 bg-rose-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 via-amber-400 to-accent transition-all duration-500" style={{ width: `${data.stress}%` }}></div>
            </div>
          </div>

          <div className="w-full lg:absolute lg:top-24 lg:right-24 glass p-4 rounded-2xl lg:animate-float mb-4 lg:mb-0 lg:max-w-xs z-10" style={{ animationDelay: '1.5s' }}>
            <div className="text-xs font-sans text-text-muted mb-1 flex items-center gap-1">
              <Heart size={12} className="text-accent animate-heartbeat" /> Heart Rate
            </div>
            <div className="text-accent font-bold font-orbitron text-3xl">
              {data.heartRate} <span className="text-sm font-normal text-text-muted">BPM</span>
            </div>
            <svg viewBox="0 0 100 30" className="w-full h-8 mt-1">
              <path d="M0 15 L 20 15 L 30 5 L 40 25 L 50 10 L 60 20 L 70 15 L 100 15" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="w-full lg:absolute lg:top-64 lg:left-24 glass p-4 rounded-2xl flex items-center gap-4 lg:animate-float lg:max-w-xs z-10" style={{ animationDelay: '3s' }}>
            <div className="relative w-12 h-12 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="var(--surface)" strokeWidth="4" fill="transparent" />
                <circle cx="24" cy="24" r="20" stroke="var(--accent)" strokeWidth="4" fill="transparent" strokeDasharray="125" strokeDashoffset={125 - (125 * data.oxygen) / 100} />
              </svg>
            </div>
            <div>
              <div className="text-xs font-sans text-text-muted">Blood Oxygen</div>
              <div className="text-text font-bold font-orbitron text-xl">SpO₂ {data.oxygen}%</div>
            </div>
          </div>

          <div className="w-full lg:absolute lg:top-72 lg:right-24 glass p-4 rounded-2xl flex items-center gap-3 lg:animate-float lg:max-w-xs z-10" style={{ animationDelay: '2s' }}>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <Droplet size={20} />
            </div>
            <div>
              <div className="text-xs font-sans text-text-muted">Hydration Level</div>
              <div className="text-text font-bold font-orbitron text-lg">{data.hydration || 80}%</div>
            </div>
          </div>
        </div>

        {/* Big Health Score Circular Dial */}
        <div className="mt-8 text-center relative z-20">
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="var(--border)" strokeWidth="6" fill="transparent" />
              <circle cx="96" cy="96" r="80" stroke="var(--accent)" strokeWidth="6" fill="transparent" strokeDasharray="502" strokeDashoffset={502 - (502 * (data.score || 85)) / 100} className="transition-all duration-1000 ease-out" />
              
              <circle cx="96" cy="96" r="65" stroke="var(--border)" strokeWidth="4" fill="transparent" />
              <circle cx="96" cy="96" r="65" stroke="var(--accent-deep)" strokeWidth="4" fill="transparent" strokeDasharray="408" strokeDashoffset={408 - (408 * 60) / 100} />
              
              <circle cx="96" cy="96" r="50" stroke="var(--border)" strokeWidth="2" fill="transparent" />
              <circle cx="96" cy="96" r="50" stroke="var(--accent)" opacity="0.5" strokeWidth="2" fill="transparent" strokeDasharray="314" strokeDashoffset={314 - (314 * 90) / 100} />
            </svg>
            <div className="flex flex-col items-center">
              <span className="font-orbitron text-5xl font-bold text-accent">{data.score || 85}</span>
              <span className="font-sans text-xs text-text-muted mt-1 uppercase tracking-widest">Health Score</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthTwin;
