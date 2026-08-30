import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Activity, User, LogIn, LogOut, ChevronDown, ShieldCheck, Heart, Sparkles, 
  Stethoscope, Menu, X, Pill, MapPin, Radio, LayoutDashboard, AlertCircle 
} from 'lucide-react';
import { usePatient, REAL_PATIENT_PRESETS, DOCTOR_PRESETS } from '../context/PatientContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { activePatient, activeDoctor, switchPatient, logout } = usePatient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navItems = [
    { name: 'Home', path: '/', icon: Activity },
    { name: 'Emergency AI', path: '/emergency', icon: AlertCircle },
    { name: 'Health Twin', path: '/health-twin', icon: Heart },
    { name: 'Live Map', path: '/map', icon: MapPin },
    { name: 'Drone Support', path: '/drones', icon: Radio },
    { name: 'Medicine Scanner', path: '/scanner', icon: Pill },
    { name: 'Doctor Portal', path: '/doctor-portal', icon: Stethoscope },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && !e.target.closest('#mobile-menu-btn')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-[9000] glass border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="text-accent animate-heartbeat" size={20} />
          </div>
          <span className="font-orbitron font-bold text-xl text-text tracking-wide">
            Medi<span className="text-accent">Link</span> AI
          </span>
        </Link>
        
        {/* Desktop & Laptop Navigation Links (visible on lg screens and up) */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `font-orbitron text-xs font-semibold tracking-wider transition-colors uppercase whitespace-nowrap ${
                  isActive ? 'text-accent border-b-2 border-accent pb-1' : 'text-text-muted hover:text-text'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Right Section: Mobile Hamburger Toggle + Patient Profile Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Doctor Portal Quick Pill on large screens */}
          <NavLink
            to="/doctor-portal"
            className={({ isActive }) => 
              `hidden md:flex px-3 py-2 rounded-xl text-xs font-orbitron font-bold items-center gap-1.5 transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white'
              }`
            }
          >
            <Stethoscope size={14} />
            <span>Doctor Portal</span>
          </NavLink>

          {/* Patient Profile Dropdown */}
          {activePatient && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-white dark:bg-gray-800 border border-border hover:border-accent shadow-sm transition-all group"
              >
                <img
                  src={activePatient.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  alt={activePatient.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-accent"
                />
                <div className="text-left hidden sm:block">
                  <span className="font-orbitron font-bold text-xs text-text block leading-tight">
                    {activePatient.fullName.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-orbitron font-bold text-accent">
                    Blood {activePatient.bloodType}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Patient Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-gray-900 border border-border shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* Current Active Patient Info */}
                  <div className="p-3 rounded-xl bg-surface border border-border/60 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center font-orbitron font-extrabold text-accent text-sm">
                        {activePatient.fullName.charAt(0)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <span className="font-orbitron font-bold text-xs text-text truncate block">{activePatient.fullName}</span>
                        <span className="text-[11px] text-text-muted truncate block">{activePatient.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-orbitron text-text-muted mt-2 pt-2 border-t border-border/40">
                      <span>Age: <strong>{activePatient.age}y</strong></span>
                      <span>Blood: <strong className="text-accent">{activePatient.bloodType}</strong></span>
                      <span className="text-emerald-500 font-bold">Health: {activePatient.biometrics?.score || 85}%</span>
                    </div>
                  </div>

                  {/* Switch Patient Quick List */}
                  <div className="mb-2">
                    <span className="text-[10px] font-orbitron uppercase text-text-muted tracking-wider block px-2 py-1">
                      Switch Real Patient Profile:
                    </span>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {REAL_PATIENT_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            switchPatient(p.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-sans flex items-center justify-between transition-colors ${
                            activePatient.id === p.id 
                              ? 'bg-accent/10 text-accent font-bold' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-text'
                          }`}
                        >
                          <span className="truncate">{p.fullName}</span>
                          <span className="font-orbitron text-[10px] opacity-75">{p.bloodType}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Links inside Dropdown for Fast Access */}
                  <div className="border-t border-border pt-1.5 space-y-1">
                    <Link
                      to="/scanner"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-orbitron text-accent hover:bg-accent/10 flex items-center gap-2 transition-colors font-bold"
                    >
                      <Pill size={14} /> AI Medicine Scanner
                    </Link>

                    <Link
                      to="/doctor-portal"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-orbitron text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 flex items-center gap-2 transition-colors font-bold"
                    >
                      <Stethoscope size={14} /> Doctor Clinical Portal
                    </Link>

                    <Link
                      to="/health-twin"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-orbitron text-text hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                    >
                      <Heart size={14} className="text-accent" /> Digital Health Twin
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-orbitron text-text hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                    >
                      <User size={14} className="text-accent" /> Emergency Passport
                    </Link>

                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-orbitron text-text hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                    >
                      <Sparkles size={14} className="text-accent" /> Register Custom Patient
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-orbitron text-red-600 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile / Tablet Menu Button (Hamburger) */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-surface border border-border text-text hover:border-accent transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile / Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden border-b border-border bg-white dark:bg-gray-900 px-4 py-4 shadow-2xl animate-in slide-in-from-top-4 duration-200 space-y-1"
        >
          <span className="text-[10px] font-orbitron text-text-muted uppercase tracking-wider block px-3 py-1">
            Navigate MediLink Sections:
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `px-3 py-2.5 rounded-xl font-orbitron text-xs font-semibold flex items-center gap-3 transition-colors ${
                    isActive 
                      ? 'bg-accent text-white shadow-sm' 
                      : 'text-text hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
