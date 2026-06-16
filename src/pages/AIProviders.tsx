import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Key, AlertTriangle, CheckCircle2, Zap, BrainCircuit, Cpu, Circle, Globe, Sparkles, Send, Bot, User, Terminal, HelpCircle, X } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

import openaiWordmark from '../components/model_logos/openai_wordmark_dark.svg';
import claudeWordmark from '../components/model_logos/claude-ai-wordmark-icon_dark.svg';
import deepseekWordmark from '../components/model_logos/deepseek_wordmark.svg';
import geminiLogo from '../components/model_logos/gemini.svg';
import openRouterLogo from '../components/model_logos/openrouter_dark.svg';
import metaLogo from '../components/model_logos/meta.svg';
import aiStudioLogo from '../components/model_logos/google_ai_studio.svg';

const OpenAIIcon = (props: any) => <img src={openaiWordmark} alt="OpenAI" draggable="false" {...props} />;
const AnthropicIcon = (props: any) => <img src={claudeWordmark} alt="Claude" draggable="false" {...props} />;
const GeminiIcon = (props: any) => <img src={geminiLogo} alt="Gemini" draggable="false" {...props} />;
const DeepSeekIcon = (props: any) => <img src={deepseekWordmark} alt="DeepSeek" draggable="false" {...props} />;
const OpenRouterIcon = (props: any) => <img src={openRouterLogo} alt="OpenRouter" draggable="false" {...props} />;
const MetaIcon = (props: any) => <img src={metaLogo} alt="Meta" draggable="false" {...props} />;
const AIStudioIcon = (props: any) => <img src={aiStudioLogo} alt="AI Studio" draggable="false" {...props} />;

const CoderatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const providers = [
  {
    id: 'system',
    name: 'Coderat Managed',
    description: 'Managed model orchestration through Coderat infrastructure.',
    icon: CoderatIcon,
    color: 'emerald',
    models: [
      { id: 'coderat-fleet', name: 'Coderat Dynamic Fleet', context: 'Dynamic', speed: 'High', intelligence: 'Adaptive', desc: 'Automatically routes to the best model based on the task.' },
    ]
  },
  {
    id: 'google-aistudio',
    name: 'Google AI Studio',
    description: 'Direct API access to Google\'s Gemini models for developers.',
    icon: AIStudioIcon,
    color: 'cyan',
    models: [
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', context: '2M', speed: 'Fast', intelligence: 'Max', desc: 'Massive context window, excellent grounding and logic capabilities.' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', context: '1M', speed: 'Very Fast', intelligence: 'Very High', desc: 'Extreme speed with minimal quality loss.' },
      { id: 'gemini-2.0-pro-exp-02-05', name: 'Gemini 2.0 Pro Exp', context: '2M', speed: 'Moderate', intelligence: 'Max', desc: 'Pro experimental version.' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', context: '1M', speed: 'Fast', intelligence: 'High', desc: 'Current Flash default.' }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Advanced reasoning and large context windows.',
    icon: AnthropicIcon,
    color: 'orange',
    models: [
      { id: 'claude-4-8-opus', name: 'Claude 4.8 Opus (Preview)', context: '200k', speed: 'Slow', intelligence: 'Max', desc: 'Future iteration of the Anthropic flagship.' },
      { id: 'claude-4-7-sonnet', name: 'Claude 4.7 Sonnet (Preview)', context: '200k', speed: 'Fast', intelligence: 'Max', desc: 'Future iteration of the Anthropic workhorse.' },
      { id: 'claude-4-6-sonnet', name: 'Claude 4.6 Sonnet (Preview)', context: '200k', speed: 'Fast', intelligence: 'Max', desc: 'Future iteration of the Anthropic workhorse.' },
      { id: 'claude-4-5-opus', name: 'Claude 4.5 Opus (Preview)', context: '200k', speed: 'Slow', intelligence: 'Max', desc: 'Future iteration of the Anthropic flagship.' },
      { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', context: '200k', speed: 'Fast', intelligence: 'Max', desc: 'Hybrid reasoning model, state-of-the-art coding and agentic capabilities.' },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (v2)', context: '200k', speed: 'Fast', intelligence: 'Very High', desc: 'Highly capable model for complex reasoning and coding.' },
      { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet (v1)', context: '200k', speed: 'Fast', intelligence: 'High', desc: 'Original Claude 3.5 Sonnet.' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', context: '200k', speed: 'Very Fast', intelligence: 'Medium', desc: 'Fastest model for quick tasks and high-volume operations.' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', context: '200k', speed: 'Moderate', intelligence: 'High', desc: 'Powerful legacy model for complex analysis and multi-step tasks.' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', context: '200k', speed: 'Fast', intelligence: 'Medium', desc: 'Original Claude 3 Sonnet.' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', context: '200k', speed: 'Very Fast', intelligence: 'Low', desc: 'Fast generation.' },
      { id: 'claude-2.1', name: 'Claude 2.1', context: '200k', speed: 'Moderate', intelligence: 'Low', desc: 'Legacy Claude 2.1.' },
      { id: 'claude-2.0', name: 'Claude 2.0', context: '100k', speed: 'Moderate', intelligence: 'Low', desc: 'Legacy Claude 2.0.' }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'The industry standard. Fast and capable language models.',
    icon: OpenAIIcon,
    color: 'emerald',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', context: '128k', speed: 'Fast', intelligence: 'High', desc: 'Flagship multimodel for broad general intelligence tasks.' },
      { id: 'gpt-4o-2024-11-20', name: 'GPT-4o (Nov 2024)', context: '128k', speed: 'Fast', intelligence: 'High', desc: 'Specific Nov 2024 snapshot.' },
      { id: 'gpt-4o-2024-08-06', name: 'GPT-4o (Aug 2024)', context: '128k', speed: 'Fast', intelligence: 'High', desc: 'Specific Aug 2024 snapshot.' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', context: '128k', speed: 'Very Fast', intelligence: 'Medium', desc: 'Cost-effective, fast iteration for daily automated tasks.' },
      { id: 'gpt-4o-mini-2024-07-18', name: 'GPT-4o Mini (July 2024)', context: '128k', speed: 'Very Fast', intelligence: 'Medium', desc: 'Specific snapshot.' },
      { id: 'o3-mini', name: 'o3 Mini', context: '200k', speed: 'Moderate', intelligence: 'Very High', desc: 'Advanced reasoning model with flexible intelligence scaling.' },
      { id: 'o1', name: 'o1', context: '200k', speed: 'Slow', intelligence: 'Max', desc: 'Deep reinforcement learning model for extreme logical planning.' },
      { id: 'o1-preview', name: 'o1 Preview', context: '128k', speed: 'Slow', intelligence: 'Max', desc: 'Preview of the extreme logic planning pipeline.' },
      { id: 'o1-mini', name: 'o1 Mini', context: '128k', speed: 'Moderate', intelligence: 'High', desc: 'Faster reasoning model.' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', context: '128k', speed: 'Fast', intelligence: 'High', desc: 'Previous flagship.' },
      { id: 'gpt-4', name: 'GPT-4', context: '8k', speed: 'Moderate', intelligence: 'High', desc: 'Legacy GPT-4.' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', context: '16k', speed: 'Very Fast', intelligence: 'Low', desc: 'Legacy fast model.' },
    ]
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Native AI models built by Google DeepMind.',
    icon: GeminiIcon,
    color: 'sky',
    models: [
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', context: '2M', speed: 'Fast', intelligence: 'Max', desc: 'Massive context window, excellent grounding and logic capabilities.' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', context: '1M', speed: 'Very Fast', intelligence: 'Very High', desc: 'Extreme speed with minimal quality loss, ideal for real-time applications.' },
      { id: 'gemini-2.0-pro-exp-02-05', name: 'Gemini 2.0 Pro Experimental', context: '2M', speed: 'Moderate', intelligence: 'Max', desc: 'Pro experimental version.' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', context: '1M', speed: 'Fast', intelligence: 'High', desc: 'Current Flash default.' },
      { id: 'gemini-2.0-flash-lite-preview-02-05', name: 'Gemini 2.0 Flash Lite', context: '1M', speed: 'Very Fast', intelligence: 'Medium', desc: 'Ultra-fast edge model for light generation requirements.' },
      { id: 'gemini-2.0-flash-thinking-exp-01-21', name: 'Gemini 2.0 Flash Thinking', context: '1M', speed: 'Moderate', intelligence: 'Max', desc: 'Thinking experimental.' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', context: '2M', speed: 'Moderate', intelligence: 'High', desc: 'Previous generation flagship with massive context recall.' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', context: '1M', speed: 'Very Fast', intelligence: 'Medium', desc: 'Previous generation fast model.' },
      { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B', context: '1M', speed: 'Very Fast', intelligence: 'Low', desc: 'Small execution model.' },
      { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', context: '32k', speed: 'Moderate', intelligence: 'Low', desc: 'Legacy Gemini.' }
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'Highly efficient reasoning models.',
    icon: DeepSeekIcon,
    color: 'indigo',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3', context: '64k', speed: 'Fast', intelligence: 'High', desc: 'Strong open-weights chat base model.' },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1', context: '64k', speed: 'Moderate', intelligence: 'Max', desc: 'RL-trained logic and chain of thought execution.' },
    ]
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Unified API for all open source and proprietary models.',
    icon: OpenRouterIcon,
    color: 'purple',
    models: [
      { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', context: '200k', speed: 'Fast', intelligence: 'Max', desc: 'Via OpenRouter API mapping.' },
      { id: 'openai/o3-mini', name: 'o3 Mini', context: '200k', speed: 'Moderate', intelligence: 'Very High', desc: 'Via OpenRouter API mapping.' },
      { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', context: '64k', speed: 'Moderate', intelligence: 'Max', desc: 'Via OpenRouter API mapping.' },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', context: '128k', speed: 'Fast', intelligence: 'High', desc: 'Meta open weights workhorse.' },
      { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', context: '128k', speed: 'Very Fast', intelligence: 'Medium', desc: 'Meta open weights smaller model.' },
      { id: 'mistralai/mistral-large-2411', name: 'Mistral Large', context: '128k', speed: 'Fast', intelligence: 'Very High', desc: 'Mistral flagship.' },
      { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', context: '32k', speed: 'Very Fast', intelligence: 'Medium', desc: 'Mistral MoE.' },
      { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', context: '128k', speed: 'Fast', intelligence: 'High', desc: 'Qwen 2.5 flagship open weights.' },
      { id: 'qwen/qwen-2.5-coder-32b-instruct', name: 'Qwen 2.5 Coder 32B', context: '32k', speed: 'Fast', intelligence: 'High', desc: 'Excellent local-class coding capabilities.' },
      { id: 'x-ai/grok-2-1212', name: 'Grok 2', context: '128k', speed: 'Fast', intelligence: 'High', desc: 'xAI Grok 2.' },
      { id: 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free', name: 'Dolphin 3.0 R1 (Free)', context: '32k', speed: 'Moderate', intelligence: 'High', desc: 'Dolphin model.' },
      { id: 'google/gemini-2.0-flash-lite-preview-02-05:free', name: 'Gemini 2.0 Flash Lite (Free)', context: '1M', speed: 'Fast', intelligence: 'Medium', desc: 'Free tier on OR.' },
      { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder (Free)', context: '32k', speed: 'Fast', intelligence: 'High', desc: 'Free tier on OR.' }
    ]
  },
  {
    id: 'meta',
    name: 'Meta Llama',
    description: 'Open source foundational models from Meta.',
    icon: MetaIcon,
    color: 'blue',
    models: [
      { id: 'llama-3.3-70b-instruct', name: 'Llama 3.3 70B', context: '128k', speed: 'Fast', intelligence: 'High', desc: 'Powerful open source instruct model.' },
      { id: 'llama-3.1-8b-instruct', name: 'Llama 3.1 8B', context: '128k', speed: 'Very Fast', intelligence: 'Medium', desc: 'Fast open source model for lighter tasks.' }
    ]
  }
];

export default function AIProviders() {
  const [selectedProviderId, setSelectedProviderId] = useState('system');
  const [customModel, setCustomModel] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [showApiHelp, setShowApiHelp] = useState(false);

  // Playground state
  const [playgroundMsgs, setPlaygroundMsgs] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [playInput, setPlayInput] = useState('');
  const [isPlayLoading, setIsPlayLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prov = localStorage.getItem('custom_provider') || 'system';
    setSelectedProviderId(prov);
    setCustomModel(localStorage.getItem('custom_model') || '');
    setCustomApiKey(localStorage.getItem('custom_api_key') || '');
    setWarningMessage(localStorage.getItem('fallback_warning'));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [playgroundMsgs, isPlayLoading]);

  const handleProviderSelect = (provId: string) => {
    setSelectedProviderId(provId);
    setCustomModel(''); // Reset on change
    setShowApiHelp(false);
  };

  const handleModelSelect = (modelId: string) => {
    setCustomModel(modelId);
  };

  const handleSaveApiSettings = () => {
    localStorage.setItem('custom_provider', selectedProviderId);
    localStorage.setItem('custom_model', customModel);
    localStorage.setItem('custom_api_key', customApiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const selectedProvider = providers.find(p => p.id === selectedProviderId) || providers[0];

  const handlePlaygroundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playInput.trim() || isPlayLoading) return;
    
    const userMsg = playInput.trim();
    setPlayInput('');
    setPlaygroundMsgs(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsPlayLoading(true);

    try {
      const credentials = {
        provider: selectedProviderId,
        model: customModel,
        apiKey: customApiKey
      };

      const res = await fetch('/api/chat', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            message: userMsg + " (Answer concisely within 2 sentences, this is an API test in the playground).",
            previousMessages: playgroundMsgs,
            contextData: { summary: "System API Connection Test" },
            credentials
         })
      });
      const data = await res.json();
      
      if (data.fallbackTriggered) {
         setWarningMessage(data.fallbackMessage || 'Custom model failed. Fell back to system fleet.');
      } else {
         setWarningMessage(null);
      }

      setPlaygroundMsgs(prev => [...prev, { role: 'model', text: data.text || "No response generated." }]);
    } catch (err) {
      setPlaygroundMsgs(prev => [...prev, { role: 'model', text: "Error connecting to the API playground backend." }]);
    } finally {
      setIsPlayLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-black/20 backdrop-blur-sm z-10 shrink-0">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Model Garden</h2>
          <p className="text-[10px] text-white/50 tracking-widest mt-0.5">Customize your execution intelligence</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Top Provider Tabs */}
        <div className="bg-[#0A0A0C] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex overflow-x-auto hide-scrollbar py-6 gap-4 snap-x">
              {providers.map(provider => {
                const Icon = provider.icon;
                const isSelected = selectedProviderId === provider.id;
                
                return (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider.id)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl whitespace-nowrap transition-all border snap-start min-w-[200px] shrink-0
                      ${isSelected 
                        ? `bg-${provider.color}-500/10 border-${provider.color}-500/40 text-${provider.color}-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)]` 
                        : 'bg-black/20 border-white/5 text-white/50 hover:bg-white/5 hover:text-white/80'}`}
                  >
                    <Icon className="h-5 w-auto object-contain max-w-[120px]" />
                    <div className="text-left">
                      <div className={`text-sm font-bold tracking-tight ${isSelected ? 'text-white' : ''}`}>{provider.name}</div>
                      <div className="text-[10px] uppercase tracking-widest mt-0.5 opacity-60">Provider</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          
          {warningMessage && (
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-8 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 flex gap-4 text-rose-400 text-sm shadow-[0_0_20px_rgba(244,63,94,0.1)]"
            >
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1 uppercase tracking-wider text-xs">API Key Execution Error</h4>
                <p className="opacity-80 italic mb-2">{warningMessage}</p>
                <p className="opacity-80 text-xs">We fell back to the system fleet. If you are in the playground, this means your custom key failed.</p>
                <button 
                  onClick={() => {
                    localStorage.removeItem('fallback_warning');
                    setWarningMessage(null);
                  }}
                  className="mt-3 px-4 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded text-xs font-bold uppercase transition-colors"
                >
                  Dismiss Alert
                </button>
              </div>
            </motion.div>
          )}

          {/* Model Selection Horizontal Grid */}
          <div className="mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4A4A52] mb-6 flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Available Intelligence Models
            </h3>
            
            <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
              {selectedProvider.models.map(model => {
                const isSelectedModel = customModel === model.id || (selectedProviderId === 'system');
                return (
                  <button
                    key={model.id}
                    onClick={() => selectedProviderId !== 'system' && handleModelSelect(model.id)}
                    className={`relative shrink-0 w-[300px] snap-start text-left p-6 rounded-2xl border transition-all duration-300
                      ${selectedProviderId === 'system' 
                        ? 'bg-white/5 border-white/10 cursor-default opacity-80' 
                        : isSelectedModel
                          ? `bg-[#0E0E11] border-${selectedProvider.color}-500/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] scale-[1.02] z-10`
                          : 'bg-black/20 border-white/5 hover:border-white/15'
                      }`}
                  >
                    {isSelectedModel && selectedProviderId !== 'system' && (
                      <div className={`absolute top-4 right-4 text-${selectedProvider.color}-400`}>
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    )}
                    
                    <h4 className="text-base font-bold text-white mb-2">{model.name}</h4>
                    <p className="text-xs text-white/50 leading-relaxed mb-6 h-10">{model.desc}</p>
                    
                    <div className="grid grid-cols-3 gap-2">
                       <div className="bg-black/40 border border-white/5 rounded-lg p-2 text-center">
                         <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Context</div>
                         <div className="text-xs font-mono text-white/80">{model.context}</div>
                       </div>
                       <div className="bg-black/40 border border-white/5 rounded-lg p-2 text-center">
                         <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Speed</div>
                         <div className="text-xs font-mono text-white/80">{model.speed}</div>
                       </div>
                       <div className="bg-black/40 border border-white/5 rounded-lg p-2 text-center">
                         <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Intelligence</div>
                         <div className="text-xs font-mono text-white/80">{model.intelligence}</div>
                       </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Configuration Form */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
               <h3 className="text-lg font-bold tracking-tight text-white mb-2">Connection Settings</h3>
               <p className="text-xs text-white/40 mb-8">Securely configure your localized execution keys.</p>

               {selectedProviderId !== 'system' && (
                  <div className="space-y-6 mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <label className="block text-[10px] font-bold text-white/60 shadow-inner uppercase tracking-widest mb-0">API Key</label>
                        <button 
                          onClick={() => setShowApiHelp(!showApiHelp)} 
                          className={`text-white/40 hover:text-white/80 transition-colors ${showApiHelp ? 'text-white/80' : ''}`}
                        >
                          <HelpCircle className="h-3 w-3" />
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {showApiHelp && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white/70 flex flex-col gap-1 overflow-hidden"
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span className="text-white/90">How to get a {selectedProvider.name} API Key</span>
                              <button onClick={() => setShowApiHelp(false)} className="text-white/40 hover:text-white">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="mt-1 leading-relaxed">
                              {selectedProviderId === 'google-aistudio' && 'Go to aistudio.google.com/app/apikey to generate a key.'}
                              {selectedProviderId === 'openai' && 'Visit platform.openai.com > Settings > API Keys to create your key.'}
                              {selectedProviderId === 'anthropic' && 'Go to console.anthropic.com > Settings > API Keys to generate a new key.'}
                              {selectedProviderId === 'deepseek' && 'Create a key at platform.deepseek.com under the API Keys section.'}
                              {selectedProviderId === 'openrouter' && 'Head to openrouter.ai/keys to generate your API token.'}
                              {selectedProviderId === 'gemini' && 'Use Google Cloud Console via Vertex AI to generate an API key mapping to Gemini, or use AI Studio if you want free credentials.'}
                              {selectedProviderId === 'meta' && 'Direct API access is not provided by Meta. You can use OpenRouter or replicate keys here if your middle-ware supports it.'}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="relative">
                        <input 
                          type="password"
                          value={customApiKey}
                          onChange={(e) => setCustomApiKey(e.target.value)}
                          placeholder={`Enter your ${selectedProvider.name} API key...`}
                          className="w-full pl-12 pr-4 py-4 bg-black border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 text-sm font-mono transition-colors"
                        />
                        <Key className="absolute left-4 top-4 h-5 w-5 text-white/30" />
                      </div>
                      <p className="mt-2 text-[10px] text-white/30 italic">Locally stored, never persisted to external databases.</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Custom Model Overlay (Optional)</label>
                      <input 
                        type="text"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder="e.g. gpt-4-turbo-preview or open-source id..."
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white/80 placeholder:text-white/20 focus:outline-none focus:border-white/30 text-xs font-mono transition-colors"
                      />
                    </div>
                  </div>
               )}

               <div className="flex items-center justify-between mt-auto">
                 <AnimatePresence>
                    {isSaved && (
                       <motion.div
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0 }}
                         className={`text-${selectedProvider.color || 'white'}-400 text-xs font-bold uppercase flex items-center gap-1`}
                       >
                         <CheckCircle2 className="h-4 w-4" /> Identity Executed
                       </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button 
                    onClick={handleSaveApiSettings}
                    className="ml-auto px-8 py-3 bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                  >
                    Save Context <ArrowRight className="h-4 w-4" />
                  </button>
               </div>
            </div>

            {/* Test Connection Playground */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-8 flex flex-col h-[400px]">
               <div className="flex items-center gap-2 mb-6 text-emerald-400">
                 <Terminal className="h-5 w-5" />
                 <h3 className="text-sm font-bold uppercase tracking-widest">Connectivity Playground</h3>
               </div>
               
               <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                  {playgroundMsgs.length === 0 ? (
                     <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <Bot className="h-8 w-8 text-white/10 mx-auto mb-3" />
                          <p className="text-xs text-white/30 font-mono tracking-wide">Playground Idle.<br/>Save your keys and test the connection.</p>
                        </div>
                     </div>
                  ) : (
                     playgroundMsgs.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[85%] rounded-2xl p-3 px-4 text-sm ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-black border border-white/10 text-emerald-100 font-mono text-[11px] leading-relaxed'}`}>
                              <div className="flex items-center gap-2 mb-1 opacity-50 text-[9px] uppercase tracking-widest">
                                 {msg.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                 {msg.role}
                              </div>
                              {msg.text}
                           </div>
                        </div>
                     ))
                  )}
                  {isPlayLoading && (
                     <div className="flex justify-start">
                        <div className="bg-black border border-white/10 text-white/50 font-mono text-[11px] rounded-2xl p-3 px-4 flex items-center gap-2">
                           <Zap className="h-3 w-3 animate-pulse text-emerald-400" /> Awaiting Telemetry...
                        </div>
                     </div>
                  )}
                  <div ref={chatEndRef} />
               </div>

               <form onSubmit={handlePlaygroundSubmit} className="relative mt-auto">
                 <input
                   type="text"
                   value={playInput}
                   onChange={(e) => setPlayInput(e.target.value)}
                   disabled={isPlayLoading}
                   placeholder={selectedProviderId === 'system' ? "Test the system default model..." : "Ping your custom model key..."}
                   className="w-full pl-4 pr-12 py-3 bg-black border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 disabled:opacity-50 transition-colors"
                 />
                 <button 
                   type="submit"
                   disabled={isPlayLoading || !playInput.trim()}
                   className="absolute right-2 top-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors disabled:opacity-50"
                 >
                   <Send className="h-4 w-4" />
                 </button>
               </form>
            </div>
          </div>

        </div>
      </div>

    </DashboardLayout>
  );
}
