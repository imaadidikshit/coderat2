import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

export default function ChatWidget({ contextData }: { contextData: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('autoqa_chat');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('autoqa_chat', JSON.stringify(messages));
    }
    if (isOpen) {
       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    const newHistory: {role: 'user'|'model', text: string}[] = [...messages, { role: 'user', text: userText }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const credentials = {
        provider: localStorage.getItem('custom_provider') || 'system',
        model: localStorage.getItem('custom_model') || '',
        apiKey: localStorage.getItem('custom_api_key') || ''
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          previousMessages: messages,
          contextData,
          credentials
        })
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      
      if (data.fallbackTriggered) {
        localStorage.setItem('fallback_warning', data.fallbackMessage || 'Custom model failed when chatting.');
      } else {
        localStorage.removeItem('fallback_warning');
      }

      if (data.text) {
        setMessages([...newHistory, { role: 'model', text: data.text }]);
      }
    } catch (err) {
      setMessages([...newHistory, { role: 'model', text: "Error connecting to AI assistant." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 h-14 w-14 bg-indigo-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center text-white z-50 hover:bg-indigo-400 transition-colors"
          >
            <MessageSquare className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] max-w-[calc(100vw-3rem)] bg-[#0A0A0C] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden"
          >
             {/* Header */}
             <div className="flex items-center justify-between p-4 bg-indigo-500/10 border-b border-white/10">
               <div className="flex items-center gap-3">
                 <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                   <Bot className="h-5 w-5" />
                 </div>
                 <div>
                   <h3 className="text-white font-medium text-sm">Coderat Assistant</h3>
                   <p className="text-[10px] text-white/50 flex items-center gap-1">
                     <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full shadow-[0_0_5px_rgba(52,211,153,0.8)]" /> Online
                   </p>
                 </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
                  <X className="h-4 w-4" />
               </button>
             </div>

             {/* Messages Area */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                     <Bot className="h-12 w-12 mb-3 text-white/20" />
                     <p className="text-xs text-white/60">Ask me anything about the tests,<br/>detected routes, or performance.</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`h-6 w-6 rounded flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-white/10' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      {m.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    </div>
                    <div className={`text-sm px-4 py-2.5 rounded-xl max-w-[80%] whitespace-pre-wrap leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-indigo-500 text-white rounded-tr-sm' 
                        : 'bg-white/5 text-white/90 rounded-tl-sm border border-white/5'
                    }`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="text-sm px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/50 rounded-tl-sm flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="p-3 bg-black/40 border-t border-white/5">
                <form onSubmit={handleSend} className="relative flex items-center">
                   <input
                     type="text"
                     placeholder="Ask about the test results..."
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     className="w-full bg-[#1A1A1E] text-white text-sm rounded-xl pl-4 pr-12 py-3 border border-white/10 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-colors placeholder:text-white/20"
                     disabled={isLoading}
                   />
                   <button 
                     type="submit" 
                     disabled={!input.trim() || isLoading}
                     className="absolute right-2 p-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-30 transition-colors"
                   >
                      <Send className="h-4 w-4" />
                   </button>
                </form>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
