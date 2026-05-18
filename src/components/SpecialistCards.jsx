import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { MapPin } from 'lucide-react';

const Card3D = ({ specialist }) => {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useMotionTemplate`calc(${mouseY} * -8deg)`;
  const rotateY = useMotionTemplate`calc(${mouseX} * 8deg)`;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const initials = specialist.name
    .replace(/^Dr\.\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';

  const goToProfile = () => {
    navigate(`/specialist/${specialist.id}`);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      role="button"
      tabIndex={0}
      onClick={goToProfile}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToProfile();
        }
      }}
      className="glass rounded-[20px] w-[280px] shrink-0 p-6 flex flex-col relative group cursor-pointer"
    >
      <div style={{ transform: "translateZ(30px)" }} className="flex justify-between items-start mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-accent via-rose-400 to-transparent">
            <div className="w-full h-full bg-surface rounded-full flex items-center justify-center font-orbitron font-bold text-accent text-xl">
              {initials}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center">
            <div className={`w-2.5 h-2.5 rounded-full ${specialist.status === 'Available Now' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
          </div>
        </div>
        
        {/* Score Ring */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-border" />
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125} strokeDashoffset={125 - (125 * specialist.score) / 100} className="text-accent" />
          </svg>
          <span className="absolute font-orbitron text-accent text-xs font-bold">{specialist.score}</span>
        </div>
      </div>

      <div style={{ transform: "translateZ(20px)" }}>
        <h3 className="font-orbitron font-bold text-text text-lg">{specialist.name}</h3>
        <span className="inline-block bg-accent text-white text-[10px] px-2 py-1 rounded font-sans mt-1">{specialist.specialty}</span>
      </div>

      <div style={{ transform: "translateZ(15px)" }} className="mt-4 mb-6">
        <div className="flex justify-between text-xs text-text-muted font-sans mb-1">
          <span>Experience</span>
          <span>{specialist.experience} yrs</span>
        </div>
        <div className="w-full h-1 bg-rose-200 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full" style={{ width: `${(specialist.experience / 20) * 100}%` }}></div>
        </div>
      </div>

      <div style={{ transform: "translateZ(10px)" }} className="flex justify-between items-end mt-auto">
        <div className="font-sans text-xs">
          <div className="flex items-center gap-1 text-text mb-1"><MapPin size={12} className="text-accent"/> {specialist.distance} km</div>
          <div className="text-text-muted truncate w-32">{specialist.hospital}</div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToProfile();
          }}
          className="bg-accent text-white px-4 py-2 rounded-lg font-orbitron text-xs font-bold hover:scale-105 transition-transform"
        >
          Connect
        </button>
      </div>
    </motion.div>
  );
};

const SpecialistCards = ({ specialists }) => {
  return (
    <section className="py-24 bg-white overflow-hidden perspective-1000">
      <div className="container mx-auto px-6 mb-12">
        <span className="font-orbitron text-accent text-sm tracking-[0.2em] uppercase font-bold">Multi-Specialist Matching</span>
        <h2 className="font-orbitron text-4xl font-bold text-text mt-2">Because emergencies are rarely simple.</h2>
        <p className="text-text-muted font-sans mt-4 max-w-2xl">When complex symptoms arise, we analyze and connect you with multiple specialists simultaneously to form an immediate response team.</p>
      </div>

      <div className="flex overflow-x-auto gap-6 px-6 pb-8 pt-4 hide-scrollbar">
        {specialists.map(spec => (
          <Card3D key={spec.id} specialist={spec} />
        ))}
        {/* Empty space for scrolling padding */}
        <div className="w-6 shrink-0"></div>
      </div>
    </section>
  );
};

export default SpecialistCards;
