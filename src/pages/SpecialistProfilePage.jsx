import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Award,
  Languages,
  Clock,
  Phone,
  Shield,
  Activity,
} from 'lucide-react';
import { getSpecialistById } from '../data';

const SpecialistProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const specialist = getSpecialistById(id);

  if (!specialist) {
    return (
      <main className="min-h-screen bg-background pt-28 pb-24 px-6">
        <div className="container mx-auto max-w-lg text-center glass rounded-[24px] p-10 border border-border">
          <h1 className="font-orbitron text-2xl text-text mb-4">Specialist not found</h1>
          <p className="text-text-muted font-sans text-sm mb-8">
            This profile link may be invalid or the specialist is no longer in the match pool.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-orbitron text-sm font-bold text-accent hover:underline"
          >
            <ArrowLeft size={18} aria-hidden />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const initials = specialist.name
    .replace(/^Dr\.\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <main className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 font-orbitron text-sm font-semibold text-accent hover:text-accent/80 transition-colors mb-8"
        >
          <ArrowLeft size={18} aria-hidden />
          Back to matching
        </button>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass rounded-[28px] border border-border overflow-hidden shadow-xl shadow-accent/5"
        >
          <div className="h-32 bg-gradient-to-br from-accent/20 via-rose-100/40 to-transparent relative" />
          <div className="px-8 pb-10 -mt-14 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="w-28 h-28 rounded-2xl p-[3px] bg-gradient-to-br from-accent via-rose-400 to-transparent shrink-0 shadow-lg">
                <div className="w-full h-full bg-surface rounded-[20px] flex items-center justify-center font-orbitron font-bold text-3xl text-accent">
                  {initials}
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-2 sm:pt-0 sm:pb-1">
                <div className="flex flex-wrap items-center gap-2 gap-y-1 mb-1">
                  <span className="font-orbitron text-xs font-bold uppercase tracking-widest text-accent">
                    Verified specialist
                  </span>
                  <span
                    className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${
                      specialist.status === 'Available Now'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {specialist.status}
                  </span>
                </div>
                <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-text leading-tight">
                  {specialist.name}
                </h1>
                <p className="font-sans text-text-muted text-sm mt-1">{specialist.title}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-accent text-white text-xs font-orbitron font-bold px-3 py-1 rounded-lg">
                    {specialist.specialty}
                  </span>
                  <span className="glass text-text text-xs font-sans font-semibold px-3 py-1 rounded-lg border border-border">
                    Match score {specialist.score}
                  </span>
                </div>
              </div>
            </div>

            <p className="font-sans text-text/90 leading-relaxed mt-8 text-sm sm:text-base border-t border-border pt-8">
              {specialist.bio}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <div className="glass rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-2 text-accent font-orbitron text-xs font-bold uppercase tracking-wide mb-2">
                  <MapPin size={14} aria-hidden />
                  Primary site
                </div>
                <p className="font-sans font-semibold text-text">{specialist.hospital}</p>
                <p className="font-sans text-sm text-text-muted mt-1">{specialist.distance} km from you</p>
              </div>
              <div className="glass rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-2 text-accent font-orbitron text-xs font-bold uppercase tracking-wide mb-2">
                  <Clock size={14} aria-hidden />
                  Response
                </div>
                <p className="font-sans font-semibold text-text">{specialist.responseTime}</p>
                <p className="font-sans text-sm text-text-muted mt-1 flex items-center gap-1">
                  <Phone size={12} className="text-accent shrink-0" aria-hidden />
                  {specialist.secureLine}
                </p>
              </div>
            </div>

            <div className="mt-8 glass rounded-2xl p-5 border border-border">
              <div className="flex items-center gap-2 text-accent font-orbitron text-xs font-bold uppercase tracking-wide mb-3">
                <Award size={14} aria-hidden />
                Credentials
              </div>
              <ul className="space-y-2">
                {specialist.credentials.map((line) => (
                  <li key={line} className="font-sans text-sm text-text flex items-start gap-2">
                    <Shield size={14} className="text-accent shrink-0 mt-0.5" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 glass rounded-2xl p-5 border border-border">
              <div className="flex items-center gap-2 text-accent font-orbitron text-xs font-bold uppercase tracking-wide mb-3">
                <Languages size={14} aria-hidden />
                Languages
              </div>
              <p className="font-sans text-sm text-text">{specialist.languages.join(' · ')}</p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 bg-accent text-white font-orbitron text-sm font-bold py-3.5 rounded-xl hover:opacity-95 transition-opacity shadow-lg shadow-accent/25"
              >
                <Activity size={18} aria-hidden />
                Request secure MediLink session
              </button>
              <Link
                to="/map"
                className="flex-1 flex items-center justify-center gap-2 border-2 border-accent text-accent font-orbitron text-sm font-bold py-3.5 rounded-xl hover:bg-accent/5 transition-colors text-center"
              >
                <MapPin size={18} aria-hidden />
                View on map
              </Link>
            </div>
            <p className="text-center font-sans text-xs text-text-muted mt-4">
              Demo UI — in production this would open a HIPAA-aware video bridge to this clinician&apos;s on-call queue.
            </p>
          </div>
        </motion.article>
      </div>
    </main>
  );
};

export default SpecialistProfilePage;
