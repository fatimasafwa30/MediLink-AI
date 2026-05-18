import React from 'react';
import { Activity, Share2, Globe, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white relative overflow-hidden">
      {/* Top border with shimmer */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/20"></div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-accent">
              <Activity size={24} className="animate-heartbeat" />
              <span className="font-orbitron font-bold text-xl tracking-wider">MEDILINK AI</span>
            </div>
            <p className="font-sans text-sm text-text-muted mt-2">Powered by AI. Built for emergencies.</p>
          </div>

          <div className="flex items-center gap-8 font-sans text-sm text-text font-semibold">
            <a href="#" className="hover:text-accent hover:underline decoration-accent underline-offset-4 transition-all">Platform</a>
            <a href="#" className="hover:text-accent hover:underline decoration-accent underline-offset-4 transition-all">Technology</a>
            <a href="#" className="hover:text-accent hover:underline decoration-accent underline-offset-4 transition-all">Privacy</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors"><Share2 size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors"><Globe size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors"><Mail size={18} /></a>
          </div>
          
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-text-muted">
          <p>© 2035 MediLink AI. All rights reserved.</p>
          <p>Not a replacement for calling local emergency services (911/112).</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
