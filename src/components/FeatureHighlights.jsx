import React from 'react';
import { Camera, Clock, WifiOff, Watch, Users, BrainCircuit, Bell, HeartHandshake, Mic, Globe } from 'lucide-react';

const FeatureHighlights = () => {
  const features = [
    { icon: <Camera size={20} />, title: 'AI Medicine Scanner', desc: 'Point. Scan. Understand.' },
    { icon: <Clock size={20} />, title: 'Hospital Wait Prediction', desc: 'Know before you go.' },
    { icon: <WifiOff size={20} />, title: 'Offline Emergency Mode', desc: 'Works without signal.' },
    { icon: <Watch size={20} />, title: 'Wearable Integration', desc: 'Your watch, our brain.' },
    { icon: <Users size={20} />, title: 'Family Network', desc: 'Monitor everyone you love.' },
    { icon: <BrainCircuit size={20} />, title: 'AI Recovery Plans', desc: 'Personalized. Adaptive.' },
    { icon: <Bell size={20} />, title: 'Predictive Alerts', desc: 'We warn before it happens.' },
    { icon: <HeartHandshake size={20} />, title: 'Mental Health Tracker', desc: 'Emotions matter in recovery.' },
    { icon: <Mic size={20} />, title: 'Voice Navigation', desc: 'Hands-free in a crisis.' },
    { icon: <Globe size={20} />, title: 'Multilingual Access', desc: 'No barrier to care.' },
  ];

  return (
    <section className="py-24 bg-white w-full overflow-hidden">
      <div className="container mx-auto px-6 mb-12 text-center">
        <span className="font-orbitron text-accent text-sm tracking-[0.2em] uppercase font-bold">Beyond Emergency</span>
        <h2 className="font-orbitron text-4xl font-bold text-text mt-2">A complete ecosystem of intelligent care.</h2>
      </div>

      <div className="flex overflow-x-auto gap-4 px-6 pb-8 pt-4 hide-scrollbar">
        {features.map((feature, idx) => (
          <div key={idx} className="glass rounded-full px-6 py-4 flex items-center gap-4 shrink-0 border border-accent/10 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_10px_20px_rgba(220,38,38,0.1)] transition-all cursor-default">
            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
              {feature.icon}
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-sm text-text whitespace-nowrap">{feature.title}</h4>
              <p className="font-sans text-xs text-text-muted whitespace-nowrap">{feature.desc}</p>
            </div>
          </div>
        ))}
        <div className="w-6 shrink-0"></div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
