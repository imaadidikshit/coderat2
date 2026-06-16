import React, { useState } from "react";
import { Github, Target, Mail, User as UserIcon, ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";

export default function Signup() {
  const { user } = useAuth();
  const location = useLocation();
  const stateMessage = location.state?.message || "";
  
  const [email, setEmail] = useState(location.state?.presetEmail || "");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(stateMessage);

  const handleGithubSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      setError("Please provide your name and email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: fullName
          }
        }
      });
      if (error) throw error;
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
      // successful signup will be handled by AuthProvider updates
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#050505] border-r border-white/5 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-[1px]">
            <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">QA Copilot</span>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Start automating your tests today.
          </h1>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">
            Join thousands of teams building better software faster with AI-powered end-to-end testing.
          </p>
          <div className="space-y-4">
            {["AI-generated test cases", "Self-healing selectors", "Cross-browser execution"].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-white/70">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 text-white/40 text-sm">
          <span>© 2026 QA Copilot Inc.</span>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[#0A0A0B] pointer-events-none -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Header */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-[1px]">
              <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">QA Copilot</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create an account</h2>
            <p className="text-white/50 text-sm">Let's get started with your 14-day free trial.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <button 
              onClick={handleGithubSignup}
              type="button"
              className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-3 transition-colors group"
            >
              <Github className="h-5 w-5 text-white/70 group-hover:text-white" />
              Continue with GitHub
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-white/5 flex-1"></div>
              <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Or with email</span>
              <div className="h-px bg-white/5 flex-1"></div>
            </div>

            <AnimatePresence mode="wait">
              {step === 'details' ? (
                <motion.form key="details-form" onSubmit={handleSendOtp} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/70 px-1">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/70 px-1">Work Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <input
                          type="email"
                          placeholder="john@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors mt-2"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                    Continue
                  </button>
                </motion.form>
              ) : (
                <motion.form key="otp-form" onSubmit={handleVerifyOtp} className="space-y-5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 text-center space-y-2">
                    <Mail className="h-8 w-8 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium">Check your email</h3>
                    <p className="text-sm text-white/60">We sent a verification code to <br/><strong className="text-white">{email}</strong></p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/70 px-1">Verification Code</label>
                    <input
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-4 bg-black/50 border border-white/10 rounded-xl text-2xl text-center text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono tracking-[0.5em]"
                      maxLength={6}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-medium flex items-center justify-center transition-colors"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Create Account"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="w-full py-2 text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Use a different email
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 text-center text-sm text-white/50">
            Already have an account? <Link to="/login" className="text-white hover:underline transition-all">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
