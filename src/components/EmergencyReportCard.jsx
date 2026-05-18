import React from 'react';
import { Download, Share2, Heart } from 'lucide-react';

const EmergencyReportCard = ({ data }) => {
  return (
    <section className="py-24 bg-surface w-full flex justify-center">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <div className="text-center mb-12">
          <span className="font-orbitron text-accent text-sm tracking-[0.2em] uppercase font-bold">Emergency Identity</span>
          <h2 className="font-orbitron text-4xl font-bold text-text mt-2">Your Medical Passport — Always Ready.</h2>
        </div>

        <div className="glass w-full max-w-3xl aspect-[1.6/1] rounded-[24px] relative overflow-hidden group p-8 flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)] transition-all duration-500">
          {/* Holographic shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-rose-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[length:200%_200%] group-hover:animate-shimmer pointer-events-none z-0"></div>
          
          <div className="relative z-10 flex justify-between items-start border-b border-gradient-to-r from-accent/20 to-transparent pb-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white border-2 border-accent glow-primary flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full bg-surface"></div>
              </div>
              <div>
                <h3 className="font-orbitron text-3xl font-bold text-text uppercase">John Doe</h3>
                <div className="flex gap-2 mt-2">
                  <span className="bg-rose-200 text-accent font-sans text-xs px-3 py-1 rounded-full font-bold">{data.age} YRS</span>
                  <span className="bg-rose-200 text-accent font-sans text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1"><Heart size={10}/> Donor</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="font-orbitron text-xs text-accent font-bold tracking-widest text-right mb-2 leading-tight">
                MEDILINK AI<br/>EMERGENCY PASSPORT
              </div>
              <div className="font-orbitron text-5xl text-accent font-black">{data.bloodType}</div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-8 flex-1">
            <div className="space-y-6">
              <div>
                <div className="font-orbitron text-xs text-accent uppercase font-bold mb-2">Allergies</div>
                <div className="flex gap-2 flex-wrap">
                  {data.allergies.map(item => (
                    <span key={item} className="bg-surface border border-accent/20 text-accent font-sans text-xs px-3 py-1 rounded-md">{item}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-orbitron text-xs text-accent uppercase font-bold mb-2">Conditions</div>
                <div className="flex gap-2 flex-wrap">
                  {data.conditions.map(item => (
                    <span key={item} className="bg-surface border border-accent/20 text-accent font-sans text-xs px-3 py-1 rounded-md">{item}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-orbitron text-xs text-accent uppercase font-bold mb-2">Medications</div>
                <div className="flex gap-2 flex-wrap">
                  {data.medications.map(item => (
                    <span key={item} className="bg-surface border border-accent/20 text-accent font-sans text-xs px-3 py-1 rounded-md">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 border-l border-border pl-8">
              <div>
                <div className="font-orbitron text-xs text-text-muted uppercase font-bold mb-2">Emergency Contacts</div>
                {data.emergencyContacts.map(contact => (
                  <div key={contact.name} className="font-sans text-sm text-text mb-1">
                    <span className="font-bold">{contact.name}</span> ({contact.relation})<br/>
                    <span className="opacity-70">{contact.phone}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="font-orbitron text-xs text-text-muted uppercase font-bold mb-2">Primary Doctor</div>
                <div className="font-sans text-sm text-text">
                  <span className="font-bold">{data.primaryDoctor.name}</span><br/>
                  <span className="opacity-70">{data.primaryDoctor.specialty}</span>
                </div>
              </div>
              <div>
                <div className="font-orbitron text-xs text-text-muted uppercase font-bold mb-2">Insurance ID</div>
                <div className="font-sans text-sm text-text font-mono bg-white/50 px-2 py-1 inline-block rounded">{data.insuranceId}</div>
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
            
            {/* QR Code Placeholder */}
            <div className="w-16 h-16 bg-white border border-accent/20 p-1 flex flex-wrap relative">
              <div className="absolute inset-0 flex flex-wrap gap-[1px] p-1">
                {[...Array(64)].map((_, i) => (
                  <div key={i} className={`w-[6px] h-[6px] ${Math.random() > 0.5 ? 'bg-accent' : 'bg-transparent'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button className="flex items-center gap-2 px-6 py-3 bg-transparent border border-accent text-accent font-orbitron font-semibold rounded-xl hover:bg-accent/5 transition-colors">
            <Download size={18} /> Download Card
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-orbitron font-semibold rounded-xl glow-primary hover:scale-105 transition-transform">
            <Share2 size={18} /> Share with ER
          </button>
        </div>
      </div>
    </section>
  );
};

export default EmergencyReportCard;
