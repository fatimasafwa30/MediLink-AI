import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
import { MOCK_DATA } from './data';

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

function App() {
  const [sosActive, setSosActive] = useState(false);
  const location = useLocation();

  return (
    <div className="relative w-full min-h-screen bg-background">
      <div className="noise-overlay"></div>
      
      {/* Global Navigation */}
      <NavBar />

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
          <Route path="/emergency" element={
            <PageWrapper>
              <AIEmergencyAssistant />
              <SpecialistCards specialists={MOCK_DATA.specialists} />
            </PageWrapper>
          } />
          <Route path="/health-twin" element={
            <PageWrapper>
              <HealthTwin data={MOCK_DATA.healthTwin} />
              <EmergencyReportCard data={MOCK_DATA.emergencyPassport} />
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

export default App;
