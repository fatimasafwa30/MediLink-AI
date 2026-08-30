import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_DATA } from '../data';

// Default Verified Doctor Profiles / Personas
export const DOCTOR_PRESETS = [
  {
    id: 'doc-001',
    fullName: 'Dr. Aris Thorne, MD',
    email: 'dr.thorne@medilink.ai',
    specialty: 'Internal Medicine & Pulmonology',
    hospital: 'City General Hub',
    licenseId: 'MED-NY-84920',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
    phone: '+1 (555) 441-2099',
    assignedPatientIds: ['patient-001', 'patient-002']
  },
  {
    id: 'doc-002',
    fullName: 'Dr. Elena Rostova, MD, FACC',
    email: 'dr.rostova@medilink.ai',
    specialty: 'Interventional Cardiology',
    hospital: 'City General Hub',
    licenseId: 'MED-CA-91044',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
    phone: '+1 (555) 902-4412',
    assignedPatientIds: ['patient-002', 'patient-003']
  },
  {
    id: 'doc-003',
    fullName: 'Dr. Marcus Vance, MD',
    email: 'dr.vance@medilink.ai',
    specialty: 'Neurology & Stroke Care',
    hospital: 'Metro Trauma Center',
    licenseId: 'MED-MA-33108',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80',
    phone: '+1 (555) 882-8821',
    assignedPatientIds: ['patient-001', 'patient-003']
  },
  {
    id: 'doc-004',
    fullName: 'Dr. Aisha Rahman, MD',
    email: 'dr.rahman@medilink.ai',
    specialty: 'Emergency Medicine',
    hospital: 'Rapid Response Clinic',
    licenseId: 'MED-GA-99011',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813587-8fb7905d4df4?auto=format&fit=crop&w=250&q=80',
    phone: '+1 (555) 990-9901',
    assignedPatientIds: ['patient-001', 'patient-002', 'patient-003']
  }
];

// Helper to format clean human names from email (e.g. fatimasafwa30@gmail.com -> Fatima Safwa)
const formatNameFromEmail = (email) => {
  const prefix = email.split('@')[0].replace(/[0-9_.]/g, ' ').trim();
  if (!prefix) return 'Fatima Safwa';
  return prefix.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

// Default Real Patient Profiles
export const REAL_PATIENT_PRESETS = [
  {
    id: 'patient-fatima',
    fullName: 'Fatima Safwa',
    email: 'fatimasafwa30@gmail.com',
    age: 22,
    gender: 'Female',
    bloodType: 'O+',
    weightKg: 58,
    heightCm: 165,
    insuranceId: 'ML-992014-F',
    isOrganDonor: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    biometrics: {
      heartRate: 72,
      oxygen: 99,
      stress: 28,
      hydration: 85,
      score: 94,
      bloodPressure: '118/76',
      glucoseMgDl: 90
    },
    emergencyPassport: {
      allergies: ['None (No known drug allergies)'],
      conditions: ['Healthy - Routine Medical Baseline'],
      medications: ['Multivitamins'],
      prescriptions: [],
      emergencyContacts: [
        { name: 'Family Emergency Contact', phone: '+1 (555) 910-4488', relation: 'Family' }
      ],
      primaryDoctor: { name: 'Dr. Aisha Rahman', specialty: 'Family & Emergency Medicine', phone: '+1 (555) 990-1000' }
    }
  },
  {
    id: 'patient-001',
    fullName: 'Johnathan Doe',
    email: 'john.doe@medilink.ai',
    age: 28,
    gender: 'Male',
    bloodType: 'B+',
    weightKg: 74,
    heightCm: 182,
    insuranceId: 'ML-8492001-B',
    isOrganDonor: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    biometrics: {
      heartRate: 74,
      oxygen: 98,
      stress: 42,
      hydration: 80,
      score: 82,
      bloodPressure: '120/80',
      glucoseMgDl: 95
    },
    emergencyPassport: {
      allergies: ['Penicillin', 'Shellfish'],
      conditions: ['Asthma (Mild)'],
      medications: ['Albuterol Sulfate Inhaler (90mcg)'],
      prescriptions: [
        {
          id: 'rx-101',
          medicineName: 'Albuterol Sulfate Inhaler',
          strength: '90 mcg/actuation',
          form: 'Inhaler',
          frequency: 'As needed (every 4-6 hrs for wheezing)',
          timingSchedule: ['08:00 AM (Morning)', '08:00 PM (Bedtime)'],
          foodInstructions: 'Inhale 2 puffs, rinse mouth with water after use.',
          prescribedBy: 'Dr. Aris Thorne, MD',
          prescribedDate: '2026-08-15',
          duration: '30 Days Refill',
          status: 'Active'
        }
      ],
      emergencyContacts: [
        { name: 'Sarah Connor', phone: '+1 (555) 019-8234', relation: 'Sister' },
        { name: 'Robert Doe', phone: '+1 (555) 832-1100', relation: 'Father' }
      ],
      primaryDoctor: { name: 'Dr. Aris Thorne', specialty: 'Pulmonology & General Practice', phone: '+1 (555) 441-2099' }
    }
  }
];

const PatientContext = createContext(null);

export const PatientProvider = ({ children }) => {
  // Active Patient state
  const [activePatient, setActivePatient] = useState(() => {
    const saved = localStorage.getItem('medilink_active_patient');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If saved profile was fatima or generic, ensure nice formatted name
        if (parsed.email?.toLowerCase().includes('fatima')) {
          return {
            ...parsed,
            fullName: parsed.fullName?.includes('FATIMASAFWA') ? 'Fatima Safwa' : parsed.fullName,
            gender: parsed.gender === 'Other' ? 'Female' : parsed.gender,
            avatarUrl: parsed.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
          };
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse saved patient:", e);
      }
    }
    return REAL_PATIENT_PRESETS[0];
  });

  // Active Doctor state
  const [activeDoctor, setActiveDoctor] = useState(() => {
    const saved = localStorage.getItem('medilink_active_doctor');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved doctor:", e);
      }
    }
    return DOCTOR_PRESETS[0];
  });

  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(() => {
    return localStorage.getItem('medilink_doctor_session') ? true : false;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // All Patients list
  const [allPatients, setAllPatients] = useState(() => {
    const savedList = localStorage.getItem('medilink_all_patients');
    if (savedList) {
      try {
        return JSON.parse(savedList);
      } catch (e) {
        console.error("Failed to parse patient list:", e);
      }
    }
    return REAL_PATIENT_PRESETS;
  });

  // Real-Time Notification Banner for Patient
  const [patientNotification, setPatientNotification] = useState(null);

  // Sync active patient to localStorage
  useEffect(() => {
    if (activePatient) {
      localStorage.setItem('medilink_active_patient', JSON.stringify(activePatient));
    }
  }, [activePatient]);

  // Sync active doctor to localStorage
  useEffect(() => {
    if (activeDoctor) {
      localStorage.setItem('medilink_active_doctor', JSON.stringify(activeDoctor));
    }
  }, [activeDoctor]);

  // Sync patient list to localStorage
  useEffect(() => {
    localStorage.setItem('medilink_all_patients', JSON.stringify(allPatients));
  }, [allPatients]);

  // Doctor Login
  const doctorLogin = (doctorIdOrEmail, password) => {
    const target = DOCTOR_PRESETS.find(d => 
      d.id === doctorIdOrEmail || d.email.toLowerCase() === doctorIdOrEmail.toLowerCase()
    ) || DOCTOR_PRESETS[0];

    setActiveDoctor(target);
    setIsDoctorLoggedIn(true);
    localStorage.setItem('medilink_doctor_session', 'doc_token_' + target.id);
    return { success: true, doctor: target };
  };

  // Doctor Logout
  const doctorLogout = () => {
    localStorage.removeItem('medilink_doctor_session');
    setIsDoctorLoggedIn(false);
  };

  // Switch Doctor Profile
  const switchDoctor = (doctorId) => {
    const target = DOCTOR_PRESETS.find(d => d.id === doctorId);
    if (target) {
      setActiveDoctor(target);
      setIsDoctorLoggedIn(true);
      return true;
    }
    return false;
  };

  // Switch Patient Profile
  const switchPatient = (patientId) => {
    const target = allPatients.find(p => p.id === patientId) || REAL_PATIENT_PRESETS.find(p => p.id === patientId);
    if (target) {
      setActivePatient(target);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Doctor updates patient prescription and dosage timings
  const prescribeMedication = async (patientId, newPrescription) => {
    const rxRecord = {
      id: 'rx-' + Date.now(),
      medicineName: newPrescription.medicineName,
      strength: newPrescription.strength,
      form: newPrescription.form || 'Tablet',
      frequency: newPrescription.frequency || 'Every 8 hours',
      timingSchedule: newPrescription.timingSchedule || ['08:00 AM', '02:00 PM', '08:00 PM'],
      foodInstructions: newPrescription.foodInstructions || 'Take with water after meals.',
      prescribedBy: activeDoctor?.fullName || 'Dr. Aris Thorne, MD',
      prescribedDate: new Date().toISOString().split('T')[0],
      duration: newPrescription.duration || '14 Days',
      status: 'Active'
    };

    setAllPatients(prevPatients => {
      return prevPatients.map(patient => {
        if (patient.id === patientId) {
          const currentPassport = patient.emergencyPassport || {};
          const currentMeds = currentPassport.medications || [];
          const currentRxs = currentPassport.prescriptions || [];

          const medLabel = `${newPrescription.medicineName} ${newPrescription.strength}`;
          const updatedMeds = currentMeds.includes(medLabel) ? currentMeds : [medLabel, ...currentMeds];

          const updatedPatient = {
            ...patient,
            emergencyPassport: {
              ...currentPassport,
              medications: updatedMeds,
              prescriptions: [rxRecord, ...currentRxs]
            }
          };

          if (activePatient?.id === patientId) {
            setActivePatient(updatedPatient);
          }

          return updatedPatient;
        }
        return patient;
      });
    });

    const noticeText = `${activeDoctor?.fullName || 'Your Doctor'} prescribed ${newPrescription.medicineName} (${newPrescription.strength}) with updated timing schedule.`;
    setPatientNotification({
      id: Date.now(),
      doctorName: activeDoctor?.fullName || 'Physician',
      medicineName: newPrescription.medicineName,
      message: noticeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    try {
      if (supabase) {
        await supabase
          .from('emergency_passports')
          .update({
            updated_at: new Date().toISOString()
          })
          .eq('user_id', patientId);
      }
    } catch (e) {
      console.warn("Supabase prescription sync:", e);
    }

    return { success: true, prescription: rxRecord };
  };

  // Doctor removes/discontinues medication
  const discontinueMedication = (patientId, rxIdOrName) => {
    setAllPatients(prevPatients => {
      return prevPatients.map(patient => {
        if (patient.id === patientId) {
          const currentPassport = patient.emergencyPassport || {};
          const updatedRxs = (currentPassport.prescriptions || []).filter(rx => rx.id !== rxIdOrName && rx.medicineName !== rxIdOrName);
          const updatedMeds = (currentPassport.medications || []).filter(m => !m.includes(rxIdOrName));

          const updatedPatient = {
            ...patient,
            emergencyPassport: {
              ...currentPassport,
              medications: updatedMeds,
              prescriptions: updatedRxs
            }
          };

          if (activePatient?.id === patientId) {
            setActivePatient(updatedPatient);
          }

          return updatedPatient;
        }
        return patient;
      });
    });
  };

  // Update active patient details & real biometrics
  const updatePatientProfile = (updatedFields) => {
    setActivePatient(prev => {
      const updated = {
        ...prev,
        ...updatedFields,
        emergencyPassport: {
          ...prev.emergencyPassport,
          ...(updatedFields.emergencyPassport || {})
        },
        biometrics: {
          ...prev.biometrics,
          ...(updatedFields.biometrics || {})
        }
      };

      setAllPatients(all => all.map(p => p.id === updated.id ? updated : p));
      return updated;
    });

    // Sync to Supabase
    try {
      if (supabase && activePatient?.id) {
        supabase
          .from('biometrics')
          .insert([
            {
              user_id: activePatient.id,
              heart_rate: updatedFields.biometrics?.heartRate || activePatient.biometrics?.heartRate,
              oxygen_level: updatedFields.biometrics?.oxygen || activePatient.biometrics?.oxygen,
              health_score: updatedFields.biometrics?.score || activePatient.biometrics?.score,
              recorded_at: new Date().toISOString()
            }
          ]).then(() => {});
      }
    } catch (e) {
      console.warn("Supabase vitals sync:", e);
    }
  };

  // Patient Login function
  const login = async (email, password) => {
    const existing = allPatients.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setActivePatient(existing);
      setIsAuthenticated(true);
      localStorage.setItem('medilink_auth_token', 'local_token_' + existing.id);
      return { success: true, patient: existing };
    }

    const isFemaleName = email.toLowerCase().includes('fatima') || email.toLowerCase().includes('sarah') || email.toLowerCase().includes('elena') || email.toLowerCase().includes('mary');
    const formattedName = formatNameFromEmail(email);

    const newPatient = {
      id: 'patient-' + Date.now(),
      fullName: formattedName,
      email,
      age: 22,
      gender: isFemaleName ? 'Female' : 'Male',
      bloodType: 'O+',
      weightKg: 58,
      heightCm: 165,
      insuranceId: 'ML-' + Math.floor(1000000 + Math.random() * 9000000),
      isOrganDonor: true,
      avatarUrl: isFemaleName 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      biometrics: {
        heartRate: 72,
        oxygen: 99,
        stress: 25,
        hydration: 85,
        score: 95,
        bloodPressure: '118/76',
        glucoseMgDl: 90
      },
      emergencyPassport: {
        allergies: ['No known drug allergies'],
        conditions: ['Healthy Baseline'],
        medications: ['None (Routine Health)'],
        prescriptions: [],
        emergencyContacts: [{ name: 'Family Emergency Contact', phone: '+1 (555) 910-4488', relation: 'Family' }],
        primaryDoctor: { name: 'Dr. Aisha Rahman', specialty: 'Family & Internal Medicine', phone: '+1 (555) 990-1000' }
      }
    };

    setAllPatients(prev => [newPatient, ...prev]);
    setActivePatient(newPatient);
    setIsAuthenticated(true);
    localStorage.setItem('medilink_auth_token', 'local_token_' + newPatient.id);
    return { success: true, patient: newPatient };
  };

  // Register custom real patient
  const registerPatient = async (patientData) => {
    const newId = 'patient-' + Date.now();
    const fullPatient = {
      id: newId,
      fullName: patientData.fullName || 'Registered Patient',
      email: patientData.email,
      age: Number(patientData.age) || 22,
      gender: patientData.gender || 'Female',
      bloodType: patientData.bloodType || 'O+',
      weightKg: Number(patientData.weightKg) || 58,
      heightCm: Number(patientData.heightCm) || 165,
      insuranceId: patientData.insuranceId || 'ML-' + Math.floor(1000000 + Math.random() * 9000000),
      isOrganDonor: Boolean(patientData.isOrganDonor),
      avatarUrl: patientData.avatarUrl || (patientData.gender === 'Female' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'),
      biometrics: {
        heartRate: Number(patientData.heartRate) || 72,
        oxygen: Number(patientData.oxygen) || 99,
        stress: Number(patientData.stress) || 28,
        hydration: Number(patientData.hydration) || 85,
        score: 92,
        bloodPressure: patientData.bloodPressure || '118/76',
        glucoseMgDl: Number(patientData.glucoseMgDl) || 90
      },
      emergencyPassport: {
        allergies: Array.isArray(patientData.allergies) 
          ? patientData.allergies 
          : patientData.allergies ? patientData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        conditions: Array.isArray(patientData.conditions)
          ? patientData.conditions
          : patientData.conditions ? patientData.conditions.split(',').map(s => s.trim()).filter(Boolean) : [],
        medications: Array.isArray(patientData.medications)
          ? patientData.medications
          : patientData.medications ? patientData.medications.split(',').map(s => s.trim()).filter(Boolean) : [],
        prescriptions: [],
        emergencyContacts: patientData.emergencyContacts || [
          { 
            name: patientData.contactName || 'Emergency Contact', 
            phone: patientData.contactPhone || '+1 (555) 000-0000', 
            relation: patientData.contactRelation || 'Family' 
          }
        ],
        primaryDoctor: {
          name: patientData.doctorName || 'Dr. Aisha Rahman, MD',
          specialty: patientData.doctorSpecialty || 'Family & Emergency Medicine',
          phone: patientData.doctorPhone || '+1 (555) 990-1000'
        }
      }
    };

    setAllPatients(prev => [fullPatient, ...prev]);
    setActivePatient(fullPatient);
    setIsAuthenticated(true);
    localStorage.setItem('medilink_auth_token', 'local_token_' + newId);
    return { success: true, patient: fullPatient };
  };

  const logout = () => {
    localStorage.removeItem('medilink_auth_token');
    setIsAuthenticated(false);
  };

  return (
    <PatientContext.Provider value={{
      activePatient,
      isAuthenticated,
      allPatients,
      activeDoctor,
      isDoctorLoggedIn,
      DOCTOR_PRESETS,
      doctorLogin,
      doctorLogout,
      switchDoctor,
      prescribeMedication,
      discontinueMedication,
      patientNotification,
      dismissNotification: () => setPatientNotification(null),
      login,
      registerPatient,
      updatePatientProfile,
      switchPatient,
      logout
    }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
