import React, { useState, useEffect, useContext } from "react";
import api from "../service/api";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader2, UserPlus, CheckCircle2, Mail, Lock, User, Briefcase, ArrowRight } from "lucide-react";

const Register = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [searchParams] = useSearchParams();
    const initialRole = "user";
    const [role, setRole] = useState(initialRole);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            if (user.role === 'organiser') {
                navigate('/organiser');
            } else {
                navigate('/');
            }
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const urlRole = searchParams.get("role");
        if (urlRole === "organiser") setRole("organiser");
        else setRole("user");
    }, [searchParams]);

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await api.post("/auth/register", {
                ...credentials,
                role: role
            });
            setSuccess(`Registration successful! ${role === 'organiser' ? 'Await Organiser approval.' : 'You can now log in.'}`);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    if (authLoading) return (
        <div className="h-screen bg-[#050505] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
                <span className="font-urbanist font-bold text-[10px] uppercase tracking-[0.4em] text-gray-500">Syncing Intelligence...</span>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen lg:h-[calc(100vh-64px)] bg-[#050505] text-white selection:bg-white/20 overflow-y-auto lg:overflow-hidden">

            {/* Left Side: Form Panel */}
            <div className="w-full lg:w-[40%] flex items-center justify-center p-3 lg:p-4 relative">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[80px] pointer-events-none transform -translate-x-1/3 -translate-y-1/3" />

                <div className="w-full max-w-[360px] relative z-10">
                    <div className="mb-4">
                        {/* Custom Logo (Compact) */}
                        <Link to="/" className="inline-flex flex-col group cursor-pointer transition-transform duration-300 select-none mb-1">
                            <div className="flex items-end font-sans font-black tracking-[0.1em] text-white text-[22px] leading-[0.8]">
                                <span>TRAVE</span>
                                <div className="relative flex flex-col items-center justify-end w-[14px] h-[22px] ml-0.5">
                                    <div className="absolute top-0 w-[8px] h-[4px] border-[1.5px] border-white border-b-0 rounded-t-[2px]"></div>
                                    <div className="w-full h-[14px] border-l-[3px] border-b-[3px] border-t-[1px] border-r-[1px] border-white rounded-[2px] mt-1 relative flex justify-center overflow-hidden bg-[#050505]">
                                        <div className="w-[1px] h-full bg-white opacity-40 translate-x-[0.5px]"></div>
                                    </div>
                                    <div className="flex justify-between w-[12px] mt-[1px]">
                                        <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                                        <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <h1 className="text-[24px] font-urbanist font-bold text-white tracking-tight leading-tight">
                            Create Profile.
                        </h1>
                        <p className="text-gray-400 font-inter text-[13px]">
                            Join the journey.
                        </p>
                    </div>

                    <div className="bg-[#0a0a0a] rounded-[20px] border border-white/10 p-4 shadow-2xl relative overflow-hidden">

                        {!success && (
                            <div className="flex bg-[#050505] p-1 rounded-[10px] border border-white/5 mb-3">
                                <button
                                    onClick={() => setRole("user")}
                                    className={`flex-1 py-1.5 rounded-[8px] text-[13px] font-inter font-bold transition-all duration-300 flex items-center justify-center gap-2 ${role === "user"
                                        ? "bg-white text-black shadow-md"
                                        : "text-gray-500 hover:text-white"
                                        }`}
                                >
                                    <User className="w-3.5 h-3.5" />
                                    Traveler
                                </button>
                                <button
                                    onClick={() => setRole("organiser")}
                                    className={`flex-1 py-1.5 rounded-[8px] text-[13px] font-inter font-bold transition-all duration-300 flex items-center justify-center gap-2 ${role === "organiser"
                                        ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                                        : "text-gray-500 hover:text-white"
                                        }`}
                                >
                                    <Briefcase className="w-3.5 h-3.5" />
                                    Organiser
                                </button>
                            </div>
                        )}

                        {success ? (
                            <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-[14px] flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                    </div>
                                </div>
                                <h2 className="text-[22px] font-urbanist font-bold text-white mb-2 tracking-tight">
                                    Verified!
                                </h2>
                                <div className="bg-white/5 border border-white/10 text-gray-300 px-3 py-3 rounded-[10px] text-[13px] font-inter mb-6">
                                    {success}
                                </div>
                                <Link
                                    to="/login"
                                    className={`inline-flex items-center justify-center h-11 px-6 font-inter font-bold text-[14px] rounded-[10px] transition-all
                                        ${role === 'organiser' ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-white hover:bg-gray-200 text-black'}
                                    `}
                                >
                                    Login Now
                                </Link>
                            </div>
                        ) : (
                            <form className="space-y-3.5" autoComplete="off">
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-inter font-bold text-gray-400 uppercase tracking-widest" htmlFor="username">
                                        Alias / Username
                                    </label>
                                    <div className="relative">
                                        <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            id="username"
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-5 py-2.5 bg-[#050505] border border-white/10 rounded-[10px] focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all text-white font-inter text-[14px] placeholder-gray-600"
                                            placeholder="Username"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[10px] font-inter font-bold text-gray-400 uppercase tracking-widest" htmlFor="email">
                                        Email Profile
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="email"
                                            id="email"
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-5 py-2.5 bg-[#050505] border border-white/10 rounded-[10px] focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all text-white font-inter text-[14px] placeholder-gray-600"
                                            placeholder="you@example.com"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[10px] font-inter font-bold text-gray-400 uppercase tracking-widest" htmlFor="password">
                                        Security Key
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="password"
                                            id="password"
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-5 py-2.5 bg-[#050505] border border-white/10 rounded-[10px] focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all text-white font-inter text-[14px] placeholder-gray-600"
                                            placeholder="Password"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-[10px] text-[12px] font-inter">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleClick}
                                    disabled={loading}
                                    className={`w-full mt-1 h-11 font-urbanist text-[16px] font-bold rounded-[10px] transition-all flex items-center justify-center gap-2 group ${role === "organiser"
                                        ? "bg-emerald-500 hover:bg-emerald-400 text-black border border-emerald-400/20"
                                        : "bg-white hover:bg-gray-200 text-black border border-white/20"
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Joining...
                                        </>
                                    ) : (
                                        <>
                                            Register
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="mt-4 text-center text-gray-500 font-inter text-[13px]">
                        Already active?{" "}
                        <Link
                            to="/login"
                            className="text-white font-bold hover:text-gray-300 transition-colors border-b border-white/30 hover:border-white pb-0.5"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side: Image Panel */}
            <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/30 z-10 transition-colors duration-700 pointer-events-none group-hover:bg-black/10"></div>
                <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
                    alt="Travel Background"
                    className="w-full h-full object-cover object-center opacity-90 animate-in fade-in duration-1000 group-hover:scale-105 transition-transform duration-[20s]"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050505] z-20"></div>

                <div className="absolute top-16 right-16 z-30 max-w-md text-right">
                    <p className="font-inter font-bold uppercase tracking-widest text-[11px] text-gray-300 mb-4 flex items-center justify-end gap-2">
                        System Setup <span className="w-8 h-px bg-gray-300"></span>
                    </p>
                    <h2 className="font-urbanist font-bold text-[48px] leading-tight text-white mb-4">
                        Unlock the Globe.
                    </h2>
                    <p className="font-inter text-gray-400 text-[16px] leading-relaxed ml-auto max-w-sm">
                        Become a part of the network. Generate AI itineraries, chat with experts, and document your coordinates.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Register;
