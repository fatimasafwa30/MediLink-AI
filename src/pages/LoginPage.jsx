import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Lock, Mail, User, Heart, Activity, AlertTriangle, 
  Sparkles, CheckCircle2, ChevronRight, ArrowRight, Phone, FileText, 
  Scale, Droplet, Plus, X, Zap
} from 'lucide-react';
import { usePatient, REAL_PATIENT_PRESETS } from '../context/PatientContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, registerPatient, switchPatient, activePatient } = usePatient();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '28',
    gender: 'Male',
    bloodType: 'B+',
    weightKg: '72',
    heightCm: '178',
    insuranceId: 'ML-' + Math.floor(1000000 + Math.random() * 9000000),
    isOrganDonor: true,
    allergies: ['Penicillin'],
    conditions: ['Asthma (Mild)'],
    medications: ['Albuterol Inhaler'],
    contactName: 'Sarah Connor',
    contactPhone: '+1 (555) 019-8234',
    contactRelation: 'Sister',
    doctorName: 'Dr. Aris Thorne',
    doctorSpecialty: 'General Practice & Pulmonology',
    doctorPhone: '+1 (555) 441-2099'
  });

  // Tag input states
  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');

  const handleAddAllergy = () => {
    if (!allergyInput.trim()) return;
    if (!regForm.allergies.includes(allergyInput.trim())) {
      setRegForm(prev => ({ ...prev, allergies: [...prev.allergies, allergyInput.trim()] }));
    }
    setAllergyInput('');
  };

  const handleRemoveAllergy = (tag) => {
    setRegForm(prev => ({ ...prev, allergies: prev.allergies.filter(a => a !== tag) }));
  };

  const handleAddCondition = () => {
    if (!conditionInput.trim()) return;
    if (!regForm.conditions.includes(conditionInput.trim())) {
      setRegForm(prev => ({ ...prev, conditions: [...prev.conditions, conditionInput.trim()] }));
    }
    setConditionInput('');
  };

  const handleRemoveCondition = (tag) => {
    setRegForm(prev => ({ ...prev, conditions: prev.conditions.filter(c => c !== tag) }));
  };

  const handleAddMedication = () => {
    if (!medicationInput.trim()) return;
    if (!regForm.medications.includes(medicationInput.trim())) {
      setRegForm(prev => ({ ...prev, medications: [...prev.medications, medicationInput.trim()] }));
    }
    setMedicationInput('');
  };

  const handleRemoveMedication = (tag) => {
    setRegForm(prev => ({ ...prev, medications: prev.medications.filter(m => m !== tag) }));
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    try {
      const res = await login(loginEmail || 'john.doe@medilink.ai', loginPassword || 'password123');
      if (res.success) {
        setSuccessMessage(`Welcome back, ${res.patient.fullName}! Initializing Health Twin...`);
        setTimeout(() => navigate('/health-twin'), 900);
      }
    } catch (err) {
      setErrorMessage('Login failed. Please check credentials or select a test patient.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.fullName.trim() || !regForm.email.trim()) {
      setErrorMessage('Please provide your full name and a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await registerPatient(regForm);
      if (res.success) {
        setSuccessMessage(`Patient profile for ${res.patient.fullName} registered successfully!`);
        setTimeout(() => navigate('/health-twin'), 1000);
      }
    } catch (err) {
      setErrorMessage('Registration failed. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Quick Demo Persona Select
  const handleQuickSelect = (preset) => {
    switchPatient(preset.id);
    setSuccessMessage(`Switched active patient to ${preset.fullName}!`);
    setTimeout(() => navigate('/health-twin'), 700);
  };

  return (
    <div className="min-h-screen py-12 bg-surface text-text relative overflow-hidden">
      {/* Subtle futuristic background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#dc2626_1px,transparent_1px),linear-gradient(to_bottom,#dc2626_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-orbitron text-xs tracking-widest uppercase mb-3">
            <ShieldCheck size={14} className="text-accent" />
            2035 Biometric Patient Authentication & Identity Hub
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-extrabold text-text">
            MediLink <span className="text-accent">Patient Portal</span>
          </h1>
          <p className="text-text-muted font-sans mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Secure biometric authentication and Emergency Passport synchronization for real patients.
          </p>
        </div>

        {/* Quick Test Patients Bar */}
        <div className="max-w-4xl mx-auto mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-orbitron text-xs text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={14} className="text-accent animate-bounce" /> 1-Click Test Patient Profiles:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {REAL_PATIENT_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleQuickSelect(p)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-sans font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                    activePatient?.id === p.id 
                      ? 'bg-accent text-white border-accent shadow-md scale-105' 
                      : 'bg-gray-100 dark:bg-gray-800 text-text border-border hover:border-accent/50'
                  }`}
                >
                  <img src={p.avatarUrl} alt={p.fullName} className="w-5 h-5 rounded-full object-cover" />
                  <span>{p.fullName}</span>
                  <span className="text-[10px] opacity-75 font-orbitron">({p.bloodType})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid: Form Container + Holographic ID Card Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Tabs (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-border shadow-2xl relative">
            
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
              <button
                onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                className={`flex-1 py-2.5 rounded-xl font-orbitron text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  authMode === 'login' 
                    ? 'bg-accent text-white shadow-md' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <Lock size={14} /> Sign In
              </button>

              <button
                onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
                className={`flex-1 py-2.5 rounded-xl font-orbitron text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  authMode === 'register' 
                    ? 'bg-accent text-white shadow-md' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <User size={14} /> Register Real Patient
              </button>
            </div>

            {/* Alert Messages */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-sans flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-sans flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* TAB 1: LOGIN */}
            {authMode === 'login' && (
              <motion.form 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                onSubmit={handleLoginSubmit} 
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-orbitron uppercase text-text-muted tracking-wider mb-2 flex items-center gap-1.5">
                    <Mail size={14} className="text-accent" /> Patient Email Address
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. john.doe@medilink.ai"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text font-sans text-sm focus:outline-none focus:border-accent"
                  />
                  <span className="text-[11px] text-text-muted mt-1 block">
                    Tip: Enter any email or use the 1-click test patient profiles above.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-orbitron uppercase text-text-muted tracking-wider mb-2 flex items-center gap-1.5">
                    <Lock size={14} className="text-accent" /> Security Key / Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text font-sans text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-sans text-text-muted">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-accent rounded" />
                    <span>Keep biometric session active</span>
                  </label>
                  <a href="#reset" onClick={(e) => { e.preventDefault(); alert("Recovery link dispatched to registered biometric device."); }} className="text-accent hover:underline">
                    Forgot key?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-accent text-white font-orbitron font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/30 hover:bg-accent-deep hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {loading ? 'Authenticating Biometrics...' : (
                    <>Sign In & Open Health Twin <ArrowRight size={16} /></>
                  )}
                </button>
              </motion.form>
            )}

            {/* TAB 2: REGISTER REAL PATIENT */}
            {authMode === 'register' && (
              <motion.form 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                onSubmit={handleRegisterSubmit} 
                className="space-y-6"
              >
                {/* 1. Basic Demographics */}
                <div className="space-y-4">
                  <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <User size={14} /> 1. Personal & Biometric Identity
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-orbitron uppercase text-text-muted mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={regForm.fullName}
                        onChange={(e) => setRegForm(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="e.g. Sarah Connor"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-text font-sans text-sm focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-orbitron uppercase text-text-muted mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={regForm.email}
                        onChange={(e) => setRegForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. sarah@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-text font-sans text-sm focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-orbitron uppercase text-text-muted mb-1">Age</label>
                        <input
                          type="number"
                          value={regForm.age}
                          onChange={(e) => setRegForm(prev => ({ ...prev, age: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text font-sans text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-orbitron uppercase text-text-muted mb-1">Gender</label>
                        <select
                          value={regForm.gender}
                          onChange={(e) => setRegForm(prev => ({ ...prev, gender: e.target.value }))}
                          className="w-full px-2 py-2.5 rounded-xl bg-surface border border-border text-text font-sans text-xs"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Non-Binary</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-orbitron uppercase text-text-muted mb-1">Blood</label>
                        <select
                          value={regForm.bloodType}
                          onChange={(e) => setRegForm(prev => ({ ...prev, bloodType: e.target.value }))}
                          className="w-full px-2 py-2.5 rounded-xl bg-surface border border-border text-text font-sans text-xs font-bold text-accent"
                        >
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                          <option>O+</option>
                          <option>O-</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-orbitron uppercase text-text-muted mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          value={regForm.weightKg}
                          onChange={(e) => setRegForm(prev => ({ ...prev, weightKg: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text font-sans text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-orbitron uppercase text-text-muted mb-1">Height (cm)</label>
                        <input
                          type="number"
                          value={regForm.heightCm}
                          onChange={(e) => setRegForm(prev => ({ ...prev, heightCm: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text font-sans text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Emergency Passport: Allergies & Conditions */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <AlertTriangle size={14} /> 2. Emergency Passport (Allergies & Drugs)
                  </h4>

                  {/* Allergies Input */}
                  <div>
                    <label className="block text-[11px] font-orbitron uppercase text-text-muted mb-1.5">
                      Known Allergies (e.g. Penicillin, Sulfa, Shellfish, Peanuts)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={allergyInput}
                        onChange={(e) => setAllergyInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAllergy(); }}}
                        placeholder="Add allergy and press enter..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-surface border border-border text-text text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddAllergy}
                        className="px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-xl text-xs font-orbitron font-bold hover:bg-accent hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {regForm.allergies.map(item => (
                        <span key={item} className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-sans flex items-center gap-1.5">
                          {item}
                          <X size={12} className="cursor-pointer hover:text-red-700" onClick={() => handleRemoveAllergy(item)} />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pre-existing Conditions Input */}
                  <div>
                    <label className="block text-[11px] font-orbitron uppercase text-text-muted mb-1.5">
                      Pre-existing Conditions (e.g. Asthma, Diabetes, Hypertension)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={conditionInput}
                        onChange={(e) => setConditionInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCondition(); }}}
                        placeholder="Add medical condition..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-surface border border-border text-text text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddCondition}
                        className="px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-xl text-xs font-orbitron font-bold hover:bg-accent hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {regForm.conditions.map(item => (
                        <span key={item} className="px-2.5 py-1 bg-surface border border-accent/30 text-text rounded-lg text-xs font-sans flex items-center gap-1.5">
                          {item}
                          <X size={12} className="cursor-pointer hover:text-accent" onClick={() => handleRemoveCondition(item)} />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Current Medications Input */}
                  <div>
                    <label className="block text-[11px] font-orbitron uppercase text-text-muted mb-1.5">
                      Active Medications & Inhalers
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={medicationInput}
                        onChange={(e) => setMedicationInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMedication(); }}}
                        placeholder="Add current medication..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-surface border border-border text-text text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddMedication}
                        className="px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-xl text-xs font-orbitron font-bold hover:bg-accent hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {regForm.medications.map(item => (
                        <span key={item} className="px-2.5 py-1 bg-surface border border-border text-text-muted rounded-lg text-xs font-sans flex items-center gap-1.5">
                          {item}
                          <X size={12} className="cursor-pointer hover:text-accent" onClick={() => handleRemoveMedication(item)} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Emergency Contacts & Primary Doctor */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <Phone size={14} /> 3. Emergency Contact & Primary Doctor
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-orbitron uppercase text-text-muted mb-1">Contact Name</label>
                      <input
                        type="text"
                        value={regForm.contactName}
                        onChange={(e) => setRegForm(prev => ({ ...prev, contactName: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-orbitron uppercase text-text-muted mb-1">Phone</label>
                      <input
                        type="text"
                        value={regForm.contactPhone}
                        onChange={(e) => setRegForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-orbitron uppercase text-text-muted mb-1">Relation</label>
                      <input
                        type="text"
                        value={regForm.contactRelation}
                        onChange={(e) => setRegForm(prev => ({ ...prev, contactRelation: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-orbitron uppercase text-text-muted mb-1">Primary Doctor Name</label>
                      <input
                        type="text"
                        value={regForm.doctorName}
                        onChange={(e) => setRegForm(prev => ({ ...prev, doctorName: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-orbitron uppercase text-text-muted mb-1">Doctor Phone</label>
                      <input
                        type="text"
                        value={regForm.doctorPhone}
                        onChange={(e) => setRegForm(prev => ({ ...prev, doctorPhone: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-sans">
                      <input
                        type="checkbox"
                        checked={regForm.isOrganDonor}
                        onChange={(e) => setRegForm(prev => ({ ...prev, isOrganDonor: e.target.checked }))}
                        className="accent-accent"
                      />
                      <span>Registered Organ Donor</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-accent text-white font-orbitron font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/30 hover:bg-accent-deep hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating Medical Identity...' : (
                    <>Complete Real Patient Registration <CheckCircle2 size={16} /></>
                  )}
                </button>
              </motion.form>
            )}

          </div>

          {/* Right Column: Live Holographic Medical Passport ID Preview (5 Cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="text-center sm:text-left">
              <span className="font-orbitron text-xs text-accent uppercase tracking-wider font-bold">
                Real-Time Medical Identity Card Preview
              </span>
            </div>

            {/* Holographic Passport Card */}
            <div className="glass w-full rounded-3xl p-6 relative overflow-hidden border-2 border-accent/30 shadow-2xl hover:border-accent transition-all duration-300">
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-white/5 to-transparent pointer-events-none"></div>

              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-border pb-4 mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-surface border border-accent/40 flex items-center justify-center font-orbitron font-extrabold text-accent text-xl shadow-inner">
                    {(authMode === 'register' ? regForm.fullName : (activePatient?.fullName || 'Johnathan Doe')).charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-orbitron font-bold text-base text-text">
                      {authMode === 'register' ? (regForm.fullName || 'Patient Name') : activePatient?.fullName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted font-sans">
                      <span>{authMode === 'register' ? regForm.age : activePatient?.age} YRS</span>
                      <span>•</span>
                      <span>{authMode === 'register' ? regForm.gender : activePatient?.gender}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-orbitron text-accent tracking-widest block font-bold">BLOOD GROUP</span>
                  <span className="font-orbitron font-black text-3xl text-accent">
                    {authMode === 'register' ? regForm.bloodType : activePatient?.bloodType}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-4 text-xs font-sans relative z-10">
                
                {/* Allergies Highlight */}
                <div>
                  <span className="font-orbitron text-[10px] text-accent uppercase tracking-wider block mb-1 font-bold">
                    Allergies & Contraindications
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(authMode === 'register' ? regForm.allergies : activePatient?.emergencyPassport?.allergies)?.map(item => (
                      <span key={item} className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded text-[11px] font-semibold">
                        {item}
                      </span>
                    )) || <span className="text-text-muted">None listed</span>}
                  </div>
                </div>

                {/* Conditions */}
                <div>
                  <span className="font-orbitron text-[10px] text-text-muted uppercase tracking-wider block mb-1 font-semibold">
                    Medical Conditions
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(authMode === 'register' ? regForm.conditions : activePatient?.emergencyPassport?.conditions)?.map(item => (
                      <span key={item} className="px-2 py-0.5 bg-surface border border-border text-text rounded text-[11px]">
                        {item}
                      </span>
                    )) || <span className="text-text-muted">None listed</span>}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-border">
                  <span className="font-orbitron text-[10px] text-text-muted uppercase tracking-wider block mb-1">
                    Primary Emergency Contact
                  </span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text">
                      {authMode === 'register' ? regForm.contactName : activePatient?.emergencyPassport?.emergencyContacts?.[0]?.name}
                    </span>
                    <span className="text-accent font-orbitron font-semibold text-[11px]">
                      {authMode === 'register' ? regForm.contactPhone : activePatient?.emergencyPassport?.emergencyContacts?.[0]?.phone}
                    </span>
                  </div>
                </div>

                {/* Insurance ID & Donor Badge */}
                <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border">
                  <span>ID: <strong className="text-text">{authMode === 'register' ? regForm.insuranceId : activePatient?.insuranceId}</strong></span>
                  <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-accent font-bold rounded-full flex items-center gap-1">
                    <Heart size={10} /> Organ Donor
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
