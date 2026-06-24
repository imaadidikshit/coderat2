import React, { useState, useRef, useEffect } from "react";
import { Github, Mail, User as UserIcon, Target, Loader2, ArrowLeft, Activity, Bug, Bot, CheckCircle2, Star, Quote } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import brandLogo from '../components/model_logos/App_assets/wordmark_D_white.svg';

const REVIEWS = [
  { name: "Alex Chen", role: "Frontend Lead", content: "QA Copilot caught a tricky visual bug in our checkout flow before it hit production. Absolute lifesaver." },
  { name: "Sarah Jenkins", role: "QA Engineer", content: "The auto-healing Playwright scripts have saved us hours of maintenance every week. Incredible tool." },
  { name: "Michael Rodriguez", role: "CTO", content: "Integration was seamless. We went from 40% test flakiness to near zero in less than a month." },
  { name: "Emily Watson", role: "Full Stack Developer", content: "I love how it highlights exactly which DOM element broke the test. The AI suggestions are spot on." },
  { name: "David Kim", role: "Engineering Manager", content: "Finally, a testing tool that actually understands React component drift. Highly recommended for fast-moving teams." },
  { name: "Lisa Thompson", role: "Product Manager", content: "We release twice as fast now because our QA bottlenecks are gone. The PR integration is pure magic." },
  { name: "James Wilson", role: "DevOps Engineer", content: "Setting this up in our CI/CD pipeline took literally 5 minutes. The return on investment is immediate." },
  { name: "Anna Martinez", role: "Software Engineer", content: "It's like having a senior QA engineer reviewing every commit. The visual diffs are super clear." },
  { name: "Tom Baker", role: "Tech Lead", content: "We used to dread updating our UI libraries. Now QA Copilot handles all the selector updates automatically." },
  { name: "Rachel Green", role: "Frontend Developer", content: "The way it handles dynamic class names from Tailwind is brilliant. No more brittle tests." },
  { name: "Chris Evans", role: "Staff Engineer", content: "I was skeptical about AI in testing, but this completely changed my mind. It's accurate and fast." },
  { name: "Jessica Lee", role: "QA Lead", content: "Our test suite runs 3x faster now that we don't have to deal with manual retries and flaky selectors." },
  { name: "Mark Zuckerberg", role: "Developer", content: "The seamless GitHub integration makes reviewing auto-healed tests a breeze. Great UX." },
  { name: "Sophie Clark", role: "UX Engineer", content: "Visual regression testing that actually ignores harmless pixel shifts. Perfect for our design system updates." },
  { name: "Daniel Craig", role: "Release Manager", content: "Confidence in our deployments has never been higher. QA Copilot is a must-have for modern teams." },
  { name: "Olivia Wright", role: "Frontend Dev", content: "I can finally focus on writing features instead of fixing broken tests. Thank you!" },
  { name: "William Hunt", role: "Backend Engineer", content: "Even as a backend dev, I find writing and maintaining UI tests incredibly easy now." },
  { name: "Mia Wong", role: "Product Designer", content: "Ensuring design consistency across our app has never been easier. It catches every unintended change." },
  { name: "Ethan Hunt", role: "QA Automation", content: "The auto-generated pull requests for broken tests are a game-changer. It just works." },
  { name: "Chloe Smith", role: "Frontend Architect", content: "We migrated our entire test suite to Playwright just to use this. 100% worth it." },
  { name: "Noah Davis", role: "Engineering VP", content: "This tool paid for itself in the first week. The engineering hours saved are staggering." },
  { name: "Ava Johnson", role: "Software Tester", content: "I love the dashboard. It gives me a clear overview of our test health at a glance." },
  { name: "Liam Miller", role: "React Developer", content: "No more guessing why a test failed in CI. The contextual AI explanations are perfect." },
  { name: "Emma Wilson", role: "Tech Founder", content: "As a small team, we don't have a dedicated QA person. QA Copilot fills that role perfectly." },
  { name: "Benjamin Moore", role: "Senior Developer", content: "The onboarding was smooth, and the documentation is excellent. Top-tier developer experience." },
  { name: "Isabella Taylor", role: "QA Analyst", content: "Visualizing DOM changes side-by-side helps us communicate issues to developers instantly." },
  { name: "Lucas Anderson", role: "UI Developer", content: "It catches accessibility regressions too! A huge plus for our compliance requirements." },
  { name: "Harper Thomas", role: "Lead SDET", content: "We evaluated several AI testing tools. QA Copilot is by far the most reliable and developer-friendly." },
  { name: "Mason Jackson", role: "Web Developer", content: "I actually enjoy writing tests now. The AI suggestions take all the grunt work out of it." },
  { name: "Evelyn White", role: "Director of Engineering", content: "A fundamental shift in how we approach UI testing. It's an indispensable part of our stack." }
];

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
  
  const [selectedReviews, setSelectedReviews] = useState<typeof REVIEWS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Select 5 random reviews on mount
    const shuffled = [...REVIEWS].sort(() => 0.5 - Math.random());
    setSelectedReviews(shuffled.slice(0, 5));
  }, []);

  useEffect(() => {
    if (selectedReviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % selectedReviews.length);
    }, 5000); // 5 seconds per review
    return () => clearInterval(timer);
  }, [selectedReviews]);

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
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

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

      {/* Left Panel - Auto Animated Reviews */}
      <div className="hidden lg:flex flex-col w-1/2 p-12 relative items-center justify-center border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-xl">
          <div className="mb-10 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                 <Star className="w-4 h-4 fill-indigo-400" /> Loved by developers
             </div>
             <h2 className="text-3xl font-display font-bold text-white">Join the modern testing era</h2>
          </div>

          <div className="relative w-full h-[360px] perspective-[1500px] flex items-center justify-center mt-12">
            <AnimatePresence mode="wait">
              {selectedReviews.length > 0 && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.9, rotateX: 20, y: 50, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, rotateX: -20, y: -50, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute w-full max-w-lg bg-[#111111]/90 backdrop-blur-3xl border border-indigo-500/20 rounded-3xl p-8 md:p-10 shadow-[0_0_100px_rgba(99,102,241,0.15)] flex flex-col justify-center"
                >
                  <Quote className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 md:w-16 md:h-16 text-indigo-500/10 rotate-12" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 fill-emerald-400" />
                    ))}
                  </div>
                  <p className="text-white/90 text-lg md:text-2xl leading-relaxed mb-8 relative z-10 font-medium tracking-wide">
                    "{selectedReviews[currentIndex].content}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="text-indigo-400 font-bold text-base md:text-lg tracking-wide">— {selectedReviews[currentIndex].name}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#0A0A0B] relative z-10 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Create your account</h2>
            <p className="text-white/50 text-sm">Join thousands of developers shipping better code.</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'details' ? (
               <motion.div 
                 key="details-step"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="space-y-4"
               >
                 <button 
                   onClick={handleGithubSignup}
                   className="w-full bg-[#111111] border border-white/10 hover:bg-[#1a1a1a] text-white p-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3"
                 >
                   <Github className="w-5 h-5" />
                   Sign up with GitHub
                 </button>
                 
                 <div className="relative flex items-center py-4">
                   <div className="flex-grow border-t border-white/5"></div>
                   <span className="flex-shrink-0 mx-4 text-white/30 text-xs font-bold uppercase tracking-widest">Or sign up with email</span>
                   <div className="flex-grow border-t border-white/5"></div>
                 </div>

                 <form onSubmit={handleSendOtp} className="space-y-4">
                   {error && (
                     <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                       {error}
                     </div>
                   )}
                   
                   <div className="space-y-1">
                     <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest px-1">Full Name</label>
                     <div className="relative">
                       <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                       <input 
                         type="text" 
                         value={fullName}
                         onChange={(e) => setFullName(e.target.value)}
                         className="w-full bg-[#111111] border border-white/10 rounded-xl px-10 py-3.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-white/20"
                         placeholder="Jane Doe"
                         required
                       />
                     </div>
                   </div>

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
                   Already have an account?{' '}
                   <Link to="/login" className="text-white hover:text-indigo-400 font-bold transition-colors">Sign in</Link>
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
                        setStep('details');
                        setOtp("");
                        setError("");
                     }}
                     className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors"
                  >
                     <ArrowLeft className="w-4 h-4" /> Back to Details
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
                       {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Create Account'}
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
