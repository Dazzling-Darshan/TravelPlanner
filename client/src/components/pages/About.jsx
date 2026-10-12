import React from 'react';
import { Globe, Compass, Shield, Users, Zap, MapPin, Code, Sparkles, TrendingUp, Award, Cpu } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 flex items-center justify-center overflow-hidden border-b border-white/10 bg-[#050505]">
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 text-center px-6 max-w-[800px] mx-auto">
                    <h1 className="text-white text-[38px] sm:text-[60px] lg:text-[75px] font-urbanist font-bold tracking-tight leading-[1.1] mb-6">
                        About Travel Around
                    </h1>

                    <p className="text-white text-base sm:text-lg font-inter font-medium leading-relaxed">
                        We are revolutionizing the way you explore the world. AI-driven itineraries, seamless group planning, and unforgettable memories tailored specifically to your personality.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-24 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

                    {/* Mission - Large Box */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-2 row-span-2 bg-gradient-to-br from-[#0a0a0a] to-[#121212] p-8 md:p-10 rounded-[24px] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white/10 transition-colors duration-1000"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 mb-8">
                                <Compass className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-[32px] font-urbanist font-bold text-white mb-6 tracking-tight">
                                Our Mission
                            </h2>
                            <p className="text-gray-400 font-inter text-[15px] leading-relaxed mb-4">
                                At Travel Around, we believe that travel should be effortless and personalized. Our mission is to empower travelers with cutting-edge AI technology that crafts the perfect itinerary in seconds, distinctively tailored to your preferences, budget, and companionship.
                            </p>
                            <p className="text-gray-500 font-inter text-[15px] leading-relaxed">
                                Whether you're a solo backpacker, a couple seeking romance, or a family on a holiday, we bring your dream trip to life by eliminating hours of stressful research.
                            </p>
                        </div>
                    </div>

                    {/* Stat Box 1 */}
                    <div className="bg-[#0a0a0a] p-8 rounded-[24px] border border-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center text-center">
                        <TrendingUp className="w-6 h-6 text-gray-500 mb-4" />
                        <h3 className="text-[48px] font-urbanist font-black text-white mb-1 tracking-tight">50k+</h3>
                        <p className="text-[12px] font-inter font-bold uppercase tracking-[0.2em] text-gray-500">Trips Gen.</p>
                    </div>

                    {/* Stat Box 2 */}
                    <div className="bg-[#0a0a0a] p-8 rounded-[24px] border border-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center text-center">
                        <MapPin className="w-6 h-6 text-gray-500 mb-4" />
                        <h3 className="text-[48px] font-urbanist font-black text-white mb-1 tracking-tight">100+</h3>
                        <p className="text-[12px] font-inter font-bold uppercase tracking-[0.2em] text-gray-500">Global Dests.</p>
                    </div>

                    {/* Image Block */}
                    <div className="col-span-1 md:col-span-2 row-span-2 lg:row-span-1 lg:col-span-2 bg-[#0a0a0a] rounded-[24px] border border-white/10 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-colors duration-700 pointer-events-none"></div>
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                            alt="Team at work"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 saturate-0 group-hover:saturate-50"
                        />
                        <div className="absolute bottom-6 left-6 z-20">
                            <p className="text-[10px] font-inter font-bold uppercase tracking-widest text-gray-300 mb-1">Established Team</p>
                            <p className="font-urbanist font-bold text-white text-[24px]">Driven by AI</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FEATURES LIST / WHY CHOOSE US - HORIZONTAL PANELS */}
            <div className="border-t border-white/10 bg-[#0a0a0a] py-24">
                <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-24">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-[40px] font-urbanist font-bold text-white mb-4 tracking-tight">
                                Why Choose Us
                            </h2>
                            <p className="text-gray-400 font-inter text-[16px] leading-relaxed">
                                We combine cutting-edge technology with real human experiences to build the ultimate travel toolkit.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 border border-white/10 bg-white/5 rounded-2xl px-6 py-4 backdrop-blur-md">
                            <Award className="w-10 h-10 text-white" />
                            <div>
                                <p className="font-urbanist font-black text-white text-[20px] leading-tight">4.9/5</p>
                                <p className="text-[10px] font-inter uppercase font-bold tracking-widest text-gray-500">User Rating</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Panel 1 */}
                        <div className="p-8 md:p-10 bg-[#050505] rounded-[24px] border border-white/10 hover:border-white/30 transition-all flex flex-col md:flex-row md:items-center gap-8 group">
                            <div className="w-16 h-16 bg-white/5 rounded-[16px] flex items-center justify-center border border-white/10 shrink-0 group-hover:bg-white text-gray-400 group-hover:text-black transition-colors duration-500">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-urbanist font-bold text-white text-[24px] mb-2 tracking-tight">Verified Community</h3>
                                <p className="text-gray-400 font-inter text-[15px] leading-relaxed">Travel with peace of mind. Every organiser and user in our community is verified for safety, ensuring you can connect with trust anywhere you journey.</p>
                            </div>
                        </div>

                        {/* Panel 2 */}
                        <div className="p-8 md:p-10 bg-[#050505] rounded-[24px] border border-white/10 hover:border-white/30 transition-all flex flex-col md:flex-row md:items-center gap-8 group">
                            <div className="w-16 h-16 bg-white/5 rounded-[16px] flex items-center justify-center border border-white/10 shrink-0 group-hover:bg-white text-gray-400 group-hover:text-black transition-colors duration-500">
                                <Cpu className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-urbanist font-bold text-white text-[24px] mb-2 tracking-tight">Smart Algorithms</h3>
                                <p className="text-gray-400 font-inter text-[15px] leading-relaxed">Our AI considers travel times, budgets, and local hidden gems to build highly efficient routes, learning your personal travel style the more you explore.</p>
                            </div>
                        </div>

                        {/* Panel 3 */}
                        <div className="p-8 md:p-10 bg-[#050505] rounded-[24px] border border-white/10 hover:border-white/30 transition-all flex flex-col md:flex-row md:items-center gap-8 group">
                            <div className="w-16 h-16 bg-white/5 rounded-[16px] flex items-center justify-center border border-white/10 shrink-0 group-hover:bg-white text-gray-400 group-hover:text-black transition-colors duration-500">
                                <Users className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-urbanist font-bold text-white text-[24px] mb-2 tracking-tight">Group Synergy</h3>
                                <p className="text-gray-400 font-inter text-[15px] leading-relaxed">Built from day one to support group planning, voting on destinations, and splitting costs seamlessly among friends or community members.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
