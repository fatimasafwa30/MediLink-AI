import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Plus, Minus, Navigation, Loader2, Star, ShieldAlert, X, ChevronRight, Navigation2, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Custom icons using L.divIcon
const userIcon = new L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="position: relative;">
          <div style="position: absolute; width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; opacity: 0.5; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; left: -12px; top: -12px;"></div>
          <div style="position: relative; width: 16px; height: 16px; background-color: #3b82f6; border: 2px solid white; border-radius: 50%; left: -8px; top: -8px; box-shadow: 0 0 10px rgba(59,130,246,0.8);"></div>
         </div>`,
  iconSize: [0, 0],
});

const getHospitalIcon = (isRecommended) => new L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; left: -16px; top: -32px;">
          <div style="width: 100%; height: 100%; background-color: ${isRecommended ? '#fbbf24' : '#dc2626'}; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>
          ${isRecommended ? '<span style="position: absolute; transform: rotate(0deg); top: 6px; font-size: 14px;">⭐</span>' : '<span style="position: absolute; transform: rotate(0deg); top: 6px; font-weight: bold; color: white; font-size: 12px; font-family: sans-serif;">H</span>'}
         </div>`,
  iconSize: [0, 0],
});

// Helper component to center map and handle zooming without default controls
const MapUpdater = ({ center, zoomIn, zoomOut }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng]);
    }
  }, [center, map]);

  useEffect(() => {
    if (zoomIn) {
      map.zoomIn();
    }
  }, [zoomIn, map]);

  useEffect(() => {
    if (zoomOut) {
      map.zoomOut();
    }
  }, [zoomOut, map]);
  return null;
};

// Distance calculator (Haversine)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI/180);
  const dLon = (lon2 - lon1) * (Math.PI/180); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return (R * c).toFixed(1);
};

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

/** Coarse fallback when GPS / high-accuracy fixes fail (e.g. desktop, denied, timeout). */
const DEMO_LOCATION = {
  lat: 37.7749,
  lng: -122.4194,
  accuracy: 800,
  speed: 0,
};

const geoErrorMessage = (code) => {
  switch (code) {
    case 1:
      return 'Location access was blocked. Click the lock icon in the address bar and allow Location, then retry.';
    case 2:
      return 'Your device could not determine position. On Windows: Settings → Privacy → Location → enable for Desktop apps and your browser.';
    case 3:
      return 'Location request timed out. Try turning off VPN, moving near a window, or use Demo mode for the hackathon preview.';
    default:
      return 'Could not read your location.';
  }
};

const LiveMap = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isDemoLocation, setIsDemoLocation] = useState(false);
  
  const [hospitals, setHospitals] = useState([]);
  const [recommendedHospitals, setRecommendedHospitals] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [geminiError, setGeminiError] = useState(null);

  const [mapCenter, setMapCenter] = useState(null);
  const [zoomInTrigger, setZoomInTrigger] = useState(0);
  const [zoomOutTrigger, setZoomOutTrigger] = useState(0);
  const [geoAttempt, setGeoAttempt] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setIsTracking(false);
      return undefined;
    }

    let watchId = null;
    let cancelled = false;

    setIsTracking(true);
    setError(null);

    const softOptions = {
      enableHighAccuracy: false,
      maximumAge: 120000,
      timeout: 25000,
    };

    const applyFromPosition = (position) => {
      const newLoc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed || 0,
      };
      setLocation(newLoc);
      setMapCenter((prev) => prev || newLoc);
      setError(null);
      setIsDemoLocation(false);
    };

    const attachWatch = (pos) => {
      if (cancelled) return;
      applyFromPosition(pos);
      setIsTracking(true);
      watchId = navigator.geolocation.watchPosition(
        applyFromPosition,
        () => {},
        {
          enableHighAccuracy: false,
          maximumAge: 15000,
          timeout: 60000,
        }
      );
    };

    const onHardError = (err) => {
      if (cancelled) return;
      setError(geoErrorMessage(err.code));
      setIsTracking(false);
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => attachWatch(pos),
      () => {
        navigator.geolocation.getCurrentPosition(
          (pos) => attachWatch(pos),
          onHardError,
          { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
        );
      },
      softOptions
    );

    return () => {
      cancelled = true;
      if (watchId != null) navigator.geolocation.clearWatch(watchId);
    };
  }, [geoAttempt]);

  const retryGeolocation = () => {
    setError(null);
    setLocation(null);
    setMapCenter(null);
    setIsDemoLocation(false);
    setHospitals([]);
    setRecommendedHospitals([]);
    setShowPanel(false);
    setGeoAttempt((n) => n + 1);
  };

  const useDemoLocation = () => {
    setIsDemoLocation(true);
    setError(null);
    setIsTracking(true);
    setHospitals([]);
    setRecommendedHospitals([]);
    setShowPanel(false);
    const demo = { ...DEMO_LOCATION };
    setLocation(demo);
    setMapCenter(demo);
  };

  const fetchNearbyHospitals = async () => {
    if (!location) return;
    
    // Using Overpass API to fetch nearby hospitals (5km radius)
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:5000, ${location.lat}, ${location.lng});
        way["amenity"="hospital"](around:5000, ${location.lat}, ${location.lng});
        relation["amenity"="hospital"](around:5000, ${location.lat}, ${location.lng});
      );
      out center;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      const hospitalData = data.elements.map(el => {
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        const name = el.tags?.name || "Unknown Hospital";
        const address = el.tags?.["addr:street"] ? `${el.tags["addr:street"]} ${el.tags["addr:housenumber"] || ''}` : "Address not available";
        
        return {
          id: el.id,
          name,
          lat,
          lng: lon,
          address,
          distance: getDistance(location.lat, location.lng, lat, lon)
        };
      }).filter(h => h.lat && h.lng && h.name !== "Unknown Hospital");

      setHospitals(hospitalData);
      if (hospitalData.length > 0) {
        analyzeHospitalsWithGemini(hospitalData);
      }
    } catch (err) {
      console.error("Overpass API Error:", err);
    }
  };

  useEffect(() => {
    if (location && hospitals.length === 0) {
      fetchNearbyHospitals();
    }
  }, [location, hospitals.length]);

  async function analyzeHospitalsWithGemini(hospitalData) {
    if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY.includes('YOUR_')) {
      setGeminiError("Missing Gemini API Key in .env");
      return;
    }
    
    setIsAnalyzing(true);
    setGeminiError(null);
    setShowPanel(true);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Given this list of hospitals with their names, addresses, and distances, recommend the top 3 best hospitals for a pregnant mother or new mother with an infant. Consider proximity and assume typical maternity services. Return a ranked list with a brief reason for each.

Hospital List:
${JSON.stringify(hospitalData.map(h => ({ name: h.name, address: h.address, distance: h.distance })), null, 2)}

Return the response strictly in JSON format as an array of objects matching this structure: 
[
  { 
    "name": "Exact Hospital Name from list", 
    "rank": 1, 
    "reason": "Brief reason here" 
  }
]
Do not include any markdown formatting like \`\`\`json. Only output the raw JSON array.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      if(text.startsWith('```json')) {
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      }
      if(text.startsWith('```')) {
        text = text.replace(/```/g, '').trim();
      }
      
      const parsedRecommendations = JSON.parse(text);
      
      const mergedRecs = parsedRecommendations.map(rec => {
        const hospital = hospitalData.find(h => h.name.toLowerCase().includes(rec.name.toLowerCase()) || rec.name.toLowerCase().includes(h.name.toLowerCase()));
        return { ...rec, ...hospital };
      }).filter(h => h?.id); 
      
      setRecommendedHospitals(mergedRecs);
    } catch (err) {
      console.error("Gemini Analysis Error:", err);
      setGeminiError("Failed to analyze hospitals. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const flyToHospital = (h) => {
    setMapCenter({ lat: h.lat, lng: h.lng });
  };

  const handleSOS = () => {
    if (hospitals.length > 0) {
      const nearest = [...hospitals].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))[0];
      flyToHospital(nearest);
    }
  };

  const isRecommended = (id) => recommendedHospitals.some(h => h.id === id);
  const getRank = (id) => recommendedHospitals.find(h => h.id === id)?.rank;

  return (
    <section id="live-map" className="py-24 bg-white w-full scroll-mt-24">
      <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <span className="font-orbitron text-accent text-sm tracking-[0.2em] uppercase font-bold flex items-center gap-2">
            <Navigation size={16} className={isTracking ? 'animate-pulse text-accent' : ''} />
            Real-Time Resource Map
          </span>
          <h2 className="font-orbitron text-4xl font-bold text-text mt-2">Every second, we're finding help near you.</h2>
          
          {/* Live GPS Status Feed */}
          <div className="mt-4 min-h-[2rem] flex flex-col gap-2">
            {isDemoLocation && (
              <span className="text-xs font-sans font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg w-fit">
                Demo map position (San Francisco area) — hospitals shown are real OpenStreetMap data for that region.
              </span>
            )}
            {location && !error ? (
              <div className="flex flex-wrap gap-4 text-xs font-sans text-accent font-bold">
                <span className="glass px-3 py-1 rounded-full">LAT: {location.lat.toFixed(5)}</span>
                <span className="glass px-3 py-1 rounded-full">LNG: {location.lng.toFixed(5)}</span>
                <span className="glass px-3 py-1 rounded-full">ACCURACY: ±{Math.round(location.accuracy)}m</span>
                {location.speed > 0 && <span className="glass px-3 py-1 rounded-full">SPEED: {Math.round(location.speed * 3.6)} km/h</span>}
              </div>
            ) : error ? (
              <span className="text-xs text-red-600 font-sans max-w-2xl leading-relaxed">{error}</span>
            ) : (
              <span className="text-xs text-text-muted font-sans">
                {typeof window !== 'undefined' && !window.isSecureContext
                  ? 'Location requires HTTPS or localhost. Open this app at http://127.0.0.1:5173 (not a raw file or non-secure URL).'
                  : 'Locating you (Wi‑Fi / IP first, then GPS if available)…'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[520px] bg-surface relative overflow-hidden border-y border-border">
        {location ? (
          <MapContainer 
            center={[location.lat, location.lng]} 
            zoom={14} 
            zoomControl={false}
            style={{ height: "100%", width: "100%", zIndex: 10 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={mapCenter} zoomIn={zoomInTrigger} zoomOut={zoomOutTrigger} />

            {/* User Location Marker */}
            <Marker position={[location.lat, location.lng]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>

            {/* Hospital Markers */}
            {hospitals.map(h => {
              const recommended = isRecommended(h.id);
              return (
                <Marker
                  key={h.id}
                  position={[h.lat, h.lng]}
                  icon={getHospitalIcon(recommended)}
                  zIndexOffset={recommended ? 1000 : 10}
                >
                  <Popup>
                    <div className="p-1 font-sans">
                      <h4 className="font-bold text-sm text-gray-900 mb-1">{h.name}</h4>
                      
                      {recommended && (
                        <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded mb-2 font-bold">
                          <Star size={12} fill="currentColor" /> Gemini Recommended #{getRank(h.id)}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-600 space-y-1 mb-3">
                        <p>{h.distance} km away</p>
                        <p>{h.address}</p>
                      </div>
                      
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors no-underline"
                      >
                        <Navigation2 size={12} /> Get Directions
                      </a>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 z-20 px-6 text-center">
            {error ? (
              <>
                <ShieldAlert className="text-accent mb-3" size={36} aria-hidden />
                <p className="text-gray-700 font-sans text-sm max-w-md leading-relaxed mb-1">{error}</p>
                {typeof window !== 'undefined' && !window.isSecureContext && (
                  <p className="text-amber-800 font-sans text-xs max-w-md mb-4">
                    Geolocation only works in a secure context. Use the Vite dev URL (127.0.0.1 or localhost), not an opened HTML file.
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-sm justify-center">
                  <button
                    type="button"
                    onClick={retryGeolocation}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-accent text-accent font-orbitron text-xs font-bold hover:bg-accent/5 transition-colors"
                  >
                    <RefreshCw size={16} aria-hidden />
                    Retry location
                  </button>
                  <button
                    type="button"
                    onClick={useDemoLocation}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-orbitron text-xs font-bold hover:opacity-95 transition-opacity"
                  >
                    Use demo map
                  </button>
                </div>
              </>
            ) : (
              <>
                <Loader2 className="animate-spin text-accent mb-4" size={32} aria-hidden />
                <p className="text-gray-500 font-sans text-sm animate-pulse">Waiting for location…</p>
                <p className="text-gray-400 font-sans text-xs mt-2 max-w-xs">
                  Allow location when the browser asks. On desktop this may take up to 25 seconds.
                </p>
                <button
                  type="button"
                  onClick={useDemoLocation}
                  className="mt-6 text-xs font-orbitron font-bold text-accent underline-offset-2 hover:underline"
                >
                  Skip and use demo map
                </button>
              </>
            )}
          </div>
        )}

        {/* Gemini AI Side Panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur shadow-xl border-l border-gray-200 flex flex-col z-40"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/80">
                <h3 className="font-orbitron font-bold text-sm flex items-center gap-2">
                  <Star size={16} className="text-amber-500" fill="currentColor" />
                  AI Recommendations
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => analyzeHospitalsWithGemini(hospitals)} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors" title="Refresh Analysis">
                    <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
                  </button>
                  <button onClick={() => setShowPanel(false)} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-amber-200 rounded-full animate-pulse"></div>
                      <Loader2 size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 animate-spin" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Gemini is thinking...</p>
                      <p className="text-xs text-gray-500">Analyzing hospitals for maternal care</p>
                    </div>
                  </div>
                ) : geminiError ? (
                  <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                    {geminiError}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendedHospitals.map((h, i) => (
                      <div key={h.id || i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                              {h.rank}
                            </span>
                            <h4 className="font-bold text-sm text-gray-900 truncate max-w-[180px]">{h.name}</h4>
                          </div>
                          <span className="text-xs font-bold text-gray-500">{h.distance}km</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed">"{h.reason}"</p>
                        <div className="flex justify-between items-center">
                          <button 
                            onClick={() => flyToHospital(h)}
                            className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1"
                          >
                            View on Map <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SOS Button */}
        <button
          onClick={handleSOS}
          className="absolute bottom-6 left-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center z-30 transition-transform hover:scale-105 active:scale-95"
          title="SOS - Find Nearest Hospital"
        >
          <ShieldAlert size={24} />
        </button>

        {/* Floating Panel Toggle */}
        {!showPanel && hospitals.length > 0 && (
          <button
            onClick={() => setShowPanel(true)}
            className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 z-30 text-gray-700 hover:bg-gray-50"
          >
            <Star size={16} className="text-amber-500" fill="currentColor" /> Show AI Picks
          </button>
        )}

        {/* Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
          <button 
            onClick={() => {
              if (location) setMapCenter({...location});
            }}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors bg-white shadow-md ${isTracking ? 'text-blue-600 shadow-blue-500/20' : 'text-gray-600 hover:text-gray-900'}`}
            title="Recenter Map"
          >
            <Crosshair size={18}/>
          </button>
          <div className="bg-white shadow-md rounded-lg flex flex-col overflow-hidden">
            <button onClick={() => setZoomInTrigger(z => z + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 border-b border-gray-100"><Plus size={18}/></button>
            <button onClick={() => setZoomOutTrigger(z => z + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"><Minus size={18}/></button>
          </div>
        </div>
      </div>
      
      {/* Required for leafet custom icon animation */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        /* Leaflet popup overrides */
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
    </section>
  );
};

export default LiveMap;
