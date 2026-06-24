import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Zap, Server, CheckCircle2, Mail } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';

export default function Settings() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data) setSubscription(data);
      } catch(err) {
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [user]);

  const planCreditsMap: Record<string, number> = {
    'Free': 50,
    'Starter': 250,
    'Growth': 1500
  };

  const totalCredits = subscription ? (planCreditsMap[subscription.plan_tier] || 50) : 50;
  const usedCredits = subscription ? (totalCredits - Math.max(0, subscription.test_credits_remaining)) : 0;
  const usagePercentage = subscription ? (usedCredits / totalCredits) * 100 : 0;

  return (
    <DashboardLayout>
      <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-black/20 backdrop-blur-sm z-10 shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Setup & Billing</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Workspace Settings</h2>
            <p className="text-sm text-white/40 italic">Manage your billing, subscription limits, and team configuration.</p>
          </div>

          <div className="grid gap-6">

            {/* Current Plan Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0E0E11] border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Current Plan</div>
                    <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                      {loading ? '...' : (subscription?.plan_tier || 'Free')} <span className="text-sm text-white/40 font-normal italic">({subscription?.plan_tier === 'Growth' ? '$149/mo' : (subscription?.plan_tier === 'Starter' ? '$59/mo' : '$0/mo')})</span>
                    </h3>
                  </div>
                  <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                    Upgrade to Scale
                  </button>
                </div>

                {/* Usage Metering */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-white uppercase tracking-widest mb-2">
                      <span>Test Runs (Billing Cycle)</span>
                      <span>{usedCredits} <span className="text-white/40">/ {totalCredits}</span></span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400" 
                        initial={{ width: "0%" }}
                        animate={{ width: `${usagePercentage}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <p className="text-[11px] text-white/40 mt-2 font-mono">
                      {subscription?.subscription_status === 'Active' ? 'Active Subscription' : 'Upgrade for more runs.'}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs font-bold text-white uppercase tracking-widest mb-2">
                      <span>Projects</span>
                      <span>1 <span className="text-white/40">/ {subscription?.plan_tier === 'Free' ? 1 : 10}</span></span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        className="h-full bg-indigo-500" 
                        initial={{ width: "0%" }}
                        animate={{ width: `${(1 / (subscription?.plan_tier === 'Free' ? 1 : 10)) * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0E0E11] border border-white/10 rounded-2xl p-6 relative z-10"
            >
              <h3 className="text-base font-bold tracking-tight text-white mb-6">Payment Method</h3>
              <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-12 bg-white rounded flex items-center justify-center p-1">
                    {/* Placeholder for Visa/Mastercard SVG */}
                    <CreditCard className="h-6 w-8 text-[#1434CB]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white font-mono">•••• •••• •••• 4242</div>
                    <div className="text-xs text-white/40 italic">Expires 12/28</div>
                  </div>
                </div>
                <button className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm">
                  Update
                </button>
              </div>
            </motion.div>
            
            {/* Danger Zone */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/20 border border-rose-500/20 rounded-2xl p-6 relative z-10"
            >
              <h3 className="text-base font-bold tracking-tight text-rose-400 mb-2">Danger Zone</h3>
              <p className="text-sm text-white/40 italic mb-6">Permanently delete your workspace and all generated tests.</p>
              <button className="px-6 py-2 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors">
                Delete Workspace
              </button>
            </motion.div>

          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
