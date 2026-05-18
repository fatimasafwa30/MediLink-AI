import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, Globe } from 'lucide-react';

const ChatBot = ({ chatData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Simulate initial load of chat history
      const loadMessages = async () => {
        for (let i = 0; i < chatData.length; i++) {
          if (chatData[i].sender === 'ai') {
            setIsTyping(true);
            await new Promise(r => setTimeout(r, 1000));
            setIsTyping(false);
          }
          setMessages(prev => [...prev, chatData[i]]);
          await new Promise(r => setTimeout(r, 500));
        }
      };
      loadMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    // Simulate AI reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'ai', text: "I've received your update. Monitoring your vitals closely. Help is en route." }]);
    }, 2000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-[9900] w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] group transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <div className="absolute inset-0 rounded-full border border-white/30 animate-[spin_8s_linear_infinite]"></div>
        <span className="font-orbitron font-bold text-white text-xl group-hover:hidden">R</span>
        <span className="font-sans font-bold text-white text-xs hidden group-hover:block whitespace-nowrap px-2">Chat with Red</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-0 left-0 md:bottom-6 md:left-6 z-[9950] w-full md:w-[400px] h-[90vh] md:h-[600px] max-h-[100vh] glass rounded-t-[24px] md:rounded-[24px] flex flex-col overflow-hidden shadow-2xl border border-accent/20"
          >
            {/* Header */}
            <div className="p-4 bg-white border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border border-white/50 animate-ping"></div>
                  <span className="font-orbitron font-bold text-white text-lg">R</span>
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-text flex items-center gap-2">
                    Red <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  </h3>
                  <p className="font-sans text-xs text-text-muted">AI Medical Companion</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-accent p-2">
                <X size={20} />
              </button>
            </div>

            {/* Voice Waveform Simulator (listening state visually) */}
            <div className="h-6 bg-surface border-b border-border flex items-center justify-center gap-1">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="w-1 bg-accent/30 rounded-full animate-waveform" style={{ animationDelay: `${i*0.2}s` }}></div>
               ))}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface/50 hide-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0 mr-2 mt-auto mb-1">
                      <span className="font-orbitron font-bold text-white text-[10px]">R</span>
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 font-sans text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-accent text-white rounded-br-sm' 
                      : 'bg-white text-text border-l-2 border-accent shadow-sm rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start items-end">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0 mr-2 mb-1">
                    <span className="font-orbitron font-bold text-white text-[10px]">R</span>
                  </div>
                  <div className="bg-white border-l-2 border-accent shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center h-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-border shrink-0">
              <div className="flex items-center gap-2 relative">
                <button className="p-2 text-text-muted hover:text-accent transition-colors"><Globe size={20}/></button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type or speak to Red..." 
                  className="flex-1 bg-surface border border-border focus:border-accent rounded-full px-4 py-2 font-sans text-sm focus:outline-none transition-colors"
                />
                <button className="absolute right-12 p-2 text-accent"><Mic size={18}/></button>
                <button onClick={handleSend} className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shrink-0"><Send size={16}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
