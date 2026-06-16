import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Zap, Github, ArrowRight, Bot, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';

interface OnboardingTourModalProps {
    onComplete: () => void;
}

export default function OnboardingTourModal({ onComplete }: OnboardingTourModalProps) {
    const [step, setStep] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const markTourSeen = async () => {
        if (!user) return;
        setLoading(true);
        // Updating user metadata so App.tsx knows
        await supabase.auth.updateUser({
            data: { has_seen_tour: true }
        });
        await supabase.from('users').update({ has_seen_tour: true }).eq('id', user.id);
        setLoading(false);
        onComplete();
        navigate('/onboarding');
    };

    const steps = [
        {
            title: "Intelligent URL Analysis",
            description: "Provide any target URL and our agentic engine maps its DOM surface. It autonomously identifies components, forms, and interaction layers to write comprehensive end-to-end specifications.",
            icon: Target,
            color: "indigo"
        },
        {
            title: "CI/CD & GitHub Automation",
            description: "Deploy with confidence. Our tests integrate directly with your GitHub workflows via PR hooks—running validations in ephemeral environments before code reaches production.",
            icon: Github,
            color: "emerald"
        },
        {
            title: "Continuous Auto-Healing",
            description: "Never rewrite a selector again. When your UI changes, our intelligent locators dynamically adapt to DOM mutations, keeping your test suite resilient and maintenance-free.",
            icon: Zap,
            color: "purple"
        }
    ];

    const colorMap: Record<string, { bg: string, text: string, border: string, bgGradient: string, activeBar: string }> = {
        indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', bgGradient: 'from-indigo-500/5', activeBar: 'bg-indigo-400' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', bgGradient: 'from-emerald-500/5', activeBar: 'bg-emerald-400' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', bgGradient: 'from-purple-500/5', activeBar: 'bg-purple-400' }
    };

    const currentStep = steps[step];
    const Icon = currentStep?.icon;
    const colors = currentStep ? colorMap[currentStep.color] : colorMap['indigo'];

    if (step >= steps.length) {
        return (
             <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }}
                 className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
             >
                 <motion.div 
                     initial={{ scale: 0.95, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="bg-[#0A0A0B] border border-white/10 p-8 rounded-3xl max-w-md w-full text-center relative overflow-hidden"
                 >
                     <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
                     
                     <div className="relative z-10">
                         <div className="h-16 w-16 mx-auto bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-2xl flex items-center justify-center p-[2px] mb-6">
                             <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                                 <Zap className="h-8 w-8 text-white" />
                             </div>
                         </div>
                         <h2 className="text-2xl font-bold text-white mb-3">You're all set!</h2>
                         <p className="text-white/50 text-base mb-8">Let's create your first project by analyzing your application's URL. The AI will do the heavy lifting.</p>
                         
                         <button 
                             onClick={markTourSeen}
                             disabled={loading}
                             className="w-full py-4 bg-white hover:bg-white/90 text-black rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                         >
                             {loading ? "Preparing..." : "Create First Project"}
                             {!loading && <ArrowRight className="h-4 w-4" />}
                         </button>
                     </div>
                 </motion.div>
             </motion.div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#0E0E11] border border-white/10 rounded-3xl max-w-2xl w-full flex flex-col md:flex-row overflow-hidden shadow-2xl relative"
            >
               {/* Decorative Gradient Background */}
               <div className={`absolute inset-0 bg-gradient-to-br ${colors.bgGradient} to-transparent pointer-events-none`} />

               {/* Left Visual Area */}
               <div className={`w-full md:w-2/5 p-8 flex items-center justify-center bg-black/40 border-r border-white/5 relative z-10`}>
                    <div className={`h-24 w-24 rounded-2xl ${colors.bg} border ${colors.border} flex flex-col items-center justify-center`}>
                        <Icon className={`h-12 w-12 ${colors.text} mb-2`} />
                        <div className={`w-12 h-1 rounded-full ${colors.bg} bg-opacity-50`} />
                    </div>
               </div>

               {/* Right Content Area */}
               <div className="w-full md:w-3/5 p-8 sm:p-10 flex flex-col justify-between relative z-10">
                    <div>
                        <div className="flex gap-2 mb-8">
                            {steps.map((_, i) => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i === step ? colors.activeBar : 'bg-white/10'}`} />
                            ))}
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">{currentStep.title}</h2>
                        <p className="text-white/60 text-base leading-relaxed">{currentStep.description}</p>
                    </div>

                    <div className="mt-10 flex items-center justify-between">
                         <button 
                             onClick={markTourSeen}
                             className="text-sm font-medium text-white/40 hover:text-white transition-colors"
                         >
                             Skip Tour
                         </button>
                         <button 
                             onClick={() => setStep(s => s + 1)}
                             className={`px-6 py-3 bg-white text-black hover:bg-white/90 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors`}
                         >
                             Next <ArrowRight className="h-4 w-4" />
                         </button>
                    </div>
               </div>
            </motion.div>
        </div>
    );
}
