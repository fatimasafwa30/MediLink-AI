import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Clock, WifiOff, Watch, Users, BrainCircuit, Bell, HeartHandshake, Mic, Globe, Stethoscope, MapPin, Pill, Heart, Activity } from 'lucide-react';

const FeatureHighlights = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Pill size={20} />, title: 'AI Medicine Scanner', desc: 'Scan pills, check dose safety.', path: '/scanner' },
    { icon: <Stethoscope size={20} />, title: 'Doctor Portal', desc: 'Prescribe & schedule timings.', path: '/doctor-portal' },
    { icon: <Heart size={20} />, title: 'Digital Health Twin', desc: 'Live biometric telemetry.', path: '/health-twin' },
    { icon: <MapPin size={20} />, title: 'Live Hospital Map', desc: 'Trauma & ICU bed tracker.', path: '/map' },
    { icon: <Activity size={20} />, title: 'Emergency AI Triage', desc: 'Instant clinical guidance.', path: '/emergency' },
    { icon: <Users size={20} />, title: 'Patient Passport', desc: 'Holographic medical ID card.', path: '/profile' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950 w-full overflow-hidden border-t border-border">
      <div className="container mx-auto px-6 mb-8 text-center">
        <span className="font-orbitron text-accent text-xs tracking-[0.2em] uppercase font-bold">Explore Platform</span>
        <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-text mt-1">A complete ecosystem of intelligent care.</h2>
        <p className="text-xs text-text-muted font-sans mt-2">Tap any section to launch the tool:</p>
      </div>

      <div className="flex overflow-x-auto gap-4 px-6 pb-6 pt-2 hide-scrollbar">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(feature.path)}
            className="glass rounded-2xl px-5 py-4 flex items-center gap-3.5 shrink-0 border border-accent/20 hover:-translate-y-1 hover:border-accent hover:shadow-[0_10px_20px_rgba(220,38,38,0.15)] transition-all cursor-pointer bg-surface"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              {feature.icon}
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-xs text-text whitespace-nowrap">{feature.title}</h4>
              <p className="font-sans text-[11px] text-text-muted whitespace-nowrap">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureHighlights;
