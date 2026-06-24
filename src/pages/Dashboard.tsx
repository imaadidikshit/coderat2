import React, { useState, useEffect } from "react";
import { CheckCircle2 as CheckIcon, Code, Loader2, MoreVertical, Play, Search, X as XIcon, Zap, Target, Lightbulb, ExternalLink, Bot, Sparkles, Trash2, FileText, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import TestDrawer from "../components/TestDrawer";
import SiteVisualizer from "../components/SiteVisualizer";
import ChatWidget from "../components/ChatWidget";
import OnboardingTourModal from "../components/OnboardingTourModal";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [siteMap, setSiteMap] = useState<any>(null);
  const [untestableElements, setUntestableElements] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [drawerTab, setDrawerTab] = useState<'log' | 'code'>('log');
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [loadingTests, setLoadingTests] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [projectName, setProjectName] = useState<string>("Core App (Staging)");
  const [hasProjects, setHasProjects] = useState(true);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadDataFromSupabase = async () => {
    if (!user) return;
    try {
      setLoadingTests(true);
      
      // Check for first-time tour
      const { data: userData } = await supabase.from('users').select('has_seen_tour').eq('id', user.id).single();
      if (userData && userData.has_seen_tour === false) {
          setShowTour(true);
      }
      
      // Get workspace
      const { data: workspaces, error: workspaceError } = await supabase
        .from('workspaces')
        .select('id')
        .eq('owner_id', user.id);
        
      if (workspaces && workspaces.length > 0) {
        const workspaceId = workspaces[0].id;
        
        // Pick first project
        let { data: projects } = await supabase
          .from('projects')
          .select('id, name, site_map, summary, suggestions, untestable_elements')
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false });
          
        if (projects) {
          projects = projects.filter(p => !p.name.includes('Core App (Staging)'));
        }
          
        if (!projects || projects.length === 0) {
           setHasProjects(false);
           setTests([]);
           setSiteMap(null);
           setSuggestions([]);
           setUntestableElements([]);
           return;
        }

        setHasProjects(true);
        const project = projects[0];
        const projectId = project.id;
        setProjectName(project.name);
        
        if (project.site_map) {
            setSiteMap(project.site_map);
        } else {
            const localMap = localStorage.getItem('autoqa_sitemap');
            if (localMap) {
                try { setSiteMap(JSON.parse(localMap)); } catch (e) {}
            } else {
                setSiteMap(null);
            }
        }
        
        if (project.summary) {
            localStorage.setItem('autoqa_summary', project.summary);
        }

        if (project.suggestions) {
            setSuggestions(project.suggestions);
        } else {
            const localSugg = localStorage.getItem('autoqa_suggestions');
            if (localSugg) {
                try { setSuggestions(JSON.parse(localSugg)); } catch (e) {}
            } else {
                setSuggestions([]);
            }
        }
        
        if (project.untestable_elements) {
            setUntestableElements(project.untestable_elements);
        } else {
            const localUn = localStorage.getItem('autoqa_untestable');
            if (localUn) {
                try { setUntestableElements(JSON.parse(localUn)); } catch (e) {}
            } else {
                setUntestableElements([]);
            }
        }
        
        // Fetch test cases for this project
        const { data: testCases } = await supabase
          .from('test_cases')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        
        if (testCases && testCases.length > 0) {
          setTests(testCases.map(tc => {
            const parsedDuration = tc.duration ? Number(tc.duration) : 1.2;
            return {
              id: tc.id,
              name: tc.name,
              instruction: tc.instruction,
              status: tc.status || (tc.is_active ? 'passed' : 'failed'),
              time: `${parsedDuration.toFixed(1)}s`,
              durationVal: parsedDuration,
              latestRun: new Date(tc.updated_at).toLocaleString(),
              project_id: tc.project_id
            };
          }));
        } else {
          // local fallback or empty
          const localTests = localStorage.getItem('autoqa_tests');
          if (localTests) {
              try { setTests(JSON.parse(localTests)); } catch (e) { setTests([]); }
          } else {
              setTests([]);
          }
        }
      }
    } catch(err) {
      console.error("Supabase Error:", err);
    } finally {
      setLoadingTests(false);
    }
  };

  useEffect(() => {
    if (user) {
        loadDataFromSupabase();
    }
  }, [user]);

  const handleRunAll = () => {
    setIsRunningAll(true);
    // ... Mock logic visually
    setTimeout(() => {
      setIsRunningAll(false);
    }, 2000);
  };

  const handleRunSingleTest = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Simulate real runner by adding loading state
    setTests(prev => prev.map(t => t.id === id ? { ...t, status: 'running' } : t));
    setTimeout(() => {
      setTests(prev => prev.map(t => t.id === id ? { ...t, status: 'passed', time: '1.2s', latestRun: 'just now' } : t));
    }, 2000);
  };

  const handleGenerateCustomTest = async () => {
    if (!customPrompt.trim() || !user) return;
    setIsGeneratingCustom(true);
    
    try {
      const { data: projects } = await supabase
         .from('projects')
         .select('id')
         .limit(1);
         
      if (projects && projects[0]) {
         const { data: newTestCase, error } = await supabase
            .from('test_cases')
            .insert({
               project_id: projects[0].id,
               name: "Custom Agent Test",
               instruction: customPrompt,
               is_active: true
            })
            .select()
            .single();
            
         if (newTestCase) {
             setTests(prev => [{
               id: newTestCase.id,
               name: newTestCase.name,
               instruction: newTestCase.instruction,
               status: 'passed',
               time: '0.0s',
               latestRun: 'Just created'
             }, ...prev]);
         }
      }
      setCustomPrompt("");
      setShowCustomPrompt(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  const handleDeleteTest = async (id: string) => {
    setTests(prev => prev.filter(t => t.id !== id));
    await supabase.from('test_cases').delete().eq('id', id);
  };

  return (
    <DashboardLayout>
      {!hasProjects ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
           <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
           <div className="relative z-10 max-w-md text-center">
             <div className="h-20 w-20 mx-auto bg-[#0E0E11] border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/10">
                <Target className="h-10 w-10 text-white/20" />
             </div>
             <h2 className="text-2xl font-bold tracking-tight text-white mb-4">No Projects Yet</h2>
             <p className="text-white/40 text-sm mb-8 leading-relaxed">
               Get started by adding your first project. Our autonomous agent will analyze your application and generate a complete E2E test suite automatically.
             </p>
             <Link 
               to="/onboarding"
               className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
             >
               Create First Project
             </Link>
           </div>
        </div>
      ) : (
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-[0%] right-[0%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-black/20 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold tracking-tight text-white">{projectName}</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search tests..." 
                className="pl-9 pr-4 py-1.5 bg-[#0E0E11] border border-white/10 rounded-full text-sm focus:outline-none focus:border-indigo-400 text-white placeholder:text-white/40 transition-colors"
              />
            </div>
            <button 
              onClick={handleRunAll}
              disabled={isRunningAll}
              className="px-4 py-1.5 bg-white hover:bg-white/90 disabled:opacity-50 disabled:hover:bg-white text-black rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              {isRunningAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {isRunningAll ? "Running..." : "Run All Tests"}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 z-10">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-[#0E0E11] border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 relative z-10">Total Tests</div>
                <div className="text-3xl font-mono font-bold text-white relative z-10">{tests.length}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0E0E11] border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-2 relative z-10">Pass Rate</div>
                <div className="text-3xl font-mono font-bold text-emerald-400 relative z-10">
                  {Math.round((tests.filter(t => t.status === 'passed').length / tests.length) * 100) || 0}%
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0E0E11] border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 relative z-10">Avg Run Time</div>
                <div className="text-3xl font-mono font-bold text-white relative z-10">{tests.length > 0 ? (tests.reduce((acc, t) => acc + (t.durationVal || 1.2), 0) / tests.length).toFixed(1) + 's' : '0.0s'}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0E0E11] border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[10px] font-bold text-indigo-400/60 uppercase tracking-widest mb-2 relative z-10">Runs this month</div>
                <div className="text-3xl font-mono font-bold text-white relative z-10">{tests.length > 0 ? tests.length * 3 : 0} <span className="text-sm text-white/20 font-sans">/ 250</span></div>
              </div>
            </div>

            {/* Topology / Site Map */}
            {siteMap && <SiteVisualizer siteMap={siteMap} />}

            {/* Execution Report / Summary */}
            {localStorage.getItem('autoqa_summary') && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Summary */}
                <div className="lg:col-span-2 bg-[#0E0E11] border border-indigo-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(99,102,241,0.05)] relative overflow-hidden flex flex-col">
                   <div className="absolute top-0 right-0 p-4 -mt-4 opacity-10">
                     <Zap className="h-40 w-40 text-indigo-500" />
                   </div>
                   <div className="relative z-10 flex-1">
                     <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Target className="h-4 w-4" /> AI Deep Crawl Execution Report
                     </h2>
                     <div className="text-sm text-white/80 leading-relaxed font-sans space-y-4">
                        {localStorage.getItem('autoqa_summary')?.split('\n').map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                     </div>
                   </div>
                </div>

                {/* Insights Column */}
                <div className="flex flex-col gap-6">
                  {/* Developer Insights */}
                  <div className="bg-[#0E0E11] border border-emerald-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(52,211,153,0.05)] relative flex-1">
                     <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                       <Lightbulb className="h-4 w-4" /> Recommended Fixes
                     </h2>
                     <div className="space-y-4">
                       {suggestions.length > 0 ? suggestions.map((suggestion, idx) => (
                         <div key={idx} className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                           <CheckIcon className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                           <span className="text-xs text-white/70 leading-relaxed">{suggestion}</span>
                         </div>
                       )) : (
                         <div className="text-xs text-white/40 italic">No recommendations mapped for these routes.</div>
                       )}
                     </div>
                  </div>

                  {/* Untestable Elements Block */}
                  {untestableElements.length > 0 && (
                    <div className="bg-[#0E0E11] border border-amber-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(245,158,11,0.05)] relative overflow-hidden flex-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400/80 mb-4 flex items-center gap-2 sticky top-0 bg-[#0E0E11] py-1 z-10">
                        <AlertTriangle className="h-4 w-4" /> Excluded Elements
                      </h2>
                      <p className="text-[10px] text-white/40 mb-4 leading-relaxed font-sans">
                        Elements identified but flagged as un-testable in automated E2E conditions.
                      </p>
                      <div className="space-y-3">
                        {untestableElements.map((item, idx) => (
                          <div key={idx} className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
                             <div className="font-mono text-[10px] text-amber-200 mb-1 leading-snug">{item.element}</div>
                             <div className="text-[10px] text-amber-100/60 leading-relaxed font-sans">{item.reason}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Test List */}
            <div className="bg-[#0E0E11] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div className="px-6 py-4 border-b border-white/10 flex flex-col gap-4 bg-black/20">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold tracking-tight text-white uppercase text-sm flex items-center gap-2">
                    <Code className="h-4 w-4 text-indigo-400" /> Generated End-to-End Tests
                  </h2>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                      className="text-[10px] px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                      <Bot className="h-3 w-3" /> Custom Prompt To Test
                    </button>
                    <div className="h-4 w-px bg-white/10 hidden sm:block" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 hidden sm:block">{tests.length} tests mapped</span>
                  </div>
                </div>
                
                {showCustomPrompt && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2"
                  >
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={customPrompt}
                        onChange={e => setCustomPrompt(e.target.value)}
                        placeholder="e.g. 'Test the checkout flow with invalid credit card details'" 
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                        onKeyDown={e => e.key === 'Enter' && handleGenerateCustomTest()}
                        disabled={isGeneratingCustom}
                      />
                    </div>
                    <button 
                      onClick={handleGenerateCustomTest}
                      disabled={isGeneratingCustom || !customPrompt.trim()}
                      className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    >
                      {isGeneratingCustom ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Generate Test
                    </button>
                  </motion.div>
                )}
              </div>
              <div className="divide-y divide-white/5">
                {tests.map((test) => (
                  <motion.div 
                    key={test.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => { setDrawerTab('log'); setSelectedTest(test); }}
                    className="p-4 px-6 hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {test.status === 'passed' ? (
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <CheckIcon className="h-4 w-4 text-emerald-400" />
                        </div>
                      ) : test.status === 'failed' ? (
                        <div className="h-8 w-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                          <XIcon className="h-4 w-4 text-rose-400" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                          <div className="h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold tracking-tight text-white/90">{test.name}</h4>
                        {test.status === 'failed' && test.details && (
                           <div className="text-rose-400 text-[10px] mt-1 bg-rose-500/10 inline-block px-2 py-0.5 rounded border border-rose-500/20">{test.details}</div>
                        )}
                        <div className="flex items-center gap-3 text-[11px] font-mono text-white/40 mt-1">
                          <span className="flex items-center gap-1"><ExternalLink className="h-3 w-3" /> E2E Trace</span>
                          <span>•</span>
                          <span className="italic">latest run: {test.status === 'running' ? 'Running...' : test.latestRun}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm font-mono text-white/80">{test.time}</div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40">Duration</div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-full text-white/40 transition-colors disabled:opacity-50" 
                          title="Run Test"
                          disabled={test.status === 'running'}
                          onClick={(e) => handleRunSingleTest(e, test.id)}
                        >
                          <Play className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button 
                            className={`p-2 rounded-full transition-colors ${activeMenu === test.id ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/40 hover:text-white'}`}
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === test.id ? null : test.id); }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {activeMenu === test.id && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-[#1A1A1E] border border-white/10 rounded-xl shadow-2xl py-1 z-20">
                              <button 
                                className="w-full text-left px-4 py-2 text-xs text-white/80 hover:bg-white/5 flex items-center gap-3 transition-colors" 
                                onClick={(e) => { e.stopPropagation(); setDrawerTab('log'); setSelectedTest(test); setActiveMenu(null); }}
                              >
                                <FileText className="h-3.5 w-3.5" /> View Logs
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 text-xs text-white/80 hover:bg-white/5 flex items-center gap-3 transition-colors" 
                                onClick={(e) => { e.stopPropagation(); setDrawerTab('code'); setSelectedTest(test); setActiveMenu(null); }}
                              >
                                <Code className="h-3.5 w-3.5" /> View Code
                              </button>
                              <div className="h-px bg-white/10 my-1 mx-2" />
                              <button 
                                className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-3 transition-colors" 
                                onClick={(e) => { e.stopPropagation(); handleDeleteTest(test.id); setActiveMenu(null); }}
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete Test
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </main>
        
        <TestDrawer 
          test={selectedTest || (tests.find(t => t.id === selectedTest?.id))} 
          isOpen={!!selectedTest} 
          onClose={() => setSelectedTest(null)} 
          initialTab={drawerTab}
        />
        <ChatWidget contextData={{ summary: localStorage.getItem('autoqa_summary'), tests, suggestions, siteMap, untestableElements }} />
      </div>
      )}
      {showTour && <OnboardingTourModal onComplete={() => setShowTour(false)} />}
    </DashboardLayout>
  );
}
