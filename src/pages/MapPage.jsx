import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LiveMap from '../components/LiveMap';

const MapPage = () => (
  <main className="min-h-screen bg-background pt-6">
    <div className="container mx-auto px-6 mb-4">
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-orbitron text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
      >
        <ArrowLeft size={18} aria-hidden />
        Back to home
      </Link>
    </div>
    <LiveMap />
  </main>
);

export default MapPage;
