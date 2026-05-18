import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background with animated radial grid */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="w-[200vw] h-[200vw] animate-breathe border-[1px] border-accent rounded-full opacity-20" />
        <div className="absolute w-[150vw] h-[150vw] animate-breathe border-[1px] border-accent rounded-full opacity-40" style={{ animationDelay: '1s' }} />
        <div className="absolute w-[100vw] h-[100vw] animate-breathe border-[1px] border-accent rounded-full opacity-60" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-accent/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-rose-200/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center h-full pt-20 pb-10">
        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-6 mt-10 lg:mt-0">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-orbitron font-bold text-4xl sm:text-6xl md:text-8xl leading-tight text-text"
          >
            Emergency Care.<br />
            <span className="text-3xl sm:text-5xl md:text-7xl">Instantly.</span><br />
            <span className="text-gradient">Intelligently.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-xl text-text-muted font-sans max-w-lg"
          >
            AI-powered health resource locator for critical moments — because seconds matter.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto relative z-50"
          >
            <button onClick={() => navigate('/emergency')} className="px-8 py-4 bg-accent text-white font-orbitron font-semibold rounded-xl glow-primary hover:scale-105 transition-transform w-full sm:w-auto">
              Find Emergency Care
            </button>
            <button onClick={() => navigate('/health-twin')} className="px-8 py-4 bg-white border border-accent text-accent font-orbitron font-semibold rounded-xl hover:shadow-[0_0_16px_rgba(153,27,27,0.2)] hover:scale-105 transition-all w-full sm:w-auto">
              Open Health Twin
            </button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center lg:justify-end"
        >
          <div className="glass w-full max-w-md p-6 rounded-[20px] glow-secondary relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-deep animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Activity className="text-accent animate-heartbeat" size={24} />
              </div>
              <div>
                <h3 className="font-orbitron font-semibold text-text">Live Analysis</h3>
                <p className="text-sm text-text-muted">Processing symptoms...</p>
              </div>
            </div>
            <div className="space-y-3 font-sans text-sm text-text">
              <div className="flex gap-2 items-center opacity-80"><span className="w-2 h-2 rounded-full bg-accent"></span> Chest tightness detected</div>
              <div className="flex gap-2 items-center opacity-60"><span className="w-2 h-2 rounded-full bg-accent"></span> Shortness of breath</div>
              <div className="flex gap-2 items-center opacity-40"><span className="w-2 h-2 rounded-full bg-accent"></span> Evaluating risk level...</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="w-6 h-6 border-b-2 border-r-2 border-accent transform rotate-45 animate-pulse-slow"></span>
      </div>
    </section>
  );
};

export default Hero;
