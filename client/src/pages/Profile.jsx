import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../service/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/toast';
import { User, Mail, Phone, Lock, Save, Camera, Shield, BadgeCheck, MapPin, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout, checkAuth } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('details'); // details, security

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        phone: '',
        avatar: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || '',
                phone: user.phone || '',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/users/profile', formData);
            await checkAuth(); // Sync context
            toast({ title: "Profile Updated", description: "Your credentials have been synchronized.", type: "success" });
        } catch (error) {
            toast({ title: "Update Failed", description: error.response?.data?.message || "Internal server error.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({ title: "Logic Error", description: "New passwords do not match.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            await api.put('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast({ title: "Passkey Updated", description: "Your security credentials are now active.", type: "success" });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast({ title: "Security Alert", description: error.response?.data?.message || "Invalid current passkey.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-inter py-6 px-4 md:px-8 overflow-x-hidden">
            <div className="max-w-[1100px] mx-auto">

                {/* Executive Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/5 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 text-emerald-500">
                            <div className="w-6 h-[1px] bg-emerald-500/50"></div>
                            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Personal Node</span>
                        </div>
                        <h1 className="text-[26px] sm:text-[32px] lg:text-[40px] font-urbanist font-bold leading-tight tracking-tight">
                            Identity <br className="hidden md:block" />
                            <span className="text-gray-400 italic font-handwriting lowercase tracking-normal text-[18px] sm:text-[20px] lg:text-[28px]">Management</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center justify-center gap-2.5 px-4 py-1.5 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-sm font-urbanist font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all h-9 w-full md:w-auto mt-2 md:mt-0"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        De-authorize Session
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Perspective Navigation */}
                    <div className="lg:col-span-4 space-y-6 sm:space-y-8">
                        <div className="relative group rounded-sm overflow-hidden border border-white/10 aspect-square max-w-[200px] sm:max-w-[220px] bg-[#0a0a0a] flex items-center justify-center mx-auto lg:mx-0 shadow-2xl">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" />
                            ) : (
                                <User className="w-20 sm:w-24 h-20 sm:h-24 text-gray-800" />
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60"></div>

                            <button className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 p-3 sm:p-4 bg-white text-black rounded-sm shadow-2xl hover:bg-gray-200 transition-all active:scale-95">
                                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex gap-2">
                                <div className="bg-emerald-500/10 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 border border-emerald-500/20 flex items-center gap-2">
                                    <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
                                    <span className="text-[8px] sm:text-[9px] font-black text-white uppercase tracking-widest">Active</span>
                                </div>
                            </div>
                        </div>

                        <nav className="flex flex-wrap lg:flex-col gap-2 p-1 bg-white/[0.03] lg:bg-transparent rounded-lg lg:rounded-none lg:border-l lg:border-white/5 lg:pl-6">
                            {[
                                { id: 'details', icon: User, label: 'Standard Metadata' },
                                { id: 'security', icon: Shield, label: 'Security Protocols' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 min-w-[140px] lg:flex-none flex flex-col gap-1 px-3 sm:px-4 py-2 sm:py-2.5 transition-all relative group text-left ${activeTab === tab.id
                                        ? 'text-white bg-white/[0.05] lg:bg-transparent'
                                        : 'text-gray-500 hover:text-gray-300'
                                        } rounded-md lg:rounded-none`}
                                >
                                    {activeTab === tab.id && <div className="hidden lg:block absolute left-[-25px] top-0 bottom-0 w-[2px] bg-white"></div>}
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <tab.icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${activeTab === tab.id ? 'text-white' : 'text-gray-600'}`} />
                                        <span className={`text-[14px] sm:text-[16px] lowercase font-handwriting tracking-wide ${activeTab === tab.id ? 'text-emerald-400' : 'text-gray-500'}`}>
                                            {tab.id === 'details' ? 'personal' : 'tactical'}
                                        </span>
                                    </div>
                                    <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Operational Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-[#0a0a0a] border border-white/10 p-4 sm:p-6 lg:p-10 rounded-sm shadow-2xl relative overflow-hidden">
                            {/* Tactical Background Element */}
                            <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none rotate-12">
                                <Shield className="w-24 sm:w-32 h-24 sm:h-32" />
                            </div>

                            {activeTab === 'details' ? (
                                <form onSubmit={handleProfileUpdate} className="space-y-5 sm:space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 ml-0.5">Username</label>
                                            <input
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                placeholder="OPERATOR_NAME"
                                                className="w-full bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 font-urbanist font-bold text-[14px] text-white rounded-sm focus:outline-none focus:border-white transition-all placeholder:text-gray-800"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 ml-0.5">Email Address</label>
                                            <input
                                                value={formData.email}
                                                disabled
                                                className="w-full bg-white/[0.01] border border-white/5 p-3.5 sm:p-4 font-urbanist font-bold text-[14px] text-gray-600 rounded-sm cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 ml-0.5">Contact Vector</label>
                                            <input
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+91 00000 00000"
                                                className="w-full bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 font-urbanist font-bold text-[14px] text-white rounded-sm focus:outline-none focus:border-white transition-all placeholder:text-gray-800"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 ml-0.5">Avatar Schema (URL)</label>
                                            <input
                                                value={formData.avatar}
                                                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                                placeholder="https://images.unsplash.com/..."
                                                className="w-full bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 font-urbanist font-bold text-[14px] text-white rounded-sm focus:outline-none focus:border-white transition-all placeholder:text-gray-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 ml-0.5">Node Biography</label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            rows={5}
                                            placeholder="Specify node objectives and travel philosophy..."
                                            className="w-full bg-white/[0.03] border border-white/10 p-4 sm:p-6 font-medium text-[14px] text-gray-300 rounded-sm focus:outline-none focus:border-white transition-all placeholder:text-gray-800 resize-none leading-relaxed"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex justify-start">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="h-10 px-6 bg-white hover:bg-gray-200 text-black rounded-sm font-urbanist font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-2 w-full sm:w-auto overflow-hidden justify-center"
                                        >
                                            <Save className="w-3.5 h-3.5" />
                                            {loading ? 'Processing...' : 'Sync Identity'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handlePasswordChange} className="space-y-8 sm:space-y-10 relative z-10">
                                    <div className="max-w-md space-y-6 sm:space-y-8">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 ml-0.5">Current Passkey</label>
                                            <input
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 font-urbanist font-bold text-[14px] text-white rounded-sm focus:outline-none focus:border-white transition-all placeholder:text-gray-800"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 ml-0.5">New Passkey</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 font-urbanist font-bold text-[14px] text-white rounded-sm focus:outline-none focus:border-white transition-all placeholder:text-gray-800"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 ml-0.5">Confirm Passkey</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full bg-white/[0.01] border border-white/10 p-3.5 sm:p-4 font-urbanist font-bold text-[14px] text-white rounded-sm focus:outline-none focus:border-white transition-all placeholder:text-gray-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex justify-start">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="h-10 px-6 bg-white hover:bg-gray-200 text-black rounded-sm font-urbanist font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center"
                                        >
                                            <Shield className="w-3.5 h-3.5" />
                                            {loading ? 'Validating...' : 'Update Protocols'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
