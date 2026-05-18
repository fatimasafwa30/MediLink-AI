import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Activity, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const AIEmergencyAssistant = () => {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedChips, setSelectedChips] = useState([]);
  const [inputText, setInputText] = useState("");
  const [geminiResults, setGeminiResults] = useState(null);
  const [error, setError] = useState(null);

  const chips = ['Chest Pain', 'Breathing', 'Bleeding', 'Unconscious', 'Stroke'];

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setAnalyzing(true);
    setError(null);
    setShowResults(false);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Analyze this medical emergency description: "${inputText}". 
      Based on the description, provide an immediate triage response formatted strictly as a JSON object with this exact structure:
      {
        "hospital": {
          "name": "Recommended facility type (e.g. Trauma Center)",
          "distance": "Estimated distance (e.g. 1.2 km)",
          "details": "Brief status (e.g. ICU Available)"
        },
        "specialist": {
          "name": "Specialist Type Needed (e.g. Cardiologist)",
          "specialty": "Department (e.g. Cardiology)",
          "experience": "Priority Level (e.g. High Priority)"
        },
        "action": {
          "title": "Immediate Action to take",
          "value": "Timeframe (e.g. NOW)"
        }
      }
      Only return the raw JSON object, without markdown formatting.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      if(text.startsWith('```json')) text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      if(text.startsWith('```')) text = text.replace(/```/g, '').trim();
      
      const parsed = JSON.parse(text);
      setGeminiResults(parsed);
      setShowResults(true);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze emergency. Please call emergency services immediately.");
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleChip = (chip) => {
    let newChips;
    if (selectedChips.includes(chip)) {
      newChips = selectedChips.filter(c => c !== chip);
      setInputText(inputText.replace(chip, '').replace(/,\s*$/, '').replace(/^,\s*/, '').replace(/,\s*,/g, ', ').trim());
    } else {
      newChips = [...selectedChips, chip];
      setInputText(inputText ? `${inputText}, ${chip}` : chip);
    }
    setSelectedChips(newChips);
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    // Optional: sync chips based on text typed, but usually keeping them separate is fine
  };

  // Web Speech API for Mic
  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
      };
      recognition.start();
    } else {
      alert("Microphone access is not supported in this browser.");
    }
  };

  return (
    <section className="py-24 bg-surface w-full overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <span className="font-orbitron text-accent text-sm tracking-[0.2em] uppercase font-bold">Core Intelligence</span>
          <h2 className="font-orbitron text-4xl font-bold text-text mt-2 relative inline-block">
            AI Emergency Assistant
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-[60px] h-[2px] bg-accent"></span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel */}
          <div className="w-full lg:w-1/2 glass p-6 lg:p-8 rounded-[20px] flex flex-col">
            <label className="font-orbitron text-accent text-sm mb-4 font-semibold">Describe your emergency</label>
            <textarea 
              className="w-full h-32 bg-transparent text-text font-sans resize-none focus:outline-none placeholder-accent/40"
              placeholder="e.g. severe chest pain, left arm numbness, difficulty breathing..."
              value={inputText}
              onChange={handleTextChange}
            ></textarea>
            
            <div className="flex flex-wrap gap-2 mb-8 mt-2">
              {chips.map(chip => (
                <button 
                  key={chip}
                  onClick={() => toggleChip(chip)}
                  className={`px-4 py-2 rounded-full font-sans text-sm border border-border transition-all ${selectedChips.includes(chip) ? 'bg-accent text-white' : 'glass hover:bg-accent/10 text-accent'}`}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex gap-4 mt-auto items-center">
              <button onClick={handleMicClick} className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white shrink-0 hover:scale-105 transition-transform" title="Use Voice Input">
                <Mic size={24} />
              </button>
              <button 
                onClick={handleAnalyze}
                disabled={analyzing || !inputText.trim()}
                className={`flex-1 bg-accent text-white font-orbitron font-bold py-4 rounded-xl relative overflow-hidden group transition-transform ${analyzing || !inputText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
              >
                <span className="relative z-10">{analyzing ? 'Processing...' : 'Analyze Emergency'}</span>
                {analyzing && <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 font-sans mt-4 text-center">{error}</p>}
            <p className="text-xs text-text-muted font-sans mt-4 text-center">
              AI analysis is assistive — always call emergency services for life-threatening situations
            </p>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-1/2 relative min-h-[400px]">
            {!showResults && !error && (
              <div className="absolute inset-0 flex flex-col gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-full h-32 rounded-[20px] border border-border ${analyzing ? 'skeleton-shimmer' : 'glass opacity-50'}`}></div>
                ))}
              </div>
            )}

            {showResults && geminiResults && (
              <div className="flex flex-col gap-4">
                {/* Hospital Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="glass p-5 rounded-[20px] border-l-4 border-l-accent flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Activity className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-text font-sans">{geminiResults.hospital?.name || "Nearest Emergency Center"}</h3>
                      <span className="text-accent font-orbitron font-bold text-sm">{geminiResults.hospital?.distance || "Calculating..."}</span>
                    </div>
                    <div className="flex gap-3 text-xs mt-2 font-sans">
                      <span className="flex items-center gap-1 text-green-600 font-semibold"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {geminiResults.hospital?.details || "Status clear"}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/map')}
                    className="bg-accent text-white px-4 py-2 rounded-lg font-orbitron text-xs font-bold whitespace-nowrap hover:scale-105 transition-transform"
                  >
                    Navigate →
                  </button>
                </motion.div>

                {/* Specialist Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass p-5 rounded-[20px] border-l-4 border-l-accent flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-accent to-rose-300 shrink-0">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-orbitron text-accent text-xs font-bold">ER</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-text font-sans">{geminiResults.specialist?.name || "Emergency Specialist"}</h3>
                    <div className="flex gap-2 mt-1 items-center">
                      <span className="bg-accent text-white text-[10px] px-2 py-1 rounded font-sans">{geminiResults.specialist?.specialty || "Trauma"}</span>
                      <span className="text-text-muted text-xs font-sans">{geminiResults.specialist?.experience || "Standby"}</span>
                    </div>
                  </div>
                  <button className="border border-accent text-accent px-4 py-2 rounded-lg font-orbitron text-xs font-bold whitespace-nowrap hover:bg-accent hover:text-white transition-colors">Connect</button>
                </motion.div>

                {/* Action Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-5 rounded-[20px] border-l-4 border-l-accent flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-text font-sans">{geminiResults.action?.title || "Immediate Action Required"}</h3>
                    <div className="font-orbitron text-xl text-accent font-bold mt-1">{geminiResults.action?.value || "NOW"}</div>
                  </div>
                  <button className="bg-text text-white px-4 py-2 rounded-lg font-orbitron text-xs font-bold whitespace-nowrap hover:scale-105 transition-transform">Get Help</button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIEmergencyAssistant;
