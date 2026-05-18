import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, Users, Ambulance, Hospital, X } from 'lucide-react';

const SOSOverlay = ({ onClose }) => {
  const [countdown, setCountdown] = useState(10);
  const [checklist, setChecklist] = useState({
    location: false,
    contacts: false,
    ambulance: false,
    hospital: false
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const sequence = [
      { key: 'location', time: 2000 },
      { key: 'contacts', time: 4000 },
      { key: 'ambulance', time: 6000 },
      { key: 'hospital', time: 8000 },
    ];

    const timeouts = sequence.map(item => 
      setTimeout(() => {
        setChecklist(prev => ({ ...prev, [item.key]: true }));
      }, item.time)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-red-600/5 backdrop-blur-sm"
      ></motion.div>
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border-2 border-accent/30 rounded-[24px] p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)] flex flex-col items-center text-center mx-4"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-accent transition-colors">
          <X size={24} />
        </button>

        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          <div className="absolute inset-0 border-4 border-accent rounded-full animate-pulse-ring"></div>
          <div className="absolute inset-0 border-4 border-accent rounded-full animate-pulse-ring" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute inset-0 border-4 border-accent rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 border-4 border-accent rounded-full animate-pulse-ring" style={{ animationDelay: '1.5s' }}></div>
          
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="var(--border)" strokeWidth="4" fill="transparent" />
            <circle cx="96" cy="96" r="80" stroke="var(--accent)" strokeWidth="4" fill="transparent" strokeDasharray="502" strokeDashoffset={502 - (502 * (countdown / 10))} className="transition-all duration-1000 linear" />
          </svg>
          
          <span className="font-orbitron text-6xl text-accent font-bold">{countdown}</span>
        </div>

        <h2 className="font-orbitron text-3xl font-bold text-accent mb-8 shadow-accent">SOS ACTIVATED</h2>

        <div className="w-full space-y-4 mb-8 text-left font-sans text-sm">
          <div className="flex items-center gap-3">
            <div className="w-6 flex justify-center">{checklist.location ? <CheckCircle size={20} className="text-accent" /> : <MapPin size={20} className="text-text-muted opacity-50" />}</div>
            <span className={checklist.location ? "text-text font-bold" : "text-text-muted"}>Live Location Shared</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 flex justify-center">{checklist.contacts ? <CheckCircle size={20} className="text-accent" /> : <Users size={20} className="text-text-muted opacity-50" />}</div>
            <span className={checklist.contacts ? "text-text font-bold" : "text-text-muted"}>Emergency Contacts Alerted</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 flex justify-center">{checklist.ambulance ? <CheckCircle size={20} className="text-accent" /> : <Ambulance size={20} className="text-text-muted opacity-50" />}</div>
            <span className={checklist.ambulance ? "text-text font-bold" : "text-text-muted"}>Ambulance Dispatched {!checklist.ambulance && <span className="animate-pulse">...</span>}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 flex justify-center">{checklist.hospital ? <CheckCircle size={20} className="text-accent" /> : <Hospital size={20} className="text-text-muted opacity-50" />}</div>
            <span className={checklist.hospital ? "text-text font-bold" : "text-text-muted"}>Nearest Hospital Notified</span>
          </div>
        </div>

        <div className="w-full bg-surface border border-accent/20 rounded-xl p-4 mb-6 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
          <p className="font-sans text-sm text-text font-semibold relative z-10">
            "Stay calm. Help is 4 minutes away. Keep your phone on. I'm with you."
          </p>
          <span className="text-xs text-text-muted font-sans mt-2 block">— Red, AI Companion</span>
        </div>

        <button onClick={onClose} className="px-8 py-3 rounded-full border-2 border-accent text-accent font-orbitron font-bold hover:bg-accent hover:text-white transition-colors w-full">
          CANCEL SOS
        </button>
      </motion.div>
    </div>
  );
};

export default SOSOverlay;
