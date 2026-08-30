import React from 'react';
import Hero from '../components/Hero';
import AIEmergencyAssistant from '../components/AIEmergencyAssistant';
import HealthTwin from '../components/HealthTwin';
import EmergencyReportCard from '../components/EmergencyReportCard';
import EmergencyDroneSupport from '../components/EmergencyDroneSupport';
import AIMedicineScanner from '../components/AIMedicineScanner';
import LiveMap from '../components/LiveMap';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import FeatureHighlights from '../components/FeatureHighlights';

const HomePage = () => (
  <main>
    <Hero />
    <AIEmergencyAssistant />
    <HealthTwin />
    <EmergencyReportCard />
    <EmergencyDroneSupport />
    <AIMedicineScanner />
    <LiveMap />
    <AnalyticsDashboard />
    <FeatureHighlights />
  </main>
);

export default HomePage;
