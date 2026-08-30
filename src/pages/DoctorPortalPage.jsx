import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, User, Heart, Activity, AlertTriangle, ShieldCheck, 
  Clock, Plus, CheckCircle2, Pill, FileText, Send, X, Building, 
  Calendar, Droplet, Search, ChevronRight, Sparkles, Trash2, ArrowRight
} from 'lucide-react';
import { usePatient, DOCTOR_PRESETS } from '../context/PatientContext';

const DoctorPortalPage = () => {
  const { 
    activeDoctor, 
    isDoctorLoggedIn, 
    DOCTOR_PRESETS, 
    doctorLogin, 
    doctorLogout, 
    switchDoctor, 
    allPatients, 
    prescribeMedication, 
    discontinueMedication 
  } = usePatient();

  // Selected Patient in doctor's workspace
  const [selectedPatientId, setSelectedPatientId] = useState(allPatients[0]?.id || 'patient-001');
  const selectedPatient = allPatients.find(p => p.id === selectedPatientId) || allPatients[0];

  // Prescription Form State
  const [rxForm, setRxForm] = useState({
    medicineName: '',
    strength: '500mg',
    form: 'Tablet',
    frequency: 'Every 8 hours',
    timingSchedule: ['08:00 AM (Breakfast)', '02:00 PM (Lunch)', '08:00 PM (Dinner)'],
    foodInstructions: 'Take with full glass of water after food.',
    duration: '14 Days'
  });

  const [timingSlotInput, setTimingSlotInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllergyWarning, setShowAllergyWarning] = useState(false);
  const [conflictReason, setConflictReason] = useState('');
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  // Common Medication Quick-Fill Templates
  const RX_TEMPLATES = [
    {
      name: 'Amoxicillin Trihydrate',
      strength: '500mg',
      form: 'Capsule',
      frequency: 'Every 8 hours (3x/day)',
      timingSchedule: ['08:00 AM (Breakfast)', '02:00 PM (Lunch)', '08:00 PM (Dinner)'],
      foodInstructions: 'Take with food to prevent gastric irritation. Finish entire course.',
      duration: '7 Days'
    },
    {
      name: 'Paracetamol (Acetaminophen)',
      strength: '650mg',
      form: 'Tablet',
      frequency: 'Every 6 hours as needed',
      timingSchedule: ['08:00 AM (Morning)', '02:00 PM (Midday)', '08:00 PM (Night)'],
      foodInstructions: 'Take with water. Never exceed 4000mg in 24 hours.',
      duration: '5 Days'
    },
    {
      name: 'Ibuprofen',
      strength: '400mg',
      form: 'Tablet',
      frequency: 'Every 8 hours with meals',
      timingSchedule: ['08:00 AM (Breakfast)', '02:00 PM (Lunch)', '08:00 PM (Dinner)'],
      foodInstructions: 'MUST take with meal or milk. Do not take on empty stomach.',
      duration: '5 Days'
    },
    {
      name: 'Metformin Hydrochloride (ER)',
      strength: '500mg',
      form: 'Extended Release Tablet',
      frequency: 'Once daily with evening meal',
      timingSchedule: ['07:30 PM (Dinner)'],
      foodInstructions: 'Swallow whole with dinner. Do NOT crush or chew.',
      duration: '60 Days Refill'
    },
    {
      name: 'Azithromycin (Z-Pak)',
      strength: '250mg',
      form: 'Tablet',
      frequency: 'Once daily',
      timingSchedule: ['09:00 AM (Morning)'],
      foodInstructions: 'Take 1 hour before or 2 hours after meals with water.',
      duration: '5 Days'
    }
  ];

  // Filtered patient roster
  const filteredPatients = allPatients.filter(p => 
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.insuranceId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check Allergy Conflict before prescribing
  const checkPrescriptionAllergy = (medName) => {
    if (!selectedPatient) return null;
    const allergies = selectedPatient.emergencyPassport?.allergies || [];
    const name = medName.toLowerCase();

    if (allergies.some(a => a.toLowerCase().includes('penicillin')) && (name.includes('amoxicillin') || name.includes('penicillin') || name.includes('ampicillin'))) {
      return `CRITICAL CONTRAINDICATION: Patient ${selectedPatient.fullName} has a documented PENICILLIN ALLERGY. Prescribing ${medName} risks acute anaphylaxis.`;
    }

    if (allergies.some(a => a.toLowerCase().includes('sulfa')) && (name.includes('sulfa') || name.includes('bactrim') || name.includes('sulfamethoxazole'))) {
      return `CRITICAL CONTRAINDICATION: Patient ${selectedPatient.fullName} has a documented SULFA ALLERGY.`;
    }

    if (allergies.some(a => a.toLowerCase().includes('nsaid') || a.toLowerCase().includes('aspirin')) && (name.includes('ibuprofen') || name.includes('naproxen') || name.includes('aspirin'))) {
      return `CRITICAL CONTRAINDICATION: Patient ${selectedPatient.fullName} has a documented NSAID ALLERGY.`;
    }

    return null;
  };

  const handleApplyTemplate = (template) => {
    setRxForm({
      medicineName: template.name,
      strength: template.strength,
      form: template.form,
      frequency: template.frequency,
      timingSchedule: [...template.timingSchedule],
      foodInstructions: template.foodInstructions,
      duration: template.duration
    });

    const conflict = checkPrescriptionAllergy(template.name);
    if (conflict) {
      setConflictReason(conflict);
      setShowAllergyWarning(true);
    } else {
      setShowAllergyWarning(false);
    }
  };

  const handleAddTimingSlot = () => {
    if (!timingSlotInput.trim()) return;
    setRxForm(prev => ({
      ...prev,
      timingSchedule: [...prev.timingSchedule, timingSlotInput.trim()]
    }));
    setTimingSlotInput('');
  };

  const handleRemoveTimingSlot = (index) => {
    setRxForm(prev => ({
      ...prev,
      timingSchedule: prev.timingSchedule.filter((_, i) => i !== index)
    }));
  };

  const handleDispatchPrescription = async (e) => {
    e.preventDefault();
    if (!rxForm.medicineName.trim()) return;

    // Check allergy
    const conflict = checkPrescriptionAllergy(rxForm.medicineName);
    if (conflict) {
      setConflictReason(conflict);
      setShowAllergyWarning(true);
      return;
    }

    await prescribeMedication(selectedPatientId, rxForm);
    setDispatchedSuccess(true);
    setTimeout(() => setDispatchedSuccess(false), 4000);

    // Reset form to blank
    setRxForm({
      medicineName: '',
      strength: '500mg',
      form: 'Tablet',
      frequency: 'Every 8 hours',
      timingSchedule: ['08:00 AM (Breakfast)', '02:00 PM (Lunch)', '08:00 PM (Dinner)'],
      foodInstructions: 'Take with full glass of water after food.',
      duration: '14 Days'
    });
  };

  return (
    <div className="min-h-screen py-10 bg-surface text-text">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Top Doctor Identity Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-gray-900 to-black text-white rounded-3xl p-6 sm:p-8 border border-blue-500/30 shadow-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img 
                src={activeDoctor?.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80'} 
                alt={activeDoctor?.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-400 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-blue-600 text-white shadow-md">
                <Stethoscope size={14} />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-orbitron text-[10px] font-bold tracking-widest uppercase">
                  Verified Attending Physician
                </span>
                <span className="text-xs text-gray-400">License: {activeDoctor?.licenseId}</span>
              </div>
              <h1 className="font-orbitron text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {activeDoctor?.fullName}
              </h1>
              <p className="text-gray-300 font-sans text-xs sm:text-sm mt-0.5 flex items-center gap-2">
                <span>{activeDoctor?.specialty}</span>
                <span>•</span>
                <span className="text-blue-400 font-medium">{activeDoctor?.hospital}</span>
              </p>
            </div>
          </div>

          {/* Quick Doctor Persona Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10">
            <span className="text-[10px] font-orbitron text-gray-300 uppercase px-2">Switch Physician:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
              {DOCTOR_PRESETS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => switchDoctor(doc.id)}
                  className={`px-3 py-1.5 rounded-xl font-sans text-xs font-semibold whitespace-nowrap transition-all ${
                    activeDoctor?.id === doc.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {doc.fullName.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Clinical Grid: Patient Roster (4 Cols) + Clinical Chart & Prescription Composer (8 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Patient Roster List (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-900 rounded-3xl p-5 border border-border shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-orbitron font-bold text-sm uppercase tracking-wider text-text flex items-center gap-2">
                <User size={16} className="text-accent" /> Hospital Patient Roster
              </h3>
              <span className="text-xs font-orbitron font-bold text-accent px-2 py-0.5 bg-accent/10 rounded-full">
                {allPatients.length} Active
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient by name or ID..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-accent"
              />
            </div>

            {/* Patients List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredPatients.map((patient) => {
                const isSelected = patient.id === selectedPatientId;
                const hasPenicillin = patient.emergencyPassport?.allergies?.some(a => a.toLowerCase().includes('penicillin'));

                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-500/10 border-blue-500 shadow-md scale-[1.01]' 
                        : 'bg-surface border-border hover:border-blue-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={patient.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} 
                          alt={patient.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-border"
                        />
                        <div>
                          <h4 className="font-orbitron font-bold text-xs text-text">{patient.fullName}</h4>
                          <span className="text-[11px] text-text-muted font-sans">
                            {patient.age}y • Blood <strong className="text-accent">{patient.bloodType}</strong> • {patient.gender}
                          </span>
                        </div>
                      </div>
                      <span className="font-orbitron font-bold text-[10px] text-emerald-500">
                        {patient.biometrics?.heartRate || 74} BPM
                      </span>
                    </div>

                    {/* Allergies chip list */}
                    {patient.emergencyPassport?.allergies?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {patient.emergencyPassport.allergies.map(a => (
                          <span key={a} className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded text-[10px] font-semibold">
                            ⚠️ {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Clinical Chart & Prescription Timing Composer (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Selected Patient Medical Summary Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-border shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center font-orbitron font-black text-accent text-xl">
                    {selectedPatient?.bloodType}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-text">
                        {selectedPatient?.fullName}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-orbitron font-bold">
                        ACTIVE RECORD
                      </span>
                    </div>
                    <p className="text-xs text-text-muted font-sans mt-0.5">
                      ID: <strong>{selectedPatient?.insuranceId}</strong> • Age: {selectedPatient?.age} • Weight: {selectedPatient?.weightKg}kg • Height: {selectedPatient?.heightCm}cm
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-orbitron text-text-muted uppercase block">Health Score</span>
                  <span className="font-orbitron font-extrabold text-2xl text-emerald-500">
                    {selectedPatient?.biometrics?.score || 85}%
                  </span>
                </div>
              </div>

              {/* Vitals & Allergy Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
                <div className="p-3 bg-surface rounded-xl border border-border">
                  <span className="text-[10px] font-orbitron text-text-muted uppercase block">Heart Rate</span>
                  <strong className="text-accent text-base font-orbitron">{selectedPatient?.biometrics?.heartRate || 74} BPM</strong>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border">
                  <span className="text-[10px] font-orbitron text-text-muted uppercase block">Oxygen SpO2</span>
                  <strong className="text-emerald-500 text-base font-orbitron">{selectedPatient?.biometrics?.oxygen || 98}%</strong>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border">
                  <span className="text-[10px] font-orbitron text-text-muted uppercase block">Blood Pressure</span>
                  <strong className="text-text text-sm font-orbitron">{selectedPatient?.biometrics?.bloodPressure || '120/80'}</strong>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border">
                  <span className="text-[10px] font-orbitron text-text-muted uppercase block">Blood Glucose</span>
                  <strong className="text-text text-sm font-orbitron">{selectedPatient?.biometrics?.glucoseMgDl || 95} mg/dL</strong>
                </div>
              </div>

              {/* Patient Allergies Notice */}
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-sans text-red-700 dark:text-red-300 flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-orbitron uppercase text-[11px] block">Patient Documented Allergies:</strong>
                  <span>{selectedPatient?.emergencyPassport?.allergies?.join(', ') || 'No known drug allergies on file.'}</span>
                </div>
              </div>
            </div>

            {/* PRESCRIPTION & DOSAGE TIMING COMPOSER */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-border shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
                <div>
                  <span className="text-[10px] font-orbitron text-blue-500 uppercase tracking-widest font-bold block">
                    Clinical Rx Dispatch Engine
                  </span>
                  <h3 className="font-orbitron text-lg sm:text-xl font-bold text-text flex items-center gap-2 mt-0.5">
                    <Pill size={18} className="text-blue-500" /> Prescribe Medication & Schedule Timings
                  </h3>
                </div>

                {dispatchedSuccess && (
                  <span className="text-xs font-orbitron font-bold text-emerald-500 flex items-center gap-1.5 animate-bounce">
                    <CheckCircle2 size={16} /> Prescription Dispatched & Patient Notified!
                  </span>
                )}
              </div>

              {/* Quick Template Selector */}
              <div>
                <span className="text-[11px] font-orbitron text-text-muted uppercase tracking-wider block mb-2">
                  ⚡ Doctor Quick-Fill Templates:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {RX_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.name}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="px-3 py-1.5 rounded-xl bg-surface hover:bg-blue-500/10 hover:border-blue-400 border border-border text-xs font-sans font-medium text-text whitespace-nowrap transition-colors flex items-center gap-1.5"
                    >
                      <Plus size={12} className="text-blue-500" /> {tmpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergy Warning Alert Modal/Banner if Contraindicated */}
              {showAllergyWarning && (
                <div className="p-4 rounded-2xl bg-red-600 text-white shadow-xl animate-shake space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                      <AlertTriangle size={16} /> CRITICAL CONTRAINDICATION INTERCEPTED
                    </span>
                    <button onClick={() => setShowAllergyWarning(false)} className="text-white hover:opacity-75">
                      <X size={16} />
                    </button>
                  </div>
                  <p className="font-sans text-xs leading-relaxed">{conflictReason}</p>
                </div>
              )}

              {/* Prescription Form */}
              <form onSubmit={handleDispatchPrescription} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-orbitron uppercase text-text-muted mb-1">
                      Medication / Generic Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rxForm.medicineName}
                      onChange={(e) => {
                        setRxForm(prev => ({ ...prev, medicineName: e.target.value }));
                        const conflict = checkPrescriptionAllergy(e.target.value);
                        if (conflict) {
                          setConflictReason(conflict);
                          setShowAllergyWarning(true);
                        } else {
                          setShowAllergyWarning(false);
                        }
                      }}
                      placeholder="e.g. Amoxicillin Trihydrate or Paracetamol"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron uppercase text-text-muted mb-1">
                      Dosage Strength *
                    </label>
                    <input
                      type="text"
                      required
                      value={rxForm.strength}
                      onChange={(e) => setRxForm(prev => ({ ...prev, strength: e.target.value }))}
                      placeholder="e.g. 500mg, 650mg, 10ml"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron uppercase text-text-muted mb-1">Form</label>
                    <select
                      value={rxForm.form}
                      onChange={(e) => setRxForm(prev => ({ ...prev, form: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-xs text-text font-sans"
                    >
                      <option>Tablet</option>
                      <option>Capsule</option>
                      <option>Extended Release Tablet</option>
                      <option>Oral Syrup</option>
                      <option>Inhaler</option>
                      <option>Injection</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron uppercase text-text-muted mb-1">Frequency</label>
                    <select
                      value={rxForm.frequency}
                      onChange={(e) => setRxForm(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-xs text-text font-sans"
                    >
                      <option>Once daily (every 24 hrs)</option>
                      <option>Twice daily (every 12 hrs)</option>
                      <option>Every 8 hours (3x/day)</option>
                      <option>Every 6 hours as needed</option>
                      <option>Every 4 hours as needed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron uppercase text-text-muted mb-1">Course Duration</label>
                    <input
                      type="text"
                      value={rxForm.duration}
                      onChange={(e) => setRxForm(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g. 7 Days, 30 Days"
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-xs text-text font-sans"
                    />
                  </div>
                </div>

                {/* EXACT DAILY TIMING SLOTS BUILDER (USER REQUEST) */}
                <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-orbitron uppercase text-blue-500 font-bold tracking-wider flex items-center gap-1.5">
                      <Clock size={14} /> Scheduled Daily Timing Slots (Sent to Patient's 24h Timetable)
                    </label>
                    <span className="text-[11px] text-text-muted">{rxForm.timingSchedule.length} Times / Day</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={timingSlotInput}
                      onChange={(e) => setTimingSlotInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTimingSlot(); }}}
                      placeholder="e.g. 08:00 AM (Breakfast) or 09:00 PM (Bedtime)"
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-border text-xs text-text"
                    />
                    <button
                      type="button"
                      onClick={handleAddTimingSlot}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-orbitron font-bold hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Time
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {rxForm.timingSchedule.map((slot, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-sans font-semibold flex items-center gap-2">
                        <Clock size={12} />
                        {slot}
                        <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveTimingSlot(idx)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Food Instructions & Directives */}
                <div>
                  <label className="block text-xs font-orbitron uppercase text-text-muted mb-1">
                    Food & Administration Directives
                  </label>
                  <input
                    type="text"
                    value={rxForm.foodInstructions}
                    onChange={(e) => setRxForm(prev => ({ ...prev, foodInstructions: e.target.value }))}
                    placeholder="e.g. Take strictly after breakfast. Drink 3L of water daily."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-text font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-orbitron font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Send size={16} /> Dispatch Prescription & Update {selectedPatient?.fullName.split(' ')[0]}'s Health Twin
                </button>
              </form>
            </div>

            {/* Active Prescriptions Table for this Patient */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-border shadow-xl space-y-4">
              <h3 className="font-orbitron font-bold text-sm uppercase tracking-wider text-text flex items-center gap-2">
                <FileText size={16} className="text-accent" /> Active Prescribed Regimens for {selectedPatient?.fullName}
              </h3>

              {selectedPatient?.emergencyPassport?.prescriptions?.length > 0 ? (
                <div className="space-y-3">
                  {selectedPatient.emergencyPassport.prescriptions.map((rx) => (
                    <div 
                      key={rx.id}
                      className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-400/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-orbitron font-bold text-sm text-text">{rx.medicineName}</h4>
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                            {rx.strength} • {rx.form}
                          </span>
                        </div>
                        <p className="text-xs font-sans text-text-muted mt-1">
                          <strong>Frequency:</strong> {rx.frequency} | <strong>Instructions:</strong> {rx.foodInstructions}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {rx.timingSchedule?.map((time, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-gray-800 border border-border text-[11px] text-text font-mono">
                              ⏰ {time}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-text-muted font-sans mt-1 block">
                          Prescribed by: {rx.prescribedBy} on {rx.prescribedDate} ({rx.duration})
                        </span>
                      </div>

                      <button
                        onClick={() => discontinueMedication(selectedPatient.id, rx.id)}
                        className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-red-500/30 text-red-600 hover:bg-red-500/10 text-xs font-orbitron font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 size={12} /> Discontinue
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-text-muted bg-surface rounded-2xl border border-dashed border-border">
                  No active electronic prescriptions on record for {selectedPatient?.fullName}. Use the form above to prescribe medication.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DoctorPortalPage;
