import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Webhook, Slack, Globe, ArrowRight, CheckCircle2, Loader2, Copy, AlertTriangle, LogOut } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function Integrations() {
  const [ghStatus, setGhStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [showManualWebhook, setShowManualWebhook] = useState(false);
  const [copied, setCopied] = useState(false);

  const [repos, setRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [configuredRepos, setConfiguredRepos] = useState<any[]>([]);
  const [showRepoList, setShowRepoList] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('github_configured_repos');
    if (saved) {
      try {
        setConfiguredRepos(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('github_configured_repos', JSON.stringify(configuredRepos));
  }, [configuredRepos]);

  const fetchRepos = async (token: string) => {
    setLoadingRepos(true);
    try {
      const res = await fetch('/api/github/repos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(data.repos || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRepos(false);
    }
  };

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [repoBranches, setRepoBranches] = useState<Record<string, string[]>>({});

  const fetchBranches = async (repoName: string, token: string) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${repoName}/branches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const branches = data.map((b: any) => b.name);
        setRepoBranches(prev => ({...prev, [repoName]: branches}));
      }
    } catch (e) { console.error("Failed to fetch branches", e); }
  };

  useEffect(() => {
    const token = localStorage.getItem('github_token');
    if (token) {
      configuredRepos.forEach(r => {
        if (!repoBranches[r.full_name]) {
          fetchBranches(r.full_name, token);
        }
      });
    }
  }, [configuredRepos]);

  const [sseEvents, setSseEvents] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('autoqa_sse_events');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('autoqa_sse_events', JSON.stringify(sseEvents));
  }, [sseEvents]);

  useEffect(() => {
    // Check if we have an existing token
    const existingToken = localStorage.getItem('github_token');
    if (existingToken) {
      setGhStatus('connected');
      fetchRepos(existingToken);
    }

    // Listen for messages from popup window for OAuth callback
    const handleMessage = (event: MessageEvent) => {
      // Allow messages specifically from our own origin or preview origins
      if (!event.origin.includes('localhost') && !event.origin.endsWith('.run.app')) {
        return;
      }

      if (event.data?.type === 'GITHUB_AUTH_SUCCESS') {
        const token = event.data?.token;
        if (token) {
          localStorage.setItem('github_token', token);
          fetchRepos(token);
        }
        setGhStatus('connected');
        setShowRepoList(true); // Automatically show repo list on first connect
        // Clean up any stray parameters if they exist
        if (window.location.search.includes('github_connected')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else if (event.data?.type === 'GITHUB_AUTH_ERROR') {
        setGhStatus('disconnected');
        alert('GitHub connection failed. Please check your credentials.');
      }
    };

    window.addEventListener('message', handleMessage);

    // Fallback logic if the OAuth redirects main window instead of using popup
    const params = new URLSearchParams(window.location.search);
    if (params.get('github_connected') === 'true') {
      setGhStatus('connected');
      const token = params.get('token');
      if (token) {
        localStorage.setItem('github_token', token);
        fetchRepos(token);
        setShowRepoList(true);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('github_connected') === 'false') {
      setGhStatus('disconnected');
      alert('GitHub connection failed. Please check your credentials.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    let evtSource: EventSource | null = null;
    let pollInterval: any = null;

    if (ghStatus === 'connected') {
      // Primary: SSE
      evtSource = new EventSource('/api/github/stream');
      evtSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type && data.type !== 'connected') {
             setSseEvents(prev => {
                // Prevent duplicates
                if (prev.find(p => p.id === data.id)) return prev;
                return [data, ...prev].slice(0, 50);
             });
          }
        } catch(e) {}
      };

      // Fallback: Long-polling every 3 seconds to guarantee delivery if proxy blocks SSE
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch('/api/github/events');
          if (res.ok) {
            const data = await res.json();
            if (data && data.events) {
               setSseEvents(prev => {
                  let updated = [...prev];
                  let changed = false;
                  // Add new events
                  data.events.slice().reverse().forEach((evt: any) => {
                     if (!updated.find(p => p.id === evt.id)) {
                        updated.unshift(evt);
                        changed = true;
                     }
                  });
                  return changed ? updated.slice(0, 50) : prev;
               });
            }
          }
        } catch(e) {}
      }, 3000);
    }
    return () => {
      if (evtSource) evtSource.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [ghStatus]);

  const handleConnectGitHub = async () => {
    setGhStatus('connecting');
    try {
      const redirectUri = `${window.location.origin}/api/github/callback`;
      const response = await fetch(`/api/github/auth/url?redirectUri=${encodeURIComponent(redirectUri)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch auth URL');
      }
      
      const { url } = await response.json();
      
      const authWindow = window.open(
        url,
        'github_oauth',
        'width=600,height=700'
      );

      if (!authWindow) {
        setGhStatus('disconnected');
        alert('Please allow popups for this site to connect GitHub.');
      }
    } catch (e) {
      console.error('OAuth initiation failed:', e);
      setGhStatus('disconnected');
      alert('Failed to connect to GitHub. Please try again.');
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_configured_repos');
    localStorage.removeItem('autoqa_sse_events');
    try { fetch('/api/github/clear-tracker', { method: 'POST' }); } catch(e) {}
    setGhStatus('disconnected');
    setRepos([]);
    setConfiguredRepos([]);
    setSseEvents([]);
    setShowRepoList(false);
  };

  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    fetch('/api/github/proxy-url')
      .then(r => r.json())
      .then(data => {
         // Using Smee.io proxy to bypass the 302 authentication proxy of the preview environment
         if (data.webhookUrl) setWebhookUrl(data.webhookUrl);
      }).catch(e => console.error("Failed to fetch proxy URL", e));
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-black/20 backdrop-blur-sm z-10 shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Integrations</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Connect Your Workspace</h2>
            <p className="text-sm text-white/40 italic">Integrate Coderat with your CI/CD pipelines and team communication tools.</p>
          </div>

          <div className="grid gap-6">
            
            {/* GitHub CI/CD */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0E0E11] border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Github className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold tracking-tight text-white">GitHub Integration</h3>
                      {ghStatus === 'connected' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3" /> Connected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/40 italic max-w-xl">
                      Automatically run tests on every Pull Request. Coderat will extract preview URLs and comment on PRs with visual diffs and test results.
                    </p>
                  </div>
                </div>
                
                {ghStatus === 'disconnected' && (
                  <div className="flex flex-col items-end gap-3">
                    <button 
                      onClick={handleConnectGitHub}
                      className="px-4 py-2 bg-white hover:bg-white/90 text-black rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2"
                    >
                      Connect GitHub <ArrowRight className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => setShowManualWebhook(!showManualWebhook)}
                      className="text-[10px] text-white/40 hover:text-white/80 uppercase tracking-widest font-bold underline decoration-white/20 underline-offset-4"
                    >
                      Manual Webhook Setup
                    </button>
                  </div>
                )}

                {ghStatus === 'connecting' && (
                  <button disabled className="px-4 py-2 border border-white/10 bg-white/5 text-white/50 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Authorizing...
                  </button>
                )}

                {ghStatus === 'connected' && (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowRepoList(!showRepoList)}
                      className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                    >
                      {showRepoList ? 'Hide Repos' : 'Configure Repos'}
                    </button>
                    <button 
                      onClick={handleDisconnect}
                      className="p-2 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors"
                      title="Disconnect GitHub"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <AnimatePresence>
                {showManualWebhook && ghStatus === 'disconnected' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/10 relative z-10 flex flex-col gap-4 overflow-hidden"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Temporary Webhook URL</h4>
                      <p className="text-xs text-white/50 mb-4">Add this Payload URL to your GitHub Repository Settings &gt; Webhooks. Set content-type to application/json and select "Pull requests", "Pushes", "Statuses", and "Deployments" events.</p>
                      
                      <div className="flex bg-black/40 border border-white/10 rounded-lg overflow-hidden">
                        <div className="flex-1 px-4 py-3 font-mono text-xs text-white/70 overflow-x-auto whitespace-nowrap">
                          {webhookUrl || "Generating proxy URL..."}
                        </div>
                        <button 
                          onClick={copyToClipboard}
                          className="px-4 bg-white/5 hover:bg-white/10 border-l border-white/10 transition-colors flex items-center justify-center shrink-0"
                        >
                          {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-white/50" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {ghStatus === 'connected' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t border-white/10 relative z-10 flex flex-col gap-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white/40 font-mono text-xs">Repository Access:</span>
                      {configuredRepos.length > 0 && (
                        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" /> Active Webhooks
                        </span>
                      )}
                    </div>
                    
                    {/* Configured Repos */}
                    {configuredRepos.length > 0 && !showRepoList && (
                      <div className="space-y-3">
                        {configuredRepos.map(repo => (
                          <div key={repo.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                                <Github className="h-4 w-4 text-white/70" />
                              </div>
                              <div className="flex flex-col">
                                <div className="text-sm font-bold text-white truncate">{repo.full_name}</div>
                                <select
                                  value={repo.target_branch || ''}
                                  onChange={(e) => {
                                      setConfiguredRepos(prev => prev.map(p => p.id === repo.id ? {...p, target_branch: e.target.value} : p));
                                  }}
                                  className="mt-1 text-xs bg-black border border-white/20 rounded px-1 py-0.5 text-white/70 outline-none focus:border-indigo-500"
                                >
                                  <option value="">All Branches</option>
                                  {(repoBranches[repo.full_name] || []).map(b => (
                                      <option key={b} value={b}>{b}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={async () => {
                                  try {
                                    const token = localStorage.getItem('github_token');
                                    const res = await fetch('/api/github/test-webhook', {
                                      method: 'POST',
                                      headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                      },
                                      body: JSON.stringify({ 
                                        repo: repo.full_name,
                                        webhookUrl: webhookUrl
                                      })
                                    });
                                    const data = await res.json();
                                    if (!res.ok || data.success === false) {
                                      alert("Error: " + (data.error || data.message || "Failed to trigger test"));
                                    } else {
                                      alert(data.message || "Test triggered successfully! Check the live feed.");
                                    }
                                  } catch (e: any) {
                                    console.error("Test webhook call failed", e);
                                    alert("Error testing webhook: " + e.message);
                                  }
                                }}
                                className="text-[10px] border border-indigo-500/30 px-3 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors uppercase tracking-widest font-bold"
                              >
                                Test Webhook
                              </button>
                              <button 
                                onClick={() => setConfiguredRepos(configuredRepos.filter(r => r.id !== repo.id))}
                                className="text-[10px] border border-white/10 px-3 py-1.5 rounded bg-black/20 hover:bg-red-500/10 hover:text-red-400 transition-colors uppercase tracking-widest font-bold text-white/60"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {configuredRepos.length === 0 && !showRepoList && (
                       <div className="text-center py-6 border border-white/5 rounded-lg bg-black/20">
                          <p className="text-xs text-white/40 mb-3">No repositories configured yet.</p>
                          <button 
                            onClick={() => setShowRepoList(true)}
                            className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm inline-flex items-center gap-2"
                          >
                            Add Repository
                          </button>
                       </div>
                    )}

                    {/* Repo Selection Box */}
                    <AnimatePresence>
                      {showRepoList && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-black/40 border border-white/10 rounded-lg overflow-hidden flex flex-col"
                        >
                          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/80">Select Repositories</h4>
                            {loadingRepos && <Loader2 className="h-3 w-3 animate-spin text-white/50" />}
                          </div>
                          <div className="max-h-[300px] overflow-y-auto p-2">
                            {loadingRepos && repos.length === 0 ? (
                              <div className="p-6 flex justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-white/30" />
                              </div>
                            ) : repos.length === 0 ? (
                              <div className="p-6 text-center text-xs text-white/40">
                                No repositories found for this user.
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {repos.map(repo => {
                                  const isConfigured = configuredRepos.some(r => r.id === repo.id);
                                  return (
                                    <label key={repo.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isConfigured ? 'bg-indigo-500/10 border-indigo-500/20' : 'hover:bg-white/5'} border border-transparent`}>
                                      <input 
                                        type="checkbox" 
                                        checked={isConfigured}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setConfiguredRepos([...configuredRepos, repo]);
                                          } else {
                                            setConfiguredRepos(configuredRepos.filter(r => r.id !== repo.id));
                                          }
                                        }}
                                        className="rounded border-white/20 bg-black/50 text-indigo-500 focus:ring-0 focus:ring-offset-0 h-4 w-4"
                                      />
                                      <div className="flex-1 overflow-hidden">
                                        <div className="text-sm font-medium text-white/90 truncate">{repo.full_name}</div>
                                        <div className="text-[10px] text-white/40">{repo.private ? 'Private' : 'Public'}</div>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          {repos.length > 0 && (
                            <div className="p-3 border-t border-white/10 bg-black/60 flex justify-end">
                              <button 
                                onClick={async () => {
                                  setIsConfiguring(true);
                                  try {
                                    const token = localStorage.getItem('github_token');
                                    const reposParams = configuredRepos.map(r => ({ repo: r.full_name, branch: r.target_branch || '' }));
                                    const res = await fetch('/api/github/webhooks/setup', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ 
                                          repos: reposParams,
                                          webhookUrl: webhookUrl
                                        })
                                    });
                                    const data = await res.json();
                                    if (res.ok && data.success) {
                                      setShowRepoList(false);
                                      alert(data.message || "Successfully configured webhooks for selected repositories!");
                                    } else {
                                      throw new Error(data.error || "Failed to configure webhooks");
                                    }
                                  } catch (e: any) {
                                    alert("Error setting up webhooks: " + e.message);
                                  } finally {
                                    setIsConfiguring(false);
                                  }
                                }}
                                disabled={isConfiguring}
                                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded border border-indigo-400/30 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2"
                              >
                                {isConfiguring && <Loader2 className="h-3 w-3 animate-spin"/>} Save Configuration
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Vercel / Netlify Webhooks */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0E0E11] border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white mb-1">Preview Deployments</h3>
                    <p className="text-sm text-white/40 italic max-w-xl">
                      Listen for Vercel/Netlify deployment success webhooks to instantly trigger end-to-end tests against the preview URL.
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm">
                  Configure
                </button>
              </div>
            </motion.div>

            {/* Slack */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0E0E11] border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Slack className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white mb-1">Slack Notifications</h3>
                    <p className="text-sm text-white/40 italic max-w-xl">
                      Get alerted in your team's channel when critical core flows fail in production or staging.
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm">
                  Add to Slack
                </button>
              </div>
            </motion.div>
            
            {/* Live Webhook Activity Feed */}
            {sseEvents.length > 0 && (
              <div className="mt-8 border border-white/10 bg-black/40 xl:bg-[rgba(10,10,12,0.8)] rounded-xl overflow-hidden backdrop-blur-xl">
                 <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Live Webhook Activity Feed
                    </h3>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          const logText = sseEvents.map(e => `${e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : ''} - ${e.repo}\n${e.type === 'WEBHOOK_EVENT' ? e.event : e.type}\n${e.message || (e.action ? `PR #${e.prNumber} ${e.action}: "${e.title}"` : (e.event === 'push' ? `New push to ${e.ref}` : ''))}`).join('\n\n');
                          navigator.clipboard.writeText(logText).then(() => {
                            alert("Feed copied to clipboard!");
                          }).catch(err => {
                            console.error("Copy failed", err);
                          });
                        }}
                        className="text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-white transition-colors"
                      >
                        Copy Feed
                      </button>
                      <button 
                        onClick={() => {
                          setSseEvents([]);
                          localStorage.removeItem('autoqa_sse_events');
                        }}
                        className="text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-white transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                 </div>
                 <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
                   <AnimatePresence>
                     {sseEvents.map((evt) => (
                       <motion.div 
                          key={evt.id}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border ${evt.type === 'WEBHOOK_EVENT' ? 'border-white/10 bg-white/5' : 'border-indigo-500/20 bg-indigo-500/10'}`}
                       >
                         <div className="flex justify-between items-start mb-2">
                           <span className="text-xs font-mono text-white/50">{evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString() : ''} - {evt.repo}</span>
                           <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${evt.type === 'WEBHOOK_EVENT' ? 'bg-white/10 text-white/80' : 'bg-indigo-500/20 text-indigo-300'}`}>
                              {evt.type === 'WEBHOOK_EVENT' ? evt.event : evt.type}
                           </span>
                         </div>
                         <div className="text-sm text-white/90">
                           {evt.type === 'WEBHOOK_EVENT' && evt.event === 'push' && (
                              <span>New push to <span className="font-mono text-emerald-400">{evt.ref}</span>{evt.commits && evt.commits.length > 0 ? ` (${evt.commits.join(', ')})` : ''}</span>
                           )}
                           {evt.type === 'WEBHOOK_EVENT' && evt.event === 'pull_request' && (
                              <span>PR #{evt.prNumber} {evt.action}: "{evt.title}"</span>
                           )}
                           {evt.type !== 'WEBHOOK_EVENT' && (
                              <div className="flex items-start gap-2">
                                <span className="text-indigo-400">✨</span>
                                <span>{evt.message}</span>
                              </div>
                           )}
                         </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
