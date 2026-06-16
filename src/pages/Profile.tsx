import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { User as UserIcon, Building, Mail, Target, Briefcase, Calendar, AlertCircle, Edit2, Save, X, Loader2, ImagePlus } from "lucide-react";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../lib/supabase";

export default function Profile() {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase.from('users').select('*').eq('id', user?.id).single();
            if (error) throw error;
            setProfileData(data);
            setFormData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = {
                full_name: formData.full_name,
                account_type: formData.account_type,
                company_name: formData.account_type === 'company' ? formData.company_name : null,
                company_size: formData.account_type === 'company' ? formData.company_size : null,
                company_email: formData.account_type === 'company' ? formData.company_email : null,
                primary_goal: formData.primary_goal,
                updated_at: new Date().toISOString(),
            };
            
            const { error: updateError } = await supabase
                .from('users')
                .update(updates)
                .eq('id', user?.id);

            if (updateError) throw updateError;
            
            setProfileData({ ...profileData, ...updates });
            setIsEditing(false);
        } catch (err: any) {
            alert("Failed to save profile: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 text-white/50 animate-pulse flex items-center gap-3">
                     <Loader2 className="h-5 w-5 animate-spin" /> Loading profile data...
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="p-8 text-red-400 bg-red-400/10 rounded-xl m-8 border border-red-400/20">Error loading profile: {error}</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Your Profile</h1>
                        <p className="text-white/50 text-sm mt-1">Manage your professional identity and workspace details.</p>
                    </div>
                    {isEditing ? (
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => { setIsEditing(false); setFormData(profileData); }}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                disabled={saving}
                            >
                                <X className="h-4 w-4" /> Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-black hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} 
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/5 text-white hover:bg-white/10 border border-white/5 transition-all flex items-center gap-2"
                        >
                            <Edit2 className="h-4 w-4" /> Edit Profile
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Avatar & Core Info */}
                    <div className="space-y-6">
                        <div className="bg-[#0A0A0B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="h-28 w-28 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center overflow-hidden shadow-xl shadow-indigo-500/5">
                                         {user?.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                                         ) : (
                                            <span className="text-4xl font-bold text-white/40">{formData?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}</span>
                                         )}
                                    </div>
                                    {isEditing && (
                                        <button className="absolute bottom-0 right-0 p-2 bg-indigo-500 rounded-full text-white hover:bg-indigo-400 transition-colors shadow-lg border-2 border-[#0A0A0B]">
                                            <ImagePlus className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-center text-white font-bold w-full focus:outline-none focus:border-indigo-500 mb-2"
                                        value={formData.full_name || ''}
                                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                        placeholder="Full Name"
                                    />
                                ) : (
                                    <h2 className="text-xl font-bold text-white truncate w-full">{profileData?.full_name || 'Anonymous User'}</h2>
                                )}
                                
                                <p className="text-sm text-white/50 truncate w-full mt-1 mb-4">{user?.email}</p>
                                
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-white/70">
                                    <Briefcase className="h-3 w-3" />
                                    {profileData?.role?.toUpperCase() || 'MEMBER'}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-[#0A0A0B] border border-white/5 rounded-2xl p-6">
                            <label className="text-xs text-white/40 font-medium uppercase tracking-wider block mb-4">Member Since</label>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-white/40" />
                                </div>
                                <div>
                                    <div className="text-white font-medium">{new Date(profileData?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                    <div className="text-white/40 text-xs">Joined TrustWall</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Deep Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Account Details Block */}
                        <div className="bg-[#0A0A0B] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Account Details</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs text-white/40 font-medium uppercase tracking-wider block mb-3">Account Type</label>
                                    {isEditing ? (
                                        <div className="flex gap-4">
                                            {['individual', 'company'].map(type => (
                                                <label key={type} className="flex-1 cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name="account_type" 
                                                        value={type}
                                                        className="hidden group"
                                                        checked={formData.account_type === type}
                                                        onChange={(e) => setFormData({...formData, account_type: e.target.value})}
                                                    />
                                                    <div className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${formData.account_type === type ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}>
                                                        {type === 'individual' ? <UserIcon className="h-5 w-5" /> : <Building className="h-5 w-5" />}
                                                        <span className="font-semibold capitalize text-sm">{type}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="h-10 w-10 rounded-full bg-[#0E0E11] flex items-center justify-center border border-white/5">
                                                {profileData?.account_type === 'company' ? <Building className="h-5 w-5 text-indigo-400" /> : <UserIcon className="h-5 w-5 text-emerald-400" />}
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold capitalize">{profileData?.account_type || 'Individual'}</div>
                                                <div className="text-white/40 text-xs">Current Plan: Pro</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {formData.account_type === 'company' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                        <div>
                                            <label className="text-xs text-white/40 font-medium uppercase tracking-wider block mb-2">Company Name</label>
                                            {isEditing ? (
                                                <input 
                                                    type="text" 
                                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                                    value={formData.company_name || ''}
                                                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                                                    placeholder="Acme Corp"
                                                />
                                            ) : (
                                                <div className="text-white px-4 py-2.5 bg-white/5 rounded-lg border border-white/5 font-medium">{profileData?.company_name || '-'}</div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/40 font-medium uppercase tracking-wider block mb-2">Company Size</label>
                                            {isEditing ? (
                                                <select 
                                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                                                    value={formData.company_size || ''}
                                                    onChange={(e) => setFormData({...formData, company_size: e.target.value})}
                                                >
                                                    <option value="" disabled>Select size</option>
                                                    <option value="1-10">1-10 employees</option>
                                                    <option value="11-50">11-50 employees</option>
                                                    <option value="51-200">51-200 employees</option>
                                                    <option value="201-500">201-500 employees</option>
                                                    <option value="500+">500+ employees</option>
                                                </select>
                                            ) : (
                                                <div className="text-white px-4 py-2.5 bg-white/5 rounded-lg border border-white/5 font-medium">{profileData?.company_size || '-'}</div>
                                            )}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="text-xs text-white/40 font-medium uppercase tracking-wider block mb-2">Work Email</label>
                                            {isEditing ? (
                                                <input 
                                                    type="email" 
                                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                                    value={formData.company_email || ''}
                                                    onChange={(e) => setFormData({...formData, company_email: e.target.value})}
                                                    placeholder="work@company.com"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-3 px-4 py-2.5 bg-white/5 rounded-lg border border-white/5">
                                                    <Mail className="h-4 w-4 text-white/40" />
                                                    <span className="text-white flex-1 font-medium">{profileData?.company_email || '-'}</span>
                                                    {profileData?.company_email && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border border-emerald-500/20">Verified</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-white/5">
                                    <label className="text-xs text-white/40 font-medium uppercase tracking-wider block mb-2">Primary Goal</label>
                                    {isEditing ? (
                                        <select 
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                                            value={formData.primary_goal || ''}
                                            onChange={(e) => setFormData({...formData, primary_goal: e.target.value})}
                                        >
                                            <option value="" disabled>What are you trying to achieve?</option>
                                            <option value="test_automation">Automate End-to-End Testing</option>
                                            <option value="freelance_qa">Freelance QA Work</option>
                                            <option value="exploring">Exploring the Platform</option>
                                            <option value="ci_cd">CI/CD Integration</option>
                                            <option value="other">Other</option>
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg border border-white/5 text-white font-medium capitalize">
                                            <Target className="h-5 w-5 text-indigo-400" />
                                            {profileData?.primary_goal?.replace(/_/g, ' ') || 'Not specified'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Educational Message */}
                        {!isEditing && (
                            <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 rounded-xl p-5 flex gap-4">
                                 <AlertCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                                 <div>
                                    <h4 className="text-white font-semibold mb-1 text-sm">Professional Profile</h4>
                                    <p className="text-sm text-white/50 leading-relaxed">
                                        Your profile details help tailor the TrustWall experience completely to your workflow. Enterprise accounts unlock advanced routing, team collaboration, and priority test queues.
                                    </p>
                                 </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

