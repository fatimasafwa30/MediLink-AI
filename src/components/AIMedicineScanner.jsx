import React, { useState, useEffect } from 'react';
import { Scan, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const AIMedicineScanner = () => {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setScanning(prev => !prev);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-surface w-full">
      <div className="container mx-auto px-6 text-center mb-12">
        <span className="font-orbitron text-accent text-sm tracking-[0.2em] uppercase font-bold flex justify-center items-center gap-2">
          <Scan size={14} /> Augmented Reality
        </span>
        <h2 className="font-orbitron text-4xl font-bold text-text mt-2">AI Medicine Scanner</h2>
        <p className="text-text-muted font-sans mt-4 max-w-2xl mx-auto">Point your camera. Instantly understand expiry dates, critical side effects, and dangerous interactions based on your Health Twin profile.</p>
      </div>

      <div className="w-full max-w-4xl mx-auto aspect-video bg-gray-900 rounded-[24px] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        {/* Fake Camera Feed Background */}
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          {/* A blurred shape to represent a medicine bottle in the camera */}
          <div className="w-48 h-64 bg-gray-700 blur-md rounded-xl"></div>
        </div>

        {/* Camera UI Overlay */}
        <div className="absolute inset-0 border-4 border-white/10 rounded-[24px] pointer-events-none"></div>
        
        {/* AR Tracking Brackets */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80">
          {/* Top Left */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent transition-all duration-300" style={{ transform: scanning ? 'translate(-10px, -10px)' : 'translate(0, 0)' }}></div>
          {/* Top Right */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent transition-all duration-300" style={{ transform: scanning ? 'translate(10px, -10px)' : 'translate(0, 0)' }}></div>
          {/* Bottom Left */}
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent transition-all duration-300" style={{ transform: scanning ? 'translate(-10px, 10px)' : 'translate(0, 0)' }}></div>
          {/* Bottom Right */}
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent transition-all duration-300" style={{ transform: scanning ? 'translate(10px, 10px)' : 'translate(0, 0)' }}></div>
          
          {/* Scanning Line */}
          {scanning && <div className="absolute top-0 left-0 w-full h-[2px] bg-accent glow-primary animate-float" style={{ animationDuration: '2s' }}></div>}
        </div>

        {/* Floating Data Panels (Visible when NOT scanning / "scanned") */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${scanning ? 'opacity-0' : 'opacity-100'}`}>
          {/* Line connecting to bottle */}
          <div className="absolute top-[40%] left-[55%] w-32 h-[1px] bg-accent/50 hidden md:block"></div>
          
          <div className="absolute top-[20%] right-[10%] glass-dark p-4 rounded-xl border border-accent/30 w-64">
            <h4 className="font-orbitron font-bold text-white text-sm">Amoxicillin 500mg</h4>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-gray-400">Expiry</span>
                <span className="text-green-400 flex items-center gap-1"><CheckCircle size={10} /> Valid (2036)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-gray-400">Dosage</span>
                <span className="text-white">1 capsule / 8hr</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[20%] left-[10%] glass-dark p-4 rounded-xl border border-accent w-64 bg-accent/10">
            <h4 className="font-orbitron font-bold text-white text-sm flex items-center gap-2"><AlertTriangle size={14} className="text-accent" /> Interaction Alert</h4>
            <p className="font-sans text-xs text-gray-300 mt-2">
              Cross-referenced with Health Twin: Conflicts with your current Penicillin allergy. <strong className="text-accent">DO NOT TAKE.</strong>
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur px-6 py-2 rounded-full flex items-center gap-2">
          {scanning ? (
            <><div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div> <span className="font-orbitron text-xs text-white uppercase tracking-widest">Scanning...</span></>
          ) : (
            <><Info size={14} className="text-white"/> <span className="font-orbitron text-xs text-white uppercase tracking-widest">Analysis Complete</span></>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIMedicineScanner;
