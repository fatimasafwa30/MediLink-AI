import React from 'react';
import Hero from '../components/Hero';
import AIEmergencyAssistant from '../components/AIEmergencyAssistant';
import SpecialistCards from '../components/SpecialistCards';
import HealthTwin from '../components/HealthTwin';
import EmergencyReportCard from '../components/EmergencyReportCard';
import EmergencyDroneSupport from '../components/EmergencyDroneSupport';
import AIMedicineScanner from '../components/AIMedicineScanner';
import LiveMap from '../components/LiveMap';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import FeatureHighlights from '../components/FeatureHighlights';
import { MOCK_DATA } from '../data';

const HomePage = () => (
  <main>
    <Hero />
    <AIEmergencyAssistant />
    <SpecialistCards specialists={MOCK_DATA.specialists} />
    <HealthTwin data={MOCK_DATA.healthTwin} />
    <EmergencyReportCard data={MOCK_DATA.emergencyPassport} />
    <EmergencyDroneSupport drones={MOCK_DATA.drones} />
    <AIMedicineScanner />
    <LiveMap />
    <AnalyticsDashboard />
    <FeatureHighlights />
  </main>
);

export default HomePage;
