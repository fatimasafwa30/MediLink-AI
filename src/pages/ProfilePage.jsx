import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, ShieldCheck, Heart, Activity, AlertTriangle, Phone, 
  FileText, Droplet, Plus, X, Check, Save, Download, Edit3, Sparkles
} from 'lucide-react';
import { usePatient, REAL_PATIENT_PRESETS } from '../context/PatientContext';

const ProfilePage = () => {
  const { activePatient, updatePatientProfile, switchPatient } = usePatient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: activePatient.fullName || '',
    age: activePatient.age || 28,
    gender: activePatient.gender || 'Male',
    bloodType: activePatient.bloodType || 'B+',
    weightKg: activePatient.weightKg || 74,
    heightCm: activePatient.heightCm || 182,
    insuranceId: activePatient.insuranceId || 'ML-8492001-B',
    isOrganDonor: activePatient.isOrganDonor ?? true,
    allergies: activePatient.emergencyPassport?.allergies || [],
    conditions: activePatient.emergencyPassport?.conditions || [],
    medications: activePatient.emergencyPassport?.medications || [],
    emergencyContacts: activePatient.emergencyPassport?.emergencyContacts || [
      { name: 'Sarah Connor', phone: '+1 (555) 019-8234', relation: 'Sister' }
    ]
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if activePatient changes
  React.useEffect(() => {
    setFormData({
      fullName: activePatient.fullName || '',
      age: activePatient.age || 28,
      gender: activePatient.gender || 'Male',
      bloodType: activePatient.bloodType || 'B+',
      weightKg: activePatient.weightKg || 74,
      heightCm: activePatient.heightCm || 182,
      insuranceId: activePatient.insuranceId || 'ML-8492001-B',
      isOrganDonor: activePatient.isOrganDonor ?? true,
      allergies: activePatient.emergencyPassport?.allergies || [],
      conditions: activePatient.emergencyPassport?.conditions || [],
      medications: activePatient.emergencyPassport?.medications || [],
      emergencyContacts: activePatient.emergencyPassport?.emergencyContacts || []
    });
  }, [activePatient]);

  const handleAddAllergy = () => {
    if (!allergyInput.trim()) return;
    if (!formData.allergies.includes(allergyInput.trim())) {
      setFormData(prev => ({ ...prev, allergies: [...prev.allergies, allergyInput.trim()] }));
    }
    setAllergyInput('');
  };

  const handleRemoveAllergy = (tag) => {
    setFormData(prev => ({ ...prev, allergies: prev.allergies.filter(a => a !== tag) }));
  };

  const handleAddCondition = () => {
    if (!conditionInput.trim()) return;
    if (!formData.conditions.includes(conditionInput.trim())) {
      setFormData(prev => ({ ...prev, conditions: [...prev.conditions, conditionInput.trim()] }));
    }
    setConditionInput('');
  };

  const handleRemoveCondition = (tag) => {
    setFormData(prev => ({ ...prev, conditions: prev.conditions.filter(c => c !== tag) }));
  };

  const handleAddMedication = () => {
    if (!medicationInput.trim()) return;
    if (!formData.medications.includes(medicationInput.trim())) {
      setFormData(prev => ({ ...prev, medications: [...prev.medications, medicationInput.trim()] }));
    }
    setMedicationInput('');
  };

  const handleRemoveMedication = (tag) => {
    setFormData(prev => ({ ...prev, medications: prev.medications.filter(m => m !== tag) }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePatientProfile({
      fullName: formData.fullName,
      age: Number(formData.age),
      gender: formData.gender,
      bloodType: formData.bloodType,
      weightKg: Number(formData.weightKg),
      heightCm: Number(formData.heightCm),
      insuranceId: formData.insuranceId,
      isOrganDonor: formData.isOrganDonor,
      emergencyPassport: {
        ...activePatient.emergencyPassport,
        allergies: formData.allergies,
        conditions: formData.conditions,
        medications: formData.medications,
        emergencyContacts: formData.emergencyContacts
      }
    });

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen py-16 bg-surface text-text">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-orbitron text-xs tracking-wider uppercase mb-2">
              <ShieldCheck size={14} /> Medical Record & Identity
            </div>
            <h1 className="font-orbitron text-3xl sm:text-4xl font-extrabold text-text">
              Patient Profile <span className="text-accent">Manager</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-orbitron text-emerald-500 font-bold flex items-center gap-1">
                <Check size={14} /> Profile Saved!
              </span>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2.5 rounded-xl font-orbitron text-xs font-bold flex items-center gap-2 transition-all ${
                isEditing 
                  ? 'bg-gray-200 dark:bg-gray-800 text-text' 
                  : 'bg-accent text-white hover:bg-accent-deep shadow-md'
              }`}
            >
              {isEditing ? <><X size={14} /> Cancel Editing</> : <><Edit3 size={14} /> Edit Medical Details</>}
            </button>
          </div>
        </div>

        {/* Profile Card & Vitals Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-border shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-center gap-5">
              <img 
                src={activePatient.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} 
                alt={activePatient.fullName} 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-accent shadow-md"
              />
              <div>
                <h2 className="font-orbitron text-2xl font-bold text-text">{activePatient.fullName}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-text-muted font-sans">
                  <span>{activePatient.email}</span>
                  <span>•</span>
                  <span>{activePatient.age} YRS</span>
                  <span>•</span>
                  <span>{activePatient.gender}</span>
                  <span>•</span>
                  <span className="font-orbitron font-bold text-accent">Blood {activePatient.bloodType}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-surface border border-border text-center min-w-[100px]">
                <span className="text-[10px] font-orbitron text-text-muted uppercase block">Health Score</span>
                <span className="font-orbitron font-extrabold text-xl text-emerald-500">{activePatient.biometrics?.score || 85}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface border border-border text-center min-w-[100px]">
                <span className="text-[10px] font-orbitron text-text-muted uppercase block">Insurance ID</span>
                <span className="font-orbitron font-bold text-xs text-text block mt-1">{activePatient.insuranceId}</span>
              </div>
            </div>
          </div>

          {/* Quick Vitals Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-surface border border-border">
              <span className="text-xs font-orbitron text-text-muted uppercase flex items-center gap-1.5">
                <Heart size={14} className="text-accent animate-heartbeat" /> Heart Rate
              </span>
              <p className="font-orbitron font-bold text-2xl text-text mt-1">
                {activePatient.biometrics?.heartRate || 74} <span className="text-xs font-normal text-text-muted">BPM</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border">
              <span className="text-xs font-orbitron text-text-muted uppercase flex items-center gap-1.5">
                <Activity size={14} className="text-emerald-500" /> Blood Oxygen
              </span>
              <p className="font-orbitron font-bold text-2xl text-text mt-1">
                {activePatient.biometrics?.oxygen || 98}% <span className="text-xs font-normal text-emerald-500">SpO2</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border">
              <span className="text-xs font-orbitron text-text-muted uppercase flex items-center gap-1.5">
                <Droplet size={14} className="text-blue-500" /> Hydration
              </span>
              <p className="font-orbitron font-bold text-2xl text-text mt-1">
                {activePatient.biometrics?.hydration || 80}% <span className="text-xs font-normal text-text-muted">Optimal</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border">
              <span className="text-xs font-orbitron text-text-muted uppercase flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-amber-500" /> Blood Pressure
              </span>
              <p className="font-orbitron font-bold text-2xl text-text mt-1">
                {activePatient.biometrics?.bloodPressure || '120/80'}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form or View Sections */}
        {isEditing ? (
          <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-border shadow-xl space-y-6">
            <h3 className="font-orbitron font-bold text-base uppercase text-accent tracking-wider">
              Edit Emergency Passport & Bio-Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-orbitron uppercase text-text-muted mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-orbitron uppercase text-text-muted mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-orbitron uppercase text-text-muted mb-1">Blood Type</label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData(prev => ({ ...prev, bloodType: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm font-bold text-accent"
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

            {/* Allergies Tag Editor */}
            <div>
              <label className="block text-xs font-orbitron uppercase text-text-muted mb-1.5">
                Known Allergies (Crucial for AI Medicine Scanner cross-checks)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAllergy(); }}}
                  placeholder="Type allergy and press Enter..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="px-4 py-2 bg-accent text-white rounded-xl font-orbitron text-xs font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.allergies.map(item => (
                  <span key={item} className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    {item}
                    <X size={12} className="cursor-pointer hover:text-red-800" onClick={() => handleRemoveAllergy(item)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Conditions Tag Editor */}
            <div>
              <label className="block text-xs font-orbitron uppercase text-text-muted mb-1.5">
                Pre-existing Conditions
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCondition(); }}}
                  placeholder="Type condition and press Enter..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="px-4 py-2 bg-accent text-white rounded-xl font-orbitron text-xs font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.conditions.map(item => (
                  <span key={item} className="px-2.5 py-1 bg-surface border border-accent/30 text-text rounded-lg text-xs font-medium flex items-center gap-1.5">
                    {item}
                    <X size={12} className="cursor-pointer hover:text-accent" onClick={() => handleRemoveCondition(item)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Medications Tag Editor */}
            <div>
              <label className="block text-xs font-orbitron uppercase text-text-muted mb-1.5">
                Current Medications
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={medicationInput}
                  onChange={(e) => setMedicationInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMedication(); }}}
                  placeholder="Type medication name and press Enter..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="px-4 py-2 bg-accent text-white rounded-xl font-orbitron text-xs font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.medications.map(item => (
                  <span key={item} className="px-2.5 py-1 bg-surface border border-border text-text-muted rounded-lg text-xs flex items-center gap-1.5">
                    {item}
                    <X size={12} className="cursor-pointer hover:text-accent" onClick={() => handleRemoveMedication(item)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-border font-orbitron text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-accent text-white font-orbitron text-xs font-bold hover:bg-accent-deep shadow-md flex items-center gap-1.5"
              >
                <Save size={14} /> Save Patient Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Allergies & Conditions Details */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-border shadow-md space-y-4">
              <h3 className="font-orbitron font-bold text-sm uppercase tracking-wider text-accent flex items-center gap-2">
                <AlertTriangle size={16} /> Allergies & Safety Directives
              </h3>
              
              <div>
                <span className="text-xs font-orbitron text-text-muted uppercase block mb-2">Known Allergies:</span>
                <div className="flex flex-wrap gap-2">
                  {activePatient.emergencyPassport?.allergies?.map(item => (
                    <span key={item} className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold">
                      {item}
                    </span>
                  )) || <span className="text-xs text-text-muted">No allergies recorded</span>}
                </div>
              </div>

              <div>
                <span className="text-xs font-orbitron text-text-muted uppercase block mb-2">Medical Conditions:</span>
                <div className="flex flex-wrap gap-2">
                  {activePatient.emergencyPassport?.conditions?.map(item => (
                    <span key={item} className="px-3 py-1 bg-surface border border-border text-text rounded-xl text-xs font-medium">
                      {item}
                    </span>
                  )) || <span className="text-xs text-text-muted">No conditions listed</span>}
                </div>
              </div>

              <div>
                <span className="text-xs font-orbitron text-text-muted uppercase block mb-2">Active Prescriptions:</span>
                <div className="flex flex-wrap gap-2">
                  {activePatient.emergencyPassport?.medications?.map(item => (
                    <span key={item} className="px-3 py-1 bg-surface border border-accent/30 text-accent rounded-xl text-xs font-medium">
                      {item}
                    </span>
                  )) || <span className="text-xs text-text-muted">No active medications</span>}
                </div>
              </div>
            </div>

            {/* Emergency Contacts & Primary Doctor */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-border shadow-md space-y-4">
              <h3 className="font-orbitron font-bold text-sm uppercase tracking-wider text-accent flex items-center gap-2">
                <Phone size={16} /> Emergency Support Network
              </h3>

              <div className="space-y-3">
                {activePatient.emergencyPassport?.emergencyContacts?.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between">
                    <div>
                      <span className="font-orbitron font-bold text-sm text-text block">{c.name}</span>
                      <span className="text-xs font-sans text-text-muted">{c.relation}</span>
                    </div>
                    <span className="text-xs font-orbitron font-bold text-accent">{c.phone}</span>
                  </div>
                ))}

                {activePatient.emergencyPassport?.primaryDoctor && (
                  <div className="p-3.5 rounded-2xl bg-accent/5 border border-accent/20">
                    <span className="text-[10px] font-orbitron text-accent uppercase tracking-wider block font-bold">Primary Care Physician</span>
                    <div className="flex justify-between items-center mt-1">
                      <div>
                        <span className="font-orbitron font-bold text-xs text-text block">
                          {activePatient.emergencyPassport.primaryDoctor.name}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {activePatient.emergencyPassport.primaryDoctor.specialty}
                        </span>
                      </div>
                      <span className="text-xs font-orbitron font-semibold text-text">
                        {activePatient.emergencyPassport.primaryDoctor.phone}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
