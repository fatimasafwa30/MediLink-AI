import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsDashboard = () => {
  return (
    <section className="py-24 bg-surface w-full">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <span className="font-orbitron text-accent text-sm tracking-[0.2em] uppercase font-bold">Biometric Intelligence</span>
          <h2 className="font-orbitron text-4xl font-bold text-text mt-2">Your body speaks. We listen in real time.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Heartbeat */}
          <div className="glass p-6 rounded-[20px] border-t-4 border-t-accent relative overflow-hidden group">
            <h3 className="font-sans font-bold text-text-muted text-sm mb-4">Heart Rate Trend</h3>
            <div className="flex justify-between items-end mb-4">
              <span className="font-orbitron text-4xl font-bold text-accent">74 <span className="text-lg">bpm</span></span>
              <span className="font-sans text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Normal Range</span>
            </div>
            <div className="h-16 w-full relative">
              <svg viewBox="0 0 200 40" className="w-full h-full preserve-aspect-ratio-none">
                <path d="M0 20 L 40 20 L 50 10 L 60 30 L 70 20 L 120 20 L 130 5 L 140 35 L 150 20 L 200 20" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" className="animate-shimmer" style={{ strokeDasharray: '200', strokeDashoffset: '200', animation: 'shimmer 3s infinite linear' }} />
              </svg>
            </div>
          </div>

          {/* Sleep Analytics */}
          <div className="glass p-6 rounded-[20px] border-t-4 border-t-accent-deep relative">
            <h3 className="font-sans font-bold text-text-muted text-sm mb-4">Sleep Analytics</h3>
            <div className="flex justify-between items-end mb-4">
              <span className="font-orbitron text-4xl font-bold text-text">6.8 <span className="text-lg text-text-muted">hrs</span></span>
              <span className="font-sans text-xs text-text-muted">7-day avg</span>
            </div>
            <div className="flex justify-between items-end h-20 gap-1">
              {[5, 6.5, 7, 5.5, 8, 7.5, 6.8].map((h, i) => (
                <div key={i} className="flex-1 bg-rose-100 rounded-t-sm relative group/bar">
                  <motion.div initial={{ height: 0 }} whileInView={{ height: `${(h/10)*100}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }} className="absolute bottom-0 w-full bg-gradient-to-t from-accent to-rose-400 rounded-t-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Risk Prediction */}
          <div className="glass p-6 rounded-[20px] border-t-4 border-t-accent relative flex flex-col">
            <h3 className="font-sans font-bold text-text-muted text-sm mb-4">AI Risk Prediction</h3>
            <div className="flex-1 flex items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-32 h-32">
                <polygon points="50,10 90,35 75,85 25,85 10,35" fill="none" stroke="var(--border)" strokeWidth="1" />
                <polygon points="50,25 75,45 65,70 35,70 25,45" fill="none" stroke="var(--border)" strokeWidth="1" />
                <motion.polygon initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} points="50,30 80,45 60,80 30,70 15,40" fill="var(--accent)" fillOpacity="0.15" stroke="var(--accent)" strokeWidth="1.5" />
                <circle cx="50" cy="30" r="2" fill="var(--accent)" />
                <circle cx="80" cy="45" r="2" fill="var(--accent)" />
                <circle cx="60" cy="80" r="2" fill="var(--accent)" />
                <circle cx="30" cy="70" r="2" fill="var(--accent)" />
                <circle cx="15" cy="40" r="2" fill="var(--accent)" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
