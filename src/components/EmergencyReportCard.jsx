import React, { useState } from 'react';
import { Download, Share2, Heart, Check, ShieldCheck } from 'lucide-react';
import { usePatient } from '../context/PatientContext';

const EmergencyReportCard = ({ data: propData }) => {
  const { activePatient } = usePatient();
  const [shared, setShared] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const passport = activePatient?.emergencyPassport || propData || {
    allergies: ['Penicillin', 'Shellfish'],
    conditions: ['Asthma (Mild)'],
    medications: ['Albuterol Sulfate'],
    emergencyContacts: [{ name: 'Sarah Connor', phone: '+1 555-0198', relation: 'Sister' }],
    primaryDoctor: { name: 'Dr. Aris Thorne', specialty: 'General Practice' },
    insuranceId: 'ML-8492001-B'
  };

  const patientName = activePatient?.fullName || 'Johnathan Doe';
  const age = activePatient?.age || 28;
  const bloodType = activePatient?.bloodType || 'B+';
  const insuranceId = activePatient?.insuranceId || 'ML-8492001-B';
  const isOrganDonor = activePatient?.isOrganDonor ?? true;

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section className="py-24 bg-surface w-full flex justify-center">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <div className="text-center mb-12">
          <span className="font-orbitron text-accent text-sm tracking-[0.2em] uppercase font-bold">Emergency Identity</span>
          <h2 className="font-orbitron text-4xl font-bold text-text mt-2">
            {patientName}'s Medical Passport — Always Ready.
          </h2>
        </div>

        <div className="glass w-full max-w-3xl aspect-[1.6/1] rounded-[24px] relative overflow-hidden group p-8 flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)] transition-all duration-500">
          {/* Holographic shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-rose-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[length:200%_200%] group-hover:animate-shimmer pointer-events-none z-0"></div>
          
          <div className="relative z-10 flex justify-between items-start border-b border-gradient-to-r from-accent/20 to-transparent pb-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-accent glow-primary flex items-center justify-center p-1 overflow-hidden">
                <img 
                  src={activePatient?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} 
                  alt={patientName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-orbitron text-2xl sm:text-3xl font-bold text-text uppercase">{patientName}</h3>
                <div className="flex gap-2 mt-2">
                  <span className="bg-rose-200 text-accent font-sans text-xs px-3 py-1 rounded-full font-bold">{age} YRS</span>
                  {isOrganDonor && (
                    <span className="bg-rose-200 text-accent font-sans text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <Heart size={10}/> Donor
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="font-orbitron text-xs text-accent font-bold tracking-widest text-right mb-2 leading-tight">
                MEDILINK AI<br/>EMERGENCY PASSPORT
              </div>
              <div className="font-orbitron text-5xl text-accent font-black">{bloodType}</div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            <div className="space-y-6">
              <div>
                <div className="font-orbitron text-xs text-accent uppercase font-bold mb-2">Allergies</div>
                <div className="flex gap-2 flex-wrap">
                  {passport.allergies && passport.allergies.length > 0 ? (
                    passport.allergies.map(item => (
                      <span key={item} className="bg-surface border border-accent/20 text-accent font-sans text-xs px-3 py-1 rounded-md">{item}</span>
                    ))
                  ) : (
                    <span className="text-xs text-text-muted">No known allergies</span>
                  )}
                </div>
              </div>
              <div>
                <div className="font-orbitron text-xs text-accent uppercase font-bold mb-2">Conditions</div>
                <div className="flex gap-2 flex-wrap">
                  {passport.conditions && passport.conditions.length > 0 ? (
                    passport.conditions.map(item => (
                      <span key={item} className="bg-surface border border-accent/20 text-accent font-sans text-xs px-3 py-1 rounded-md">{item}</span>
                    ))
                  ) : (
                    <span className="text-xs text-text-muted">No chronic conditions</span>
                  )}
                </div>
              </div>
              <div>
                <div className="font-orbitron text-xs text-accent uppercase font-bold mb-2">Medications</div>
                <div className="flex gap-2 flex-wrap">
                  {passport.medications && passport.medications.length > 0 ? (
                    passport.medications.map(item => (
                      <span key={item} className="bg-surface border border-accent/20 text-accent font-sans text-xs px-3 py-1 rounded-md">{item}</span>
                    ))
                  ) : (
                    <span className="text-xs text-text-muted">No active prescriptions</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
              <div>
                <div className="font-orbitron text-xs text-text-muted uppercase font-bold mb-2">Emergency Contacts</div>
                {passport.emergencyContacts && passport.emergencyContacts.length > 0 ? (
                  passport.emergencyContacts.map((contact, i) => (
                    <div key={i} className="font-sans text-sm text-text mb-1">
                      <span className="font-bold">{contact.name}</span> ({contact.relation})<br/>
                      <span className="opacity-70">{contact.phone}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-text-muted">None registered</span>
                )}
              </div>
              {passport.primaryDoctor && (
                <div>
                  <div className="font-orbitron text-xs text-text-muted uppercase font-bold mb-2">Primary Doctor</div>
                  <div className="font-sans text-sm text-text">
                    <span className="font-bold">{passport.primaryDoctor.name}</span><br/>
                    <span className="opacity-70">{passport.primaryDoctor.specialty}</span>
                  </div>
                </div>
              )}
              <div>
                <div className="font-orbitron text-xs text-text-muted uppercase font-bold mb-2">Insurance ID</div>
                <div className="font-sans text-sm text-text font-mono bg-white/50 dark:bg-gray-800 px-2 py-1 inline-block rounded">{insuranceId}</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-6 border-t border-border flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="font-sans text-xs font-bold text-accent uppercase tracking-wider">Live Location Active</span>
            </div>
            
            {/* Hologram QR Code */}
            <div className="w-14 h-14 bg-white border border-accent/20 p-1 flex flex-wrap relative">
              <div className="absolute inset-0 flex flex-wrap gap-[1px] p-1">
                {[...Array(49)].map((_, i) => (
                  <div key={i} className={`w-[5px] h-[5px] ${i % 2 === 0 || i % 3 === 0 ? 'bg-accent' : 'bg-transparent'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-transparent border border-accent text-accent font-orbitron font-semibold rounded-xl hover:bg-accent/5 transition-colors"
          >
            {downloaded ? <><Check size={18} /> Card Downloaded</> : <><Download size={18} /> Download Card</>}
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-orbitron font-semibold rounded-xl glow-primary hover:scale-105 transition-transform"
          >
            {shared ? <><Check size={18} /> Dispatched to Nearest ER</> : <><Share2 size={18} /> Share with ER</>}
          </button>
        </div>
      </div>
    </section>
  );
};

export default EmergencyReportCard;
