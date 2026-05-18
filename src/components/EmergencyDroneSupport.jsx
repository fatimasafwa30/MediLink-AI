import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Package, Zap } from 'lucide-react';

const EmergencyDroneSupport = ({ drones }) => {
  return (
    <section className="py-24 bg-white w-full overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <span className="font-orbitron text-accent text-sm tracking-[0.2em] uppercase font-bold flex items-center gap-2">
            <Zap size={14} /> Autonomous Delivery
          </span>
          <h2 className="font-orbitron text-4xl font-bold text-text mt-2">Emergency Drone Support</h2>
          <p className="text-text-muted font-sans mt-4 max-w-2xl">Bypassing traffic, floods, and rugged terrain. Defibrillators, blood packets, and essential medications delivered from the sky in minutes.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 glass p-1 rounded-[24px] bg-surface relative overflow-hidden h-[400px]">
            {/* Map Background Simulation */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--accent) 0, var(--accent) 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>
            
            {/* Drone Tracker Map UI */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="glass px-4 py-2 rounded-lg inline-flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                  <span className="font-orbitron text-xs font-bold text-text tracking-widest uppercase">Airspace Active</span>
                </div>
              </div>

              {/* Drone Animation Container */}
              <div className="relative w-full h-full mt-8">
                {/* User Location */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-accent rounded-full glow-primary"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 font-orbitron text-[10px] text-text font-bold uppercase tracking-wider">Destination</div>
                </div>

                {/* Drone 1 */}
                <motion.div 
                  initial={{ x: -200, y: -100 }}
                  animate={{ x: 100, y: 150 }}
                  transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                  className="absolute top-1/4 left-1/4 flex flex-col items-center"
                >
                  <div className="w-10 h-10 bg-white rounded-full border-2 border-accent flex items-center justify-center shadow-[0_10px_20px_rgba(220,38,38,0.3)]">
                    <Plane size={20} className="text-accent" />
                  </div>
                  <div className="glass mt-2 px-2 py-1 rounded text-[10px] font-sans font-bold text-text whitespace-nowrap">
                    DRN-77 • AED • 3 min
                  </div>
                </motion.div>

                 {/* Drone 2 */}
                 <motion.div 
                  initial={{ x: 400, y: -50 }}
                  animate={{ x: 50, y: 200 }}
                  transition={{ duration: 20, ease: "linear", repeat: Infinity, delay: 5 }}
                  className="absolute top-1/4 right-1/4 flex flex-col items-center"
                >
                  <div className="w-10 h-10 bg-white rounded-full border-2 border-accent flex items-center justify-center shadow-[0_10px_20px_rgba(220,38,38,0.3)]">
                    <Plane size={20} className="text-accent transform rotate-[-45deg]" />
                  </div>
                  <div className="glass mt-2 px-2 py-1 rounded text-[10px] font-sans font-bold text-text whitespace-nowrap">
                    DRN-82 • Blood (O-) • 6 min
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {drones.map((drone, idx) => (
              <div key={idx} className="glass p-6 rounded-[20px] hover:border-accent transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-orbitron font-bold text-text">{drone.id}</h3>
                    <div className="text-xs text-text-muted font-sans mt-1">Payload: <span className="font-bold text-text">{drone.type}</span></div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                    <Package size={16} className="text-accent group-hover:text-white" />
                  </div>
                </div>
                
                <div className="bg-surface rounded-lg p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${drone.status === 'In Transit' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                    <span className="font-sans text-xs font-bold text-text">{drone.status}</span>
                  </div>
                  <div className="font-orbitron text-accent font-bold text-lg">{drone.eta}</div>
                </div>
                
                <div className="mt-4 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: drone.status === 'In Transit' ? '70%' : '20%' }}></div>
                </div>
              </div>
            ))}

            <button className="mt-auto w-full py-4 border-2 border-dashed border-accent/30 text-accent font-orbitron font-bold rounded-[20px] hover:bg-accent/5 transition-colors">
              + Request Drone Dispatch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyDroneSupport;
