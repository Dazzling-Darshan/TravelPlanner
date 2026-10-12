import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../service/api";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Mail, Lock, User, Briefcase, ArrowRight } from "lucide-react";

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [loginType, setLoginType] = useState("user"); // "user" | "organiser"

    const { user, loading, error, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect if already logged in
    React.useEffect(() => {
        if (!loading && user) {
            if (user.role === 'organiser') {
                navigate('/organiser');
            } else {
                navigate('/');
            }
        }
    }, [user, loading, navigate]);

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await api.post("/auth/login", credentials);
            const userRole = res.data.user.role;

            if (loginType === 'organiser') {
                if (userRole !== 'organiser') {
                    throw new Error("Access Denied: You are not an organiser.");
                }
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
                navigate('/organiser');
            } else {
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
                navigate('/');
            }
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err.response?.data?.message || err.message });
        }
    };

    if (loading) return (
        <div className="h-screen bg-[#050505] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
                <span className="font-urbanist font-bold text-[10px] uppercase tracking-[0.4em] text-gray-500">Syncing Intelligence...</span>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen lg:h-[calc(100vh-64px)] bg-[#050505] text-white selection:bg-white/20 overflow-y-auto lg:overflow-hidden">
            {/* Left Side: Image Panel */}
            <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/30 z-10 transition-colors duration-700 pointer-events-none group-hover:bg-black/10"></div>
                <img
                    src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1920&auto=format&fit=crop"
                    alt="Travel Background"
                    className="w-full h-full object-cover object-center opacity-90 animate-in fade-in duration-1000 group-hover:scale-105 transition-transform duration-[20s]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505] z-20"></div>

                <div className="absolute bottom-16 left-16 z-30 max-w-md">
                    <p className="font-inter font-bold uppercase tracking-widest text-[11px] text-gray-300 mb-4 flex items-center gap-2">
                        <span className="w-8 h-px bg-gray-300"></span> System Access
                    </p>
                    <h2 className="font-urbanist font-bold text-[48px] leading-tight text-white mb-4">
                        Continue your journey.
                    </h2>
                    <p className="font-inter text-gray-400 text-[16px] leading-relaxed">
                        Log in to interact with travelers, access curated intelligence, and explore the globe seamlessly.
                    </p>
                </div>
            </div>

            {/* Right Side: Form Panel */}
            <div className="w-full lg:w-[40%] flex items-center justify-center p-3 lg:p-4 relative">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[80px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />

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
                            Welcome back.
                        </h1>
                        <p className="text-gray-400 font-inter text-[13px]">
                            Enter your credentials.
                        </p>
                    </div>

                    <div className="bg-[#0a0a0a] rounded-[20px] border border-white/10 p-4 shadow-2xl relative overflow-hidden">
                        {/* Role Selection */}
                        <div className="flex bg-[#050505] p-1 rounded-[10px] border border-white/5 mb-3">
                            <button
                                onClick={() => setLoginType("user")}
                                className={`flex-1 py-1.5 rounded-[8px] text-[13px] font-inter font-bold transition-all duration-300 flex items-center justify-center gap-2 ${loginType === "user"
                                    ? "bg-white text-black shadow-md"
                                    : "text-gray-500 hover:text-white"
                                    }`}
                            >
                                <User className="w-3.5 h-3.5" />
                                Traveler
                            </button>
                            <button
                                onClick={() => setLoginType("organiser")}
                                className={`flex-1 py-1.5 rounded-[8px] text-[13px] font-inter font-bold transition-all duration-300 flex items-center justify-center gap-2 ${loginType === "organiser"
                                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                                    : "text-gray-500 hover:text-white"
                                    }`}
                            >
                                <Briefcase className="w-3.5 h-3.5" />
                                Organiser
                            </button>
                        </div>

                        <form onSubmit={handleClick} className="space-y-3.5">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-inter font-bold text-gray-400 uppercase tracking-widest" htmlFor="email">
                                    Email Profile
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        id="email"
                                        autoComplete="email"
                                        required
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-5 py-2.5 bg-[#050505] border border-white/10 rounded-[10px] focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all text-white font-inter text-[14px] placeholder-gray-600"
                                        placeholder="you@example.com"
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
                                        autoComplete="current-password"
                                        required
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-5 py-2.5 bg-[#050505] border border-white/10 rounded-[10px] focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all text-white font-inter text-[14px] placeholder-gray-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-[10px] text-[12px] font-inter">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full mt-1 h-11 font-urbanist text-[16px] font-bold rounded-[10px] transition-all flex items-center justify-center gap-2 group ${loginType === "organiser"
                                    ? "bg-emerald-500 hover:bg-emerald-400 text-black border border-emerald-400/20"
                                    : "bg-white hover:bg-gray-200 text-black border border-white/20"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Checking...
                                    </>
                                ) : (
                                    <>
                                        Login
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-4 flex flex-col items-center gap-2">
                        <div className="text-gray-500 font-inter text-[13px]">
                            Don't have an account?{" "}
                            <Link
                                to={loginType === 'organiser' ? "/register?role=organiser" : "/register"}
                                className="text-white font-bold hover:text-gray-300 transition-colors border-b border-white/30 hover:border-white pb-0.5"
                            >
                                Sign Up
                            </Link>
                        </div>
                        <Link
                            to="/forgot-password"
                            className="mt-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[12px] font-inter font-black text-white !text-white hover:bg-white/10 transition-all uppercase tracking-[0.2em]"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
