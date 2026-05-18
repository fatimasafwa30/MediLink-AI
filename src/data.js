export const MOCK_DATA = {
  healthTwin: {
    heartRate: 74,
    oxygen: 98,
    stress: 42,
    hydration: 80,
    score: 82,
    bloodType: 'B+',
    age: 28,
  },
  emergencyPassport: {
    allergies: ['Penicillin', 'Shellfish'],
    conditions: ['Asthma (Mild)'],
    medications: ['Albuterol Sulfate'],
    emergencyContacts: [
      { name: 'Sarah Connor', phone: '+1 555-0198', relation: 'Sister' },
    ],
    primaryDoctor: { name: 'Dr. Aris Thorne', specialty: 'General Practice' },
    insuranceId: 'ML-8492001-B',
  },
  specialists: [
    {
      id: 1,
      name: 'Dr. Elena Rostova',
      specialty: 'Cardiology',
      experience: 12,
      score: 94,
      distance: 0.8,
      hospital: 'City General Hub',
      status: 'Available Now',
      title: 'Interventional Cardiologist',
      bio: 'Board-certified interventional cardiologist focused on acute coronary syndromes and STEMI pathways. Leads the rapid cardiac response team at City General Hub.',
      credentials: ['MD — Johns Hopkins', 'FACC', 'Board: Interventional Cardiology'],
      languages: ['English', 'Russian', 'Spanish'],
      responseTime: '~90 sec avg',
      secureLine: 'ext. 4412 (MediLink verified)',
    },
    {
      id: 2,
      name: 'Dr. Marcus Vance',
      specialty: 'Neurology',
      experience: 8,
      score: 88,
      distance: 1.2,
      hospital: 'Metro Trauma Center',
      status: 'Available Now',
      title: 'Stroke & Neurocritical Care',
      bio: 'Vascular neurologist specializing in stroke triage, TIA workup, and neuro-imaging correlation for emergency presentations.',
      credentials: ['MD — UCSF', 'Vascular Neurology Fellowship', 'NIH Stroke Scale Trainer'],
      languages: ['English', 'French'],
      responseTime: '~2 min avg',
      secureLine: 'ext. 8821 (MediLink verified)',
    },
    {
      id: 3,
      name: 'Dr. Sarah Lin',
      specialty: 'Pulmonology',
      experience: 15,
      score: 92,
      distance: 2.5,
      hospital: 'Westside Respiratory',
      status: 'High Demand',
      title: 'Critical Care Pulmonology',
      bio: 'Senior pulmonologist with expertise in acute respiratory failure, severe asthma exacerbations, and ventilator management in transit.',
      credentials: ['MD — Stanford', 'ABIM Pulmonary + Critical Care', 'ECMO team affiliate'],
      languages: ['English', 'Mandarin'],
      responseTime: '~4 min avg (high demand)',
      secureLine: 'ext. 2209 (MediLink verified)',
    },
    {
      id: 4,
      name: 'Dr. James O\'Connor',
      specialty: 'Trauma Surgery',
      experience: 10,
      score: 85,
      distance: 1.5,
      hospital: 'City General Hub',
      status: 'Available Now',
      title: 'Acute Care / Trauma Surgery',
      bio: 'Trauma surgeon with Level I center experience. Coordinates damage-control surgery and OR readiness for multi-system trauma.',
      credentials: ['MD — Mayo Clinic', 'ATLS Instructor', 'ACS Committee affiliate'],
      languages: ['English', 'Irish Gaelic (limited clinical)'],
      responseTime: '~2 min avg',
      secureLine: 'ext. 1104 (MediLink verified)',
    },
    {
      id: 5,
      name: 'Dr. Aisha Rahman',
      specialty: 'Emergency Med',
      experience: 6,
      score: 90,
      distance: 0.5,
      hospital: 'Rapid Response Clinic',
      status: 'Available Now',
      title: 'Emergency Medicine — Prehospital Bridge',
      bio: 'Emergency physician bridging EMS handoff, field stabilization protocols, and emergency department surge coordination.',
      credentials: ['MD — Emory', 'ABEM', 'Disaster / Mass Casualty trained'],
      languages: ['English', 'Arabic', 'Urdu'],
      responseTime: '~60 sec avg',
      secureLine: 'ext. 9901 (MediLink verified)',
    },
  ],
  chat: [
    { id: 1, sender: 'ai', text: "Hello. I'm Red, your medical companion. I'm here with you — what's happening right now?" },
    { id: 2, sender: 'user', text: "I have severe chest pain and I can't breathe properly." },
    { id: 3, sender: 'ai', text: "I hear you. Stay as calm as you can — I'm analyzing your symptoms now. Based on what you've described, this needs immediate attention. I'm locating the nearest cardiac emergency center for you. Can you tell me — is the pain spreading to your arm or jaw?" }
  ],
  nearbyHospitals: [
    { id: 1, name: 'City General Hub', distance: 1.2, icuBeds: 3, waitTime: 4, capabilities: ['Trauma', 'Cardiac'] },
    { id: 2, name: 'Metro Trauma Center', distance: 2.8, icuBeds: 0, waitTime: 25, capabilities: ['Trauma', 'Neuro'] }
  ],
  drones: [
    { id: 'DRN-77', type: 'Defibrillator + First Aid', status: 'In Transit', eta: '3 min', distance: 0.4 },
    { id: 'DRN-82', type: 'Blood Packets (O-)', status: 'Dispatching', eta: '6 min', distance: 1.1 }
  ]
};

export const getSpecialistById = (rawId) => {
  const id = Number(rawId);
  if (Number.isNaN(id)) return undefined;
  return MOCK_DATA.specialists.find((s) => s.id === id);
};
