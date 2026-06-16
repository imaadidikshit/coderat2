import React, { useEffect, useState } from 'react';
import { Box, Code, GitMerge, Settings, Plus, LogOut, BrainCircuit, Globe } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';
import brandLogo from '../components/model_logos/App_assets/wordmark_D _white.svg';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchProjects = async () => {
       const { data: workspaces } = await supabase.from('workspaces').select('id').eq('owner_id', user.id).limit(1);
       if (workspaces && workspaces.length > 0) {
          const { data: projs } = await supabase.from('projects').select('id, name').eq('workspace_id', workspaces[0].id).order('created_at', { ascending: false });
          if (projs) {
             setProjects(projs.filter(p => !p.name.includes('Core App (Staging)')));
          }
       }
    };
    fetchProjects();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-[#0E0E11] flex flex-col relative z-20">
        <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
          <Link to="/" className="flex items-center group -ml-2">
            <img src={brandLogo} alt="Coderat Logo" className="h-8 md:h-10 w-auto object-contain scale-[1.5] md:scale-[1.8] origin-left transition-opacity group-hover:opacity-90" />
          </Link>
        </div>
        
        <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 px-3 mt-4">Projects</div>
          
          {projects.map((proj, idx) => (
             <div key={proj.id} className={`flex items-center justify-between group rounded-lg transition-colors text-sm px-3 py-2 ${idx === 0 && path === '/dashboard' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
               <Link to="/dashboard" className="flex items-center gap-3 flex-1 overflow-hidden">
                 <div className={`h-2 w-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor] ${idx === 0 ? 'bg-emerald-400 text-emerald-400' : 'bg-indigo-400 text-indigo-400 opacity-50'}`} />
                 <span className="truncate">{proj.name}</span>
               </Link>
               <button 
                 onClick={async (e) => {
                   e.preventDefault();
                   if (confirm(`Delete project "${proj.name}"?`)) {
                     await supabase.from('projects').delete().eq('id', proj.id);
                     window.location.href = '/dashboard';
                   }
                 }}
                 className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-white/40 transition-all shrink-0"
                 title="Delete Project"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
               </button>
             </div>
          ))}
          {projects.length === 0 && (
             <div className="px-3 py-2 text-xs text-white/40 italic">No projects found.</div>
          )}
          
          <Link to="/onboarding" className="flex items-center gap-2 px-3 py-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg mt-2 text-xs font-bold uppercase tracking-widest transition-colors">
            <Plus className="h-4 w-4" /> Add Project
          </Link>

          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 px-3 mt-8">Configuration</div>
          
          <Link to="/integrations" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${path === '/integrations' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <GitMerge className="h-4 w-4" /> Integrations
          </Link>
          
          <Link to="/models" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${path === '/models' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <BrainCircuit className="h-4 w-4" /> AI Models
          </Link>
          
          <Link to="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${path === '/settings' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <Settings className="h-4 w-4" /> Setup & Billing
          </Link>
        </div>

        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <Link to="/profile" className="flex items-center gap-3 overflow-hidden hover:bg-white/5 p-2 flex-1 rounded-xl transition-colors group">
              <div className="h-8 w-8 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-indigo-500/50 transition-colors">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} className="w-full h-full rounded-full" alt="User Avatar" />
                ) : (
                  <span className="text-sm font-bold text-white/40 group-hover:text-white transition-colors">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold tracking-tight text-white truncate">{user?.user_metadata?.full_name || 'User'}</p>
                <p className="text-[10px] text-white/40 truncate italic group-hover:text-indigo-400 transition-colors">View Profile</p>
              </div>
            </Link>
            <button onClick={handleLogout} className="p-2 ml-1 hover:bg-white/10 rounded-xl text-white/40 hover:text-rose-400 transition-colors shrink-0" title="Log Out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background glow for all dashboard nested routes */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        {children}
      </div>
    </div>
  );
}
