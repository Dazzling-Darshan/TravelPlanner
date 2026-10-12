import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, ArrowLeft, ShieldCheck, MailQuestion } from "lucide-react";
import api from "../service/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post("/auth/forgot-password", { email });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed. Verify connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen lg:h-[calc(100vh-64px)] bg-[#050505] text-white selection:bg-white/20 overflow-y-auto lg:overflow-hidden">
            {/* Left Side: System Diagnostic Visual */}
            <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
                <img
                    src="https://images.unsplash.com/photo-1540959733332-e94e270b4d82?q=80&w=1920&auto=format&fit=crop"
                    alt="Reset Background"
                    className="w-full h-full object-cover object-center opacity-80 animate-in fade-in duration-1000 group-hover:scale-105 transition-transform duration-[20s] grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505] z-20"></div>

                <div className="absolute bottom-16 left-16 z-30 max-w-md">
                    <p className="font-inter font-bold uppercase tracking-widest text-[11px] text-gray-500 mb-4 flex items-center gap-2">
                        <span className="w-8 h-px bg-gray-500"></span> Recovery Protocol
                    </p>
                    <h2 className="font-urbanist font-bold text-[48px] leading-tight text-white mb-4">
                        Secure Access Reset.
                    </h2>
                    <p className="font-inter text-gray-500 text-[16px] leading-relaxed">
                        Requesting a security override. Enter your registered node ID to receive a recovery link.
                    </p>
                </div>
            </div>

            {/* Right Side: Reset Form */}
            <div className="w-full lg:w-[40%] flex items-center justify-center p-4 relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[80px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />

                <div className="w-full max-w-[360px] relative z-10">
                    <div className="mb-6">
                        <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[12px] font-black uppercase tracking-widest mb-6 group">
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Back to Access
                        </Link>
                        <h1 className="text-[28px] font-urbanist font-bold text-white tracking-tight leading-tight mb-2">
                            Reset frequency.
                        </h1>
                        <p className="text-gray-500 font-inter text-[13px]">
                            Enter your email to verify identity.
                        </p>
                    </div>

                    <div className="bg-[#0a0a0a] rounded-[24px] border border-white/10 p-6 lg:p-8 shadow-2xl relative overflow-hidden">
                        {success ? (
                            <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-white flex items-center justify-center text-black rounded-sm ring-4 ring-white/10">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                </div>
                                <h2 className="text-[22px] font-urbanist font-bold text-white mb-3 tracking-tight">Signal Sent.</h2>
                                <p className="text-gray-400 font-inter text-[14px] mb-8 leading-relaxed">
                                    Check your encrypted feed for the recovery link sent to <span className="text-white font-bold">{email}</span>.
                                </p>
                                <Link
                                    to="/login"
                                    className="w-full flex items-center justify-center h-12 bg-white text-black font-urbanist font-bold rounded-sm hover:bg-gray-200 transition-all uppercase tracking-widest text-[12px]"
                                >
                                    Return to Authentication
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-inter font-bold text-gray-500 uppercase tracking-[0.2em]" htmlFor="email">
                                        Node Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-5 py-3.5 bg-[#050505] border border-white/10 rounded-sm focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all text-white font-inter text-[14px] placeholder-gray-700"
                                            placeholder="identity@network.com"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-sm text-[12px] font-inter flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-none animate-pulse" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-white text-black font-urbanist font-bold rounded-sm transition-all flex items-center justify-center gap-2 group hover:bg-gray-200 uppercase tracking-widest text-[12px]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Request Reset
                                            <MailQuestion className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="mt-8 text-center text-gray-600 font-inter text-[12px] uppercase tracking-widest">
                        System secure. <span className="text-white">Stay active.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
