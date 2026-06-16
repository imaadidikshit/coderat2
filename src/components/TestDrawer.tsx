import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Code, CheckCircle2, Clock, Terminal, ShieldAlert } from 'lucide-react';

interface TestDrawerProps {
  test: any;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'log' | 'code';
}

export default function TestDrawer({ test, isOpen, onClose, initialTab }: TestDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<'log' | 'code'>(initialTab || 'log');

  React.useEffect(() => {
    if (isOpen && initialTab) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  if (!test) return null;

  const stepsToRender = test.steps && test.steps.length > 0 ? test.steps : [
    { id: 1, action: "goto", target: `'${test.targetUrl || '/'}'`, status: "passed", time: (parseFloat(test.time || "2.1") * 0.4).toFixed(1) + "s" },
    { id: 2, action: "log", target: `'Executing simulated actions for test: ${test.name.replace(/'/g, "\\'")}'`, status: "passed", time: "0.1s" },
    { id: 3, action: "expect", target: "page.locator('body').toBeVisible()", status: test.status, time: (parseFloat(test.time || "2.1") * 0.5).toFixed(1) + "s" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 w-full max-w-xl h-full bg-[#0E0E11] border-l border-white/10 z-50 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-black/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${test.status === 'passed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : test.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                  <Code className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                    {test.name}
                    {test.status === 'running' && (
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-400 animate-pulse">Running</span>
                    )}
                  </h2>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">ID: TST-{test.id}042</div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-[#0E0E11] flex flex-col">
              <div className="flex border-b border-white/10 px-6 mt-4 shrink-0">
                <button 
                  className={`pb-3 px-2 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'log' ? 'border-indigo-500 text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}
                  onClick={() => setActiveTab('log')}
                >
                  <Terminal className="h-4 w-4 inline-block mr-2" /> Execution Log
                </button>
                <button 
                  className={`pb-3 px-2 ml-6 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'code' ? 'border-indigo-500 text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}
                  onClick={() => setActiveTab('code')}
                >
                  <Code className="h-4 w-4 inline-block mr-2" /> View Code
                </button>
              </div>

              <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                {/* Status Bar */}
                <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-bold">Status</div>
                    <div className="flex items-center gap-2 text-sm font-bold">
                      {test.status === 'passed' ? (
                        <><CheckCircle2 className="h-4 w-4 text-emerald-400" /><span className="text-emerald-400 uppercase">Passed</span></>
                      ) : test.status === 'failed' ? (
                        <><ShieldAlert className="h-4 w-4 text-rose-400" /><span className="text-rose-400 uppercase">Failed</span></>
                      ) : (
                        <><div className="h-4 w-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" /><span className="text-indigo-400 uppercase">Running</span></>
                      )}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-bold">Duration</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
                      <Clock className="h-4 w-4 text-white/40" />
                      {test.time}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-bold">Environment</div>
                    <div className="text-sm font-bold text-white font-mono">Staging</div>
                  </div>
                </div>

                {/* Main Tab Content */}
                <div className="relative">
                  {test.status === 'running' && (
                    <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Executing Playwright...</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'log' ? (
                    <>
                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Terminal className="h-4 w-4" /> Playwright Execution Trace
                      </h3>
                      <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden font-mono text-[11px] shadow-inner mb-6">
                        {stepsToRender.map((step: any, idx: number) => (
                          <div key={step.id || idx} className={`flex items-start gap-4 p-3 border-b border-white/5 last:border-0 ${step.status === 'failed' ? 'bg-rose-500/5' : 'hover:bg-white/5'} transition-colors`}>
                            <div className="text-white/20 select-none">{String(idx + 1).padStart(2, '0')}</div>
                            <div className="flex-1">
                              <span className="text-indigo-400">await</span> <span className="text-white/80">page.{step.action}</span><span className="text-white/40">(</span><span className="text-emerald-400/80">{step.target}</span><span className="text-white/40">)</span>
                              {step.status === 'failed' && !test.aiDiagnosis && (
                                <div className="mt-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-[10px] leading-relaxed">
                                  <span className="text-rose-400 font-bold uppercase tracking-widest mb-1 block">Assertion Error</span>
                                  {test.details ? (
                                    <>
                                      <span className="text-white/80 block mb-2">{test.details}</span>
                                      Call log:<br/>
                                      &nbsp;&nbsp;- step failed at {step.action}({step.target})<br/>
                                      &nbsp;&nbsp;- observed unexpected state or rejected response
                                    </>
                                  ) : (
                                    <>
                                      Error: Assertion failed<br/>
                                      Call log:<br/>
                                        &nbsp;&nbsp;- waiting for {step.target}<br/>
                                        &nbsp;&nbsp;- condition not met within timeout
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-white/20 select-none flex items-center gap-1">
                              {step.status === 'passed' && <CheckCircle2 className="h-3 w-3 text-emerald-400/50" />}
                              {step.status === 'failed' && <X className="h-3 w-3 text-rose-400/50" />}
                              {step.time}
                            </div>
                          </div>
                        ))}
                      </div>

                      {test.aiDiagnosis && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className={`p-5 rounded-2xl relative overflow-hidden border ${test.status === 'failed' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                             <Terminal className="h-16 w-16" />
                          </div>
                          <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2 ${test.status === 'failed' ? 'text-rose-400' : 'text-emerald-400'}`}>
                             <span className={`h-2 w-2 rounded-full animate-pulse ${test.status === 'failed' ? 'bg-rose-400' : 'bg-emerald-400'}`} /> Coderat AI Diagnosis
                          </h3>
                          <p className={`text-sm leading-relaxed relative z-10 font-sans ${test.status === 'failed' ? 'text-rose-100/80' : 'text-emerald-100/80'}`}>
                             {test.aiDiagnosis}
                          </p>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <>
                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Code className="h-4 w-4" /> Generated Spec Code
                      </h3>
                      <div className="rounded-xl border border-white/10 bg-black/40 p-4 overflow-x-auto font-mono text-[11px] text-white/80 shadow-inner">
                        <pre>
{`import { test, expect } from '@playwright/test';

test('${test.name}', async ({ page }) => {
${stepsToRender.map((step: any) => `  await page.${step.action}(${step.target});`).join('\n')}
});`}
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Controls */}
            <div className="p-4 border-t border-white/10 bg-black/20 shrink-0 flex gap-4">
              <button 
                disabled={test.status === 'running'}
                className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                <Play className="h-4 w-4" /> Run Test Manually
              </button>
              <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm">
                Update Selector
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
