import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PatientProvider, usePatient } from './context/PatientContext';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import AIEmergencyAssistant from './components/AIEmergencyAssistant';
import SpecialistCards from './components/SpecialistCards';
import HealthTwin from './components/HealthTwin';
import EmergencyReportCard from './components/EmergencyReportCard';
import EmergencyDroneSupport from './components/EmergencyDroneSupport';
import AIMedicineScanner from './components/AIMedicineScanner';
import LiveMap from './components/LiveMap';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import FeatureHighlights from './components/FeatureHighlights';
import Footer from './components/Footer';
import SOSOverlay from './components/SOSOverlay';
import ChatBot from './components/ChatBot';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import DoctorPortalPage from './pages/DoctorPortalPage';
import { MOCK_DATA } from './data';
import { Stethoscope, X, Bell } from 'lucide-react';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="pt-20"
  >
    {children}
  </motion.div>
);

// Notification Alert Component for Patients
const DoctorNotificationBanner = () => {
  const { patientNotification, dismissNotification } = usePatient();
  if (!patientNotification) return null;

  return (
    <div className="fixed top-24 right-6 z-[9999] max-w-md bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-4 rounded-2xl border-2 border-blue-400/60 shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 shrink-0">
            <Stethoscope size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-bold text-xs uppercase tracking-wider text-blue-300">
                Prescription Update
              </span>
              <span className="text-[10px] text-gray-400">{patientNotification.timestamp}</span>
            </div>
            <p className="font-sans text-xs mt-1 leading-relaxed text-gray-200">
              {patientNotification.message}
            </p>
          </div>
        </div>

        <button onClick={dismissNotification} className="text-gray-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

function AppContent() {
  const [sosActive, setSosActive] = useState(false);
  const location = useLocation();

  return (
    <div className="relative w-full min-h-screen bg-background">
      <div className="noise-overlay"></div>
      
      {/* Global Navigation */}
      <NavBar />

      {/* Doctor Prescription Real-Time Notification Banner */}
      <DoctorNotificationBanner />

      {/* Global Elements */}
      <ChatBot chatData={MOCK_DATA.chat} />
      
      <button 
        onClick={() => setSosActive(true)}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full bg-accent text-white font-orbitron font-bold flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <span className="relative z-10">SOS</span>
        <div className="absolute inset-0 rounded-full border-2 border-accent animate-pulse-ring"></div>
        <div className="absolute inset-0 rounded-full border-2 border-accent animate-pulse-ring" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute inset-0 rounded-full border-2 border-accent animate-pulse-ring" style={{ animationDelay: '1.2s' }}></div>
      </button>

      {sosActive && <SOSOverlay onClose={() => setSosActive(false)} />}

      {/* Page Transitions & Routing */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageWrapper>
              <Hero />
              <FeatureHighlights />
            </PageWrapper>
          } />
          <Route path="/login" element={
            <PageWrapper>
              <LoginPage />
            </PageWrapper>
          } />
          <Route path="/profile" element={
            <PageWrapper>
              <ProfilePage />
            </PageWrapper>
          } />
          <Route path="/doctor-portal" element={
            <PageWrapper>
              <DoctorPortalPage />
            </PageWrapper>
          } />
          <Route path="/doctor" element={
            <PageWrapper>
              <DoctorPortalPage />
            </PageWrapper>
          } />
          <Route path="/emergency" element={
            <PageWrapper>
              <AIEmergencyAssistant />
            </PageWrapper>
          } />
          <Route path="/health-twin" element={
            <PageWrapper>
              <HealthTwin />
              <EmergencyReportCard />
            </PageWrapper>
          } />
          <Route path="/map" element={
            <PageWrapper>
              <LiveMap />
            </PageWrapper>
          } />
          <Route path="/drones" element={
            <PageWrapper>
              <EmergencyDroneSupport drones={MOCK_DATA.drones} />
            </PageWrapper>
          } />
          <Route path="/scanner" element={
            <PageWrapper>
              <AIMedicineScanner />
            </PageWrapper>
          } />
          <Route path="/dashboard" element={
            <PageWrapper>
              <AnalyticsDashboard />
            </PageWrapper>
          } />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <PatientProvider>
      <AppContent />
    </PatientProvider>
  );
}

export default App;
