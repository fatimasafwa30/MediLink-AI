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

// Default Real Patient Profiles
export const REAL_PATIENT_PRESETS = [
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
  },
  {
    id: 'patient-002',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@medilink.ai',
    age: 34,
    gender: 'Female',
    bloodType: 'O-',
    weightKg: 62,
    heightCm: 168,
    insuranceId: 'ML-9102455-O',
    isOrganDonor: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    biometrics: {
      heartRate: 82,
      oxygen: 99,
      stress: 58,
      hydration: 75,
      score: 89,
      bloodPressure: '115/75',
      glucoseMgDl: 88
    },
    emergencyPassport: {
      allergies: ['Sulfa Drugs', 'Aspirin'],
      conditions: ['Hypertension (Stage 1)', 'Migraine'],
      medications: ['Lisinopril 10mg', 'Sumatriptan 50mg'],
      prescriptions: [
        {
          id: 'rx-201',
          medicineName: 'Lisinopril',
          strength: '10mg',
          form: 'Tablet',
          frequency: 'Once daily (every 24 hrs)',
          timingSchedule: ['08:00 AM (Morning with breakfast)'],
          foodInstructions: 'Take with full glass of water. Monitor blood pressure daily.',
          prescribedBy: 'Dr. Elena Rostova, MD',
          prescribedDate: '2026-08-20',
          duration: '90 Days Maintenance',
          status: 'Active'
        }
      ],
      emergencyContacts: [
        { name: 'Dmitri Rostov', phone: '+1 (555) 902-7712', relation: 'Spouse' }
      ],
      primaryDoctor: { name: 'Dr. Marcus Vance', specialty: 'Neurology & Internal Med', phone: '+1 (555) 882-1004' }
    }
  },
  {
    id: 'patient-003',
    fullName: 'David Miller',
    email: 'david.miller@medilink.ai',
    age: 52,
    gender: 'Male',
    bloodType: 'A+',
    weightKg: 88,
    heightCm: 178,
    insuranceId: 'ML-3329184-A',
    isOrganDonor: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    biometrics: {
      heartRate: 68,
      oxygen: 97,
      stress: 35,
      hydration: 70,
      score: 76,
      bloodPressure: '135/85',
      glucoseMgDl: 142
    },
    emergencyPassport: {
      allergies: ['NSAIDs (Ibuprofen/Naproxen)', 'Latex'],
      conditions: ['Type 2 Diabetes', 'Coronary Artery Disease'],
      medications: ['Metformin 500mg ER', 'Atorvastatin 20mg'],
      prescriptions: [
        {
          id: 'rx-301',
          medicineName: 'Metformin Hydrochloride (ER)',
          strength: '500mg',
          form: 'Extended Release Tablet',
          frequency: 'Once daily with evening meal',
          timingSchedule: ['07:30 PM (Dinner)'],
          foodInstructions: 'Swallow whole with dinner. Do NOT crush or chew.',
          prescribedBy: 'Dr. Aisha Rahman, MD',
          prescribedDate: '2026-08-10',
          duration: '60 Days Refill',
          status: 'Active'
        }
      ],
      emergencyContacts: [
        { name: 'Claire Miller', phone: '+1 (555) 304-9988', relation: 'Wife' },
        { name: 'Dr. Aisha Rahman', phone: '+1 (555) 990-1000', relation: 'Cardiologist' }
      ],
      primaryDoctor: { name: 'Dr. Aisha Rahman', specialty: 'Cardiology', phone: '+1 (555) 990-1000' }
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
        return JSON.parse(saved);
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

    // Update patient in allPatients state
    setAllPatients(prevPatients => {
      return prevPatients.map(patient => {
        if (patient.id === patientId) {
          const currentPassport = patient.emergencyPassport || {};
          const currentMeds = currentPassport.medications || [];
          const currentRxs = currentPassport.prescriptions || [];

          // Add to medications list if not present
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

          // If this is currently active patient, sync active patient
          if (activePatient?.id === patientId) {
            setActivePatient(updatedPatient);
          }

          return updatedPatient;
        }
        return patient;
      });
    });

    // Notify patient
    const noticeText = `${activeDoctor?.fullName || 'Your Doctor'} prescribed ${newPrescription.medicineName} (${newPrescription.strength}) with updated timing schedule.`;
    setPatientNotification({
      id: Date.now(),
      doctorName: activeDoctor?.fullName || 'Physician',
      medicineName: newPrescription.medicineName,
      message: noticeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // Try Supabase sync
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

  // Update active patient details
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

    const demoPatient = {
      id: 'patient-' + Date.now(),
      fullName: email.split('@')[0].toUpperCase(),
      email,
      age: 30,
      gender: 'Other',
      bloodType: 'A+',
      weightKg: 70,
      heightCm: 175,
      insuranceId: 'ML-' + Math.floor(1000000 + Math.random() * 9000000),
      isOrganDonor: true,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      biometrics: {
        heartRate: 75,
        oxygen: 98,
        stress: 45,
        hydration: 80,
        score: 80,
        bloodPressure: '120/80',
        glucoseMgDl: 95
      },
      emergencyPassport: {
        allergies: ['Penicillin'],
        conditions: ['Asthma'],
        medications: ['Inhaler as needed'],
        prescriptions: [],
        emergencyContacts: [{ name: 'Family Contact', phone: '+1 (555) 012-3456', relation: 'Family' }],
        primaryDoctor: { name: 'Dr. Aris Thorne', specialty: 'Internal Medicine', phone: '+1 (555) 441-2099' }
      }
    };

    setAllPatients(prev => [demoPatient, ...prev]);
    setActivePatient(demoPatient);
    setIsAuthenticated(true);
    localStorage.setItem('medilink_auth_token', 'local_token_' + demoPatient.id);
    return { success: true, patient: demoPatient };
  };

  // Register real patient
  const registerPatient = async (patientData) => {
    const newId = 'patient-' + Date.now();
    const fullPatient = {
      id: newId,
      fullName: patientData.fullName || 'Registered Patient',
      email: patientData.email,
      age: Number(patientData.age) || 28,
      gender: patientData.gender || 'Not specified',
      bloodType: patientData.bloodType || 'O+',
      weightKg: Number(patientData.weightKg) || 70,
      heightCm: Number(patientData.heightCm) || 175,
      insuranceId: patientData.insuranceId || 'ML-' + Math.floor(1000000 + Math.random() * 9000000),
      isOrganDonor: Boolean(patientData.isOrganDonor),
      avatarUrl: patientData.gender === 'Female' 
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      biometrics: {
        heartRate: Number(patientData.heartRate) || 72,
        oxygen: Number(patientData.oxygen) || 98,
        stress: Number(patientData.stress) || 40,
        hydration: Number(patientData.hydration) || 80,
        score: 85,
        bloodPressure: patientData.bloodPressure || '120/80',
        glucoseMgDl: Number(patientData.glucoseMgDl) || 95
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
          name: patientData.doctorName || 'Dr. Aris Thorne, MD',
          specialty: patientData.doctorSpecialty || 'Family & Emergency Medicine',
          phone: patientData.doctorPhone || '+1 (555) 441-2099'
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
