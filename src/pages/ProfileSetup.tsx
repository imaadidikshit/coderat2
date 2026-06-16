import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Briefcase, Building, Code, Hash, CheckCircle2, Loader2, Sparkles, Target, Zap, User as UserIcon, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";

const roles = [
  { id: "developer", label: "Software Engineer", icon: Code },
  { id: "qa", label: "QA / SDET", icon: CheckCircle2 },
  { id: "product", label: "Product Manager", icon: Briefcase },
  { id: "founder", label: "Founder / Technical Lead", icon: Sparkles },
  { id: "other", label: "Other", icon: Hash },
];

const companySizes = [
  { id: "1-10", label: "Just me / 1-10" },
  { id: "11-50", label: "11-50 employees" },
  { id: "51-200", label: "51-200 employees" },
  { id: "201-1000", label: "201-1000 employees" },
  { id: "1000+", label: "1000+ employees" },
];

const primaryGoals = [
  { id: "automate_tests", label: "Automate E2E Tests", description: "Replace manual testing with AI-generated flows", icon: Zap },
  { id: "improve_quality", label: "Improve Code Quality", description: "Catch regressions before they reach production", icon: Target },
  { id: "save_time", label: "Speed up deployments", description: "Reduce QA bottleneck in CI/CD pipeline", icon: ArrowRight },
  { id: "other", label: "Other", description: "Exploring the platform capabilities", icon: Hash },
];

export default function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<"individual" | "company" | "">("");
  const [role, setRole] = useState("");
  const [roleOtherSpecify, setRoleOtherSpecify] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  
  // Verification states
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);

  const [loading, setLoading] = useState(false);

  const TOTAL_STEPS = accountType === "company" ? 4 : 3;

  const handleNext = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleSendCode = async () => {
    if (!companyEmail) return;
    setLoadingCode(true);
    // Mock sending code
    setTimeout(() => {
        setLoadingCode(false);
        setShowVerification(true);
    }, 1000);
  };

  const handleVerifyCode = async () => {
     if (verificationCode === "000000" || verificationCode.length === 6) {
         setLoadingCode(true);
         setTimeout(() => {
             setIsEmailVerified(true);
             setShowVerification(false);
             setLoadingCode(false);
         }, 800);
     }
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const finalRoleStr = role === 'other' ? roleOtherSpecify : role;
      
      const updateData = {
        role: finalRoleStr,
        account_type: accountType,
        primary_goal: primaryGoal,
        profile_completed: true,
        has_seen_tour: false // they will see the tour on dashboard
      } as any;

      if (accountType === 'company') {
          updateData.company_name = companyName;
          updateData.company_size = companySize;
          updateData.company_email = companyEmail;
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: updateData
      });
      if (authError) throw authError;

      const dbUpdateData = { ...updateData, role_other_specify: roleOtherSpecify };
      if (accountType === 'individual') {
          dbUpdateData.company_name = null;
          dbUpdateData.company_size = null;
          dbUpdateData.company_email = null;
      }

      await supabase.from('users').update(dbUpdateData).eq('id', user.id);

      window.location.href = '/dashboard';
    } catch (err: any) {
       console.error("Error updating profile:", err);
       alert("Failed to save profile: " + err.message);
       setLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return accountType !== "";
    if (step === 2) return role && (role !== 'other' || roleOtherSpecify.trim() !== '');
    if (accountType === "company") {
        if (step === 3) return companyName.trim() !== '' && companySize !== '' && isEmailVerified;
        if (step === 4) return primaryGoal !== '';
    } else {
        if (step === 3) return primaryGoal !== '';
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col font-sans">
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-[#050505]">
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-400 p-[1px]">
              <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">QA Copilot</span>
         </div>
         <div className="text-sm font-medium text-white/40">Step {step} of {TOTAL_STEPS}</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[20%] right-[30%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[20%] left-[30%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="w-full max-w-xl z-10">
            <div className="flex items-center gap-2 mb-12">
               {[...Array(TOTAL_STEPS)].map((_, i) => (
                 <div key={i} className={`h-1 flex-1 rounded-full overflow-hidden bg-white/5`}>
                     <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: step > i ? "100%" : "0%" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                        transition={{ duration: 0.3 }}
                     />
                 </div>
               ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                 <motion.div key="step1-account" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                     <div>
                         <h2 className="text-3xl font-bold tracking-tight text-white mb-2">How will you use QA Copilot?</h2>
                         <p className="text-white/50 text-lg">We'll customize your experience accordingly.</p>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                            onClick={() => setAccountType("individual")}
                            className={`p-6 rounded-2xl border transition-all text-left group ${accountType === "individual" ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10'}`}
                        >
                            <div className={`p-3 rounded-xl mb-4 inline-flex transition-colors ${accountType === "individual" ? 'bg-indigo-500 text-white' : 'bg-black/50 text-white/40 group-hover:text-white/70'}`}>
                                <UserIcon className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">For Personal Use</h3>
                            <p className="text-sm opacity-60 leading-relaxed">I am an individual exploring the platform for personal projects.</p>
                        </button>

                        <button 
                            onClick={() => setAccountType("company")}
                            className={`p-6 rounded-2xl border transition-all text-left group ${accountType === "company" ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10'}`}
                        >
                            <div className={`p-3 rounded-xl mb-4 inline-flex transition-colors ${accountType === "company" ? 'bg-emerald-500 text-white' : 'bg-black/50 text-white/40 group-hover:text-white/70'}`}>
                                <Building className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">For My Company</h3>
                            <p className="text-sm opacity-60 leading-relaxed">I am automating testing for my organization's products.</p>
                        </button>
                     </div>
                 </motion.div>
              )}

              {step === 2 && (
                 <motion.div key="step2-role" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                     <div>
                         <h2 className="text-3xl font-bold tracking-tight text-white mb-2">What best describes your role?</h2>
                         <p className="text-white/50 text-lg">We'll tailor your dashboard to your technical needs.</p>
                     </div>
                     <div className="space-y-3">
                         {roles.map(r => {
                            const Icon = r.icon;
                            const isSelected = role === r.id;
                            return (
                                <button 
                                  key={r.id} 
                                  onClick={() => {
                                      setRole(r.id);
                                      if (r.id !== 'other') setRoleOtherSpecify('');
                                  }}
                                  className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all text-left group ${isSelected ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10'}`}
                                >
                                    <div className={`p-2.5 rounded-lg transition-colors ${isSelected ? 'bg-indigo-500 text-white' : 'bg-black/50 text-white/40 group-hover:text-white/70'}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-base">{r.label}</span>
                                </button>
                            )
                         })}
                     </div>

                     <AnimatePresence>
                         {role === 'other' && (
                             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                 <div className="pt-2">
                                     <label className="text-sm font-medium text-white/70 px-1 mb-1.5 block">Please specify</label>
                                     <input
                                         type="text"
                                         placeholder="E.g. Data Scientist, UX Designer"
                                         value={roleOtherSpecify}
                                         onChange={(e) => setRoleOtherSpecify(e.target.value)}
                                         className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                         autoFocus
                                     />
                                 </div>
                             </motion.div>
                         )}
                     </AnimatePresence>
                 </motion.div>
              )}

              {step === 3 && accountType === "company" && (
                 <motion.div key="step3-company" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                     <div>
                         <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Company Details</h2>
                         <p className="text-white/50 text-lg">Use your organization's domain and name to unlock team features.</p>
                     </div>
                     <div className="space-y-6">
                         <div className="space-y-2">
                             <label className="text-sm font-medium text-white/70 px-1">Company Name</label>
                             <div className="relative">
                                 <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                 <input
                                     type="text"
                                     placeholder="Acme Corp"
                                     value={companyName}
                                     onChange={(e) => setCompanyName(e.target.value)}
                                     className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-lg text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                 />
                             </div>
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm font-medium text-white/70 px-1">Company Size</label>
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                 {companySizes.map(size => {
                                    const isSelected = companySize === size.id;
                                    return (
                                        <button 
                                          key={size.id} 
                                          onClick={() => setCompanySize(size.id)}
                                          className={`py-3 px-2 rounded-xl border transition-all text-sm ${isSelected ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10'}`}
                                        >
                                            <span className="font-medium">{size.label}</span>
                                        </button>
                                    )
                                 })}
                             </div>
                         </div>
                         <div className="space-y-2 p-4 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl" />
                             <label className="text-sm font-medium text-white/90 px-1 mb-2 block relative z-10">Work Email Verification</label>
                             {!showVerification && !isEmailVerified && (
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                        <input
                                            type="email"
                                            placeholder="you@company.com"
                                            value={companyEmail}
                                            onChange={(e) => setCompanyEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                        />
                                    </div>
                                    <button 
                                        disabled={loadingCode || !companyEmail.includes('@')}
                                        onClick={handleSendCode}
                                        className="py-3 px-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors shrink-0 flex items-center justify-center min-w-[120px]"
                                    >
                                        {loadingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Code"}
                                    </button>
                                </div>
                             )}

                             {showVerification && !isEmailVerified && (
                                 <div className="space-y-3 relative z-10">
                                    <p className="text-xs text-white/50">Enter the 6-digit code sent to <strong className="text-white">{companyEmail}</strong> (Use <span className="text-white font-mono bg-white/10 px-1 rounded">000000</span> for this demo)</p>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            placeholder="000000"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="flex-1 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-lg text-center tracking-[0.5em] text-white font-mono focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                                        />
                                        <button 
                                            disabled={loadingCode || verificationCode.length !== 6}
                                            onClick={handleVerifyCode}
                                            className="py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors shrink-0 flex items-center justify-center min-w-[120px]"
                                        >
                                           {loadingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                                        </button>
                                    </div>
                                 </div>
                             )}

                             {isEmailVerified && (
                                 <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 relative z-10 transition-all">
                                     <CheckCircle2 className="h-5 w-5 shrink-0" />
                                     <div className="text-sm font-medium">
                                         Verified: <span className="text-white">{companyEmail}</span>
                                     </div>
                                 </div>
                             )}
                         </div>
                     </div>
                 </motion.div>
              )}

              {((step === 4 && accountType === "company") || (step === 3 && accountType === "individual")) && (
                 <motion.div key="step-goal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                     <div>
                         <h2 className="text-3xl font-bold tracking-tight text-white mb-2">What is your primary goal?</h2>
                         <p className="text-white/50 text-lg">Select what you most want to achieve with QA Copilot's features.</p>
                     </div>
                     <div className="space-y-3">
                         {primaryGoals.map(goal => {
                            const Icon = goal.icon;
                            const isSelected = primaryGoal === goal.id;
                            return (
                                <button 
                                  key={goal.id} 
                                  onClick={() => setPrimaryGoal(goal.id)}
                                  className={`w-full p-4 rounded-xl border flex items-start gap-4 transition-all text-left group ${isSelected ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10'}`}
                                >
                                    <div className={`p-2.5 rounded-lg transition-colors shrink-0 mt-0.5 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-black/50 text-white/40 group-hover:text-white/70'}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-base text-white mb-1">{goal.label}</div>
                                        <div className={`text-sm ${isSelected ? 'text-indigo-200' : 'text-white/50'}`}>{goal.description}</div>
                                    </div>
                                </button>
                            )
                         })}
                     </div>
                 </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex items-center justify-between pt-6 border-t border-white/5">
                <button 
                  onClick={handlePrev}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-white/50 hover:text-white'}`}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                
                {step < TOTAL_STEPS ? (
                    <button 
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="px-6 py-3 bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      Continue <ArrowRight className="h-4 w-4" />
                    </button>
                ) : (
                    <button 
                      onClick={handleComplete}
                      disabled={!isStepValid() || loading}
                      className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Go to Dashboard"}
                      {!loading && <Target className="h-4 w-4" />}
                    </button>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
