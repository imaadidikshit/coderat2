import React, { useState, useRef } from "react";
import { Github, Mail, Target, Loader2, ArrowLeft, Activity, Bug, Bot } from "lucide-react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import brandLogo from '../components/model_logos/App_assets/wordmark_D_white.svg';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.presetEmail || "");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });
      if (error) {
         if (error.message.toLowerCase().includes('signups not allowed') || error.message.toLowerCase().includes('not found')) {
            navigate('/signup', { state: { presetEmail: email, message: "Account not found. Let's get you set up first!" } });
            return;
         }
         throw error;
      }
      setStep('otp');
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the verification code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!visualsRef.current) return;
    
    const lines = visualsRef.current.querySelectorAll('.log-line');
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    
    gsap.set(lines, { opacity: 0, x: -20 });
    
    tl.to(lines[0], { opacity: 1, x: 0, duration: 0.3 })
      .to(lines[1], { opacity: 1, x: 0, duration: 0.3 }, "+=0.2")
      .to(lines[2], { opacity: 1, x: 0, duration: 0.3, color: '#ef4444' }, "+=0.2") // Error
      .to(lines[3], { opacity: 1, x: 0, duration: 0.4 }, "+=0.5") // Analyzing
      .to(lines[4], { opacity: 1, x: 0, duration: 0.3, color: '#10b981' }, "+=0.8") // Fixed
      .to(lines, { opacity: 0, y: -20, stagger: 0.1, duration: 0.5, ease: "power2.in" }, "+=2");
      
  }, { scope: containerRef });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0A0B] flex font-sans overflow-hidden relative">
      <div className="absolute top-8 left-8 z-50">
        <Link to="/" className="flex items-center">
          <img src={brandLogo} alt="QA Copilot" className="h-12 w-auto" />
        </Link>
      </div>

      {/* Left Panel - Auto Animated Visuals */}
      <div className="hidden lg:flex flex-col w-1/2 p-12 relative items-center justify-center border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="w-full max-w-md bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform perspective-[1000px] rotate-y-[5deg] rotate-x-[2deg]">
            <div className="h-12 bg-[#1A1A1A] border-b border-white/5 flex items-center px-4 gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                <span className="text-white/60 font-mono text-xs font-bold uppercase tracking-widest">Auto-Healer Active</span>
            </div>
            <div ref={visualsRef} className="p-6 font-mono text-sm space-y-4">
                <div className="log-line flex gap-3 text-white/70">
                    <span className="text-indigo-400">00:01</span>
                    <span>Running test suite: checkout.spec.ts</span>
                </div>
                <div className="log-line flex gap-3 text-white/70">
                    <span className="text-indigo-400">00:02</span>
                    <span>Navigating to /checkout</span>
                </div>
                <div className="log-line flex gap-3 text-white/70">
                    <span className="text-indigo-400">00:04</span>
                    <span>Error: Timeout waiting for selector ".btn-submit"</span>
                </div>
                <div className="log-line flex gap-3 text-white/70 items-center">
                    <span className="text-indigo-400">00:05</span>
                    <span className="flex items-center gap-2 text-indigo-300">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Analyzing DOM drift...
                    </span>
                </div>
                <div className="log-line flex gap-3 text-white/70">
                    <span className="text-indigo-400">00:06</span>
                    <span className="text-emerald-400 font-bold">✓ Healed: Replaced with "[data-testid=checkout-submit]"</span>
                </div>
            </div>
            <div className="h-2 w-full bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full bg-indigo-500/50 transform -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#0A0A0B] relative z-10 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-white/50 text-sm">Enter your credentials to access your workspace.</p>
            {location.state?.message && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                {location.state.message}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === 'email' ? (
               <motion.div 
                 key="email-step"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="space-y-4"
               >
                 <button 
                   onClick={handleGithubLogin}
                   className="w-full bg-[#111111] border border-white/10 hover:bg-[#1a1a1a] text-white p-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3"
                 >
                   <Github className="w-5 h-5" />
                   Continue with GitHub
                 </button>
                 
                 <div className="relative flex items-center py-4">
                   <div className="flex-grow border-t border-white/5"></div>
                   <span className="flex-shrink-0 mx-4 text-white/30 text-xs font-bold uppercase tracking-widest">Or login with code</span>
                   <div className="flex-grow border-t border-white/5"></div>
                 </div>

                 <form onSubmit={handleSendOtp} className="space-y-4">
                   {error && (
                     <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                       {error}
                     </div>
                   )}
                   
                   <div className="space-y-1">
                     <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest px-1">Email</label>
                     <div className="relative">
                       <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                       <input 
                         type="email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full bg-[#111111] border border-white/10 rounded-xl px-10 py-3.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-white/20"
                         placeholder="name@company.com"
                         required
                       />
                     </div>
                   </div>
                   
                   <button 
                     type="submit" 
                     disabled={loading}
                     className="w-full bg-white text-black p-3.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Magic Code'}
                   </button>
                 </form>

                 <p className="mt-8 text-center text-xs text-white/40 font-medium">
                   Don't have an account?{' '}
                   <Link to="/signup" className="text-white hover:text-indigo-400 font-bold transition-colors">Sign up</Link>
                 </p>
               </motion.div>
            ) : (
               <motion.div
                 key="otp-step"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="space-y-4"
               >
                  <button 
                     onClick={() => {
                        setStep('email');
                        setOtp("");
                        setError("");
                     }}
                     className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors"
                  >
                     <ArrowLeft className="w-4 h-4" /> Back to Email
                  </button>

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                     {error && (
                       <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                         {error}
                       </div>
                     )}
                     
                     <div className="space-y-1">
                       <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest px-1">Verification Code</label>
                       <input 
                         type="text" 
                         value={otp}
                         onChange={(e) => setOtp(e.target.value)}
                         className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors text-center tracking-[0.5em] font-mono text-lg"
                         placeholder="000000"
                         maxLength={6}
                         required
                       />
                       <p className="text-xs text-white/40 px-1 mt-2">
                           We sent a 6-digit code to <span className="text-white font-medium">{email}</span>.
                       </p>
                     </div>
                     
                     <button 
                       type="submit" 
                       disabled={loading || otp.length < 6}
                       className="w-full bg-white text-black p-3.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                     >
                       {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code'}
                     </button>
                  </form>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
