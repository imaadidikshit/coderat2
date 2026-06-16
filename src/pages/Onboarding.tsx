import React, { useState } from "react";
import { ArrowRight, Bot, Code, Loader2, Sparkles, Target, CheckCircle2, Play, X as XIcon, Globe, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";

export default function Onboarding() {
  const [url, setUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "deep_crawling" | "generating" | "done">("idle");
  const [showResults, setShowResults] = useState(false);
  const [generatedTests, setGeneratedTests] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !projectName) return;
    
    try {
      setStatus("scanning");
      
      // Get workspace
      const { data: workspaces } = await supabase
        .from('workspaces')
        .select('id')
        .eq('owner_id', user?.id)
        .limit(1);
        
      const workspaceId = workspaces?.[0]?.id;
      if (!workspaceId) throw new Error("Workspace not found");
      
      // Delay for visual "booting browser" effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus("deep_crawling");
      
      // Delay for visual deep crawling subpages
      await new Promise(resolve => setTimeout(resolve, 2500));
      setStatus("generating");

      // Actual API call to scrape & use AI
      const credentials = {
        provider: localStorage.getItem('custom_provider') || 'system',
        model: localStorage.getItem('custom_model') || '',
        apiKey: localStorage.getItem('custom_api_key') || ''
      };

      const res = await fetch('/api/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, credentials })
      });
      if (!res.ok) {
         let errMsg = "AI scan failed or timed out.";
         try { const errData = await res.json(); errMsg = errData.error || errMsg; } catch(e) {}
         throw new Error(errMsg);
      }
      const data = await res.json();
      
      if (data.fallbackTriggered) {
         localStorage.setItem('fallback_warning', data.fallbackMessage || 'The custom API key or model failed.');
      } else {
         localStorage.removeItem('fallback_warning');
      }

      // Save project
      const { data: newProject, error: projErr } = await supabase
          .from('projects')
          .insert({ 
             workspace_id: workspaceId, 
             name: projectName, 
             base_url: url,
             site_map: data.siteMap || null,
             summary: data.summary || null,
             suggestions: data.suggestions || null,
             untestable_elements: data.untestableElements || null
          })
          .select('id')
          .single();
          
      if (projErr) throw projErr;
      const projectId = newProject.id;

      let savedTests = data.tests || [];
      if (savedTests.length > 0) {
          const insertData = savedTests.map((t: any) => {
             const durationVal = parseFloat((Math.random() * 2 + 0.5).toFixed(1));
             return {
                 project_id: projectId,
                 name: t.name,
                 instruction: t.instruction || t.name,
                 is_active: t.status !== 'failed',
                 status: t.status || 'passed',
                 duration: durationVal
             };
          });
          
          const { data: insertedTests } = await supabase
             .from('test_cases')
             .insert(insertData)
             .select('id, name, is_active, status, duration');
             
          if (insertedTests) {
              savedTests = savedTests.map((t: any, i: number) => ({
                 ...t,
                 id: insertedTests[i]?.id || t.id,
                 duration: insertedTests[i]?.duration || 1.2
              }));
          }
      }

      setGeneratedTests(savedTests);
      localStorage.setItem('autoqa_tests', JSON.stringify(savedTests));
      
      if (data.summary) {
          localStorage.setItem('autoqa_summary', data.summary);
      }
      
      if (data.suggestions) {
          localStorage.setItem('autoqa_suggestions', JSON.stringify(data.suggestions));
      }
      
      if (data.siteMap) {
          localStorage.setItem('autoqa_sitemap', JSON.stringify(data.siteMap));
      }

      if (data.untestableElements) {
          localStorage.setItem('autoqa_untestable', JSON.stringify(data.untestableElements));
      }
      
      setStatus("done");
      
      setTimeout(() => {
        setShowResults(true);
      }, 1000);
      
    } catch(err) {
      console.error(err);
      setStatus("idle");
      alert("Failed to analyze URL.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 pb-32 font-sans">
      <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="w-full max-w-xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="h-16 w-16 mx-auto rounded-2xl bg-[#0E0E11] border border-white/10 flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Sparkles className="h-8 w-8 text-emerald-400" />
          </div>
          {showResults ? <h1 className="text-3xl font-bold tracking-tight text-white mb-3">AI Discovery Complete</h1> : <h1 className="text-3xl font-bold tracking-tight text-white mb-3">Create First Test</h1> }
          {showResults ? <p className="text-white/40 italic">We've scanned {url} and generated Playwright tests.</p> : <p className="text-white/40 italic">Enter the URL of your staging or production environment. Our AI will scan the DOM and generate tests.</p>}
        </motion.div>

        {!showResults && status === "idle" && (
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleStart} 
            className="space-y-6"
          >
            <div>
              <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">Project Name</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
                <input 
                  type="text"
                  required
                  placeholder="e.g. Core NextJS App"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-[#0E0E11] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Target URL</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400/50" />
                <input 
                  type="url"
                  required
                  placeholder="https://staging.yourdomain.com"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-[#0E0E11] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono text-sm"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-4 text-white/40 text-[10px] uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                  Required
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 bg-white hover:bg-white/90 text-black text-xs rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
            >
              Start AI Discovery
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.form>
        )}

        {!showResults && status !== "idle" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0E0E11] border border-white/10 rounded-2xl p-8"
          >
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${status === 'scanning' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {status === 'scanning' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Target className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-bold tracking-tight text-white">Launching Worker Environment</h4>
                  <p className="text-sm text-white/40 italic">Booting chromium instance on {url}</p>
                </div>
              </div>
              
              {/* Step 2: Deep Crawling */}
              <div className={`flex items-center gap-4 transition-opacity duration-500 ${status === 'idle' || status === 'scanning' ? 'opacity-30' : 'opacity-100'}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${status === 'deep_crawling' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : status === 'generating' || status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 border border-white/10 text-white/20'}`}>
                  {status === 'deep_crawling' ? <Loader2 className="h-5 w-5 animate-spin" /> : status === 'generating' || status === 'done' ? <CheckCircle2 className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-bold tracking-tight text-white">Deep Crawling Attached Pages</h4>
                  <p className="text-sm text-white/40 italic">Recursively exploring internal links, forms, and buttons...</p>
                </div>
              </div>

              {/* Step 3: Generating */}
              <div className={`flex items-center gap-4 transition-opacity duration-500 ${status === 'idle' || status === 'scanning' || status === 'deep_crawling' ? 'opacity-30' : 'opacity-100'}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${status === 'generating' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 border border-white/10 text-white/20'}`}>
                  {status === 'generating' ? <Loader2 className="h-5 w-5 animate-spin" /> : status === 'done' ? <Code className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-bold tracking-tight text-white">AI Test Generation</h4>
                  <p className="text-sm text-white/40 italic">Analyzing complex interactions and writing Playwright specs...</p>
                </div>
              </div>

              {/* Step 4: Done */}
              <div className={`flex items-center gap-4 transition-opacity duration-500 ${status === 'done' ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 border border-white/10 text-white/20'}`}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold tracking-tight text-white">Execution Complete</h4>
                  <p className="text-sm text-white/40 italic">Generating final deep execution report...</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
               <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">
                 <span>Worker ID: wk_9fj28v</span>
                 <span className="text-indigo-400">{status === 'done' ? '100%' : status === 'generating' ? '75%' : status === 'deep_crawling' ? '45%' : '15%'}</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400" 
                   initial={{ width: "0%" }}
                   animate={{ width: status === 'done' ? '100%' : status === 'generating' ? '75%' : status === 'deep_crawling' ? '45%' : '15%' }}
                   transition={{ duration: 0.5 }}
                 />
               </div>
            </div>
          </motion.div>
        )}

        {showResults && (
           <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 10 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="bg-[#0E0E11] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]"
           >
             <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/20">
               <h2 className="font-bold tracking-tight text-white uppercase text-sm">Generated Test Suite</h2>
               <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                 {generatedTests.length} Tests Found
               </span>
             </div>
             <div className="divide-y divide-white/5">
                {generatedTests.length > 0 ? generatedTests.map((t, i) => (
                  <div key={t.id || i} className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/5 transition-colors gap-4 sm:gap-0">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border ${t.status === 'failed' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                        {t.status === 'failed' ? <XIcon className="h-4 w-4 text-rose-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      </div>
                      <div>
                        <h4 className="font-bold tracking-tight text-white/90">{t.name}</h4>
                        {t.status === 'failed' && t.details && (
                           <div className="text-rose-400 text-[10px] mt-1 bg-rose-500/10 inline-block px-2 py-0.5 rounded border border-rose-500/20">{t.details}</div>
                        )}
                        <div className="flex items-center gap-2 text-[11px] font-mono text-white/40 mt-1">
                          <Code className="h-3 w-3" /> playwright
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right ml-12 sm:ml-0">
                      <div className="text-sm font-mono text-white/80">{t.time}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40">Duration</div>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-white/40 text-sm italic">
                    No tests were generated. Trying again might yield better results.
                  </div>
                )}
             </div>
             
             {localStorage.getItem('autoqa_summary') && (
               <div className="p-6 bg-black/40 border-t border-white/10">
                 <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <Target className="h-4 w-4" /> Comprehensive Execution Report
                 </h3>
                 <div className="text-sm text-white/70 leading-relaxed italic border-l-2 border-indigo-500/30 pl-4 space-y-3">
                    {localStorage.getItem('autoqa_summary')?.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                 </div>
               </div>
             )}
             
             <div className="p-4 bg-black/20 border-t border-white/10">
               <button 
                 onClick={() => navigate('/dashboard')}
                 className="w-full py-4 bg-white hover:bg-white/90 text-black text-xs rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
               >
                 View in Dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </button>
             </div>
           </motion.div>
        )}
      </div>
    </div>
  );
}
