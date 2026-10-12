import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#050505] pt-16 sm:pt-24 pb-12 text-white font-inter border-t border-white/5 relative overflow-hidden">
            {/* Subtle background glow for premium feel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-white/[0.01] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-20 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-16 sm:mb-20">

                    {/* Left Column (Logo & Newsletter) */}
                    <div className="w-full lg:w-[40%] flex flex-col items-center lg:items-start text-center lg:text-left">
                        <Link to="/" className="flex flex-col group cursor-pointer transition-transform duration-300 select-none mb-8 sm:mb-10">
                            <div className="flex items-end font-sans font-black tracking-[0.1em] text-white text-[24px] sm:text-[28px] leading-[0.8]">
                                <span>TRAVE</span>
                                <div className="relative flex flex-col items-center justify-end w-[18px] h-[28px] ml-0.5">
                                    <div className="absolute top-0 w-[10px] h-[5px] border-[2px] border-white border-b-0 rounded-t-[3px]"></div>
                                    <div className="w-full h-[18px] border-l-[4px] border-b-[4px] border-t-[1.5px] border-r-[1.5px] border-white rounded-[3px] mt-1 relative flex justify-center overflow-hidden bg-[#050505]">
                                        <div className="w-[1.5px] h-full bg-white opacity-40 translate-x-[1px]"></div>
                                    </div>
                                    <div className="flex justify-between w-[14px] mt-[1.5px]">
                                        <div className="w-[4px] h-[4px] bg-white rounded-full"></div>
                                        <div className="w-[4px] h-[4px] bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.35em] text-gray-500 mt-1 pl-1">
                                AROUND
                            </span>
                        </Link>

                        <p className="text-gray-400 font-medium text-[14px] sm:text-[15px] mb-8 lg:max-w-md">
                            Revolutionizing travel planning with AI. Build, explore, and embark on your perfect journey in seconds.
                        </p>

                        <div className="w-full max-w-sm sm:max-w-md">
                            <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 block">Newsletter</h4>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white text-[14px] placeholder:text-gray-600 transition-all font-inter"
                                />
                                <button className="px-6 py-3.5 bg-white text-black hover:bg-gray-200 rounded-xl font-bold font-inter text-[14px] transition-all whitespace-nowrap active:scale-95">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns Container */}
                    <div className="w-full lg:w-[50%] grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-4">

                        {/* Product Column */}
                        <div className="flex flex-col">
                            <h4 className="font-bold text-[13px] uppercase tracking-widest text-white mb-6 sm:mb-8">Product</h4>
                            <ul className="space-y-4 text-[14px] text-gray-400 font-medium">
                                <li><Link to="/create-trip" className="hover:text-white transition-colors">Trip Planner</Link></li>
                                <li><Link to="/dashboard" className="hover:text-white transition-colors">My Trips</Link></li>
                                <li><Link to="/explore" className="hover:text-white transition-colors">Explore</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Pricing</Link></li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div className="flex flex-col">
                            <h4 className="font-bold text-[13px] uppercase tracking-widest text-white mb-6 sm:mb-8">Company</h4>
                            <ul className="space-y-4 text-[14px] text-gray-400 font-medium">
                                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Resources</Link></li>
                            </ul>
                        </div>

                        {/* Social Column - full width on mobile col 2 or hidden then show below */}
                        <div className="flex flex-col col-span-2 sm:col-span-1 border-t border-white/5 pt-8 sm:pt-0 sm:border-t-0">
                            <h4 className="font-bold text-[13px] uppercase tracking-widest text-white mb-6 sm:mb-8">Connect</h4>
                            <div className="flex sm:flex-col gap-5 sm:gap-4 flex-wrap">
                                <a href="#" title="Instagram" className="flex items-center gap-3 text-gray-400 hover:text-white transition-all group">
                                    < Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="hidden lg:inline text-[14px]">Instagram</span>
                                </a>
                                <a href="#" title="Twitter" className="flex items-center gap-3 text-gray-400 hover:text-white transition-all group">
                                    < Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="hidden lg:inline text-[14px]">Twitter</span>
                                </a>
                                <a href="#" title="LinkedIn" className="flex items-center gap-3 text-gray-400 hover:text-white transition-all group">
                                    < Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="hidden lg:inline text-[14px]">LinkedIn</span>
                                </a>
                                <a href="#" title="YouTube" className="flex items-center gap-3 text-gray-400 hover:text-white transition-all group">
                                    < Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="hidden lg:inline text-[14px]">YouTube</span>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Legal Section */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 opacity-50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-[12px] font-inter text-gray-400 font-bold uppercase tracking-widest">
                            © {new Date().getFullYear()} Travel Around
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                        <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="#" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
