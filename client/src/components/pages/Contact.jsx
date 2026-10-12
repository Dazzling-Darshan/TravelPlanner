import React from 'react';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 pb-24">

            {/* HERO SECTION */}
            <div className="relative pt-32 pb-16 border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.1]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>

                <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-24 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto mt-12">
                        <h1 className="text-white text-[38px] sm:text-[60px] lg:text-[75px] font-urbanist font-bold tracking-tight leading-[1.1] mb-6">
                            Get in Touch
                        </h1>
                        <p className="text-white text-base sm:text-lg font-inter font-medium leading-relaxed max-w-xl mx-auto">
                            Have a question or just want to say hi? We'd love to hear from you. Drop us a message or reach out using the details below.
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-24 pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Side: Contact Info Panels */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Email Panel */}
                        <div className="p-6 sm:p-8 bg-[#0a0a0a] rounded-[24px] border border-white/10 hover:border-white/30 transition-all flex items-start gap-6 group">
                            <div className="w-14 h-14 bg-white/5 rounded-[16px] flex items-center justify-center border border-white/10 shrink-0 group-hover:bg-white text-gray-400 group-hover:text-black transition-colors duration-500">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div className="flex-1 pt-1">
                                <h3 className="font-urbanist font-bold text-white text-[20px] mb-1 tracking-tight">Email Us</h3>
                                <p className="text-gray-400 font-inter text-[14px] leading-relaxed mb-4">Our friendly team is here to help.</p>
                                <a href="mailto:support@travelaround.com" className="text-white font-inter font-bold text-[15px] hover:text-gray-300 transition-colors border-b border-white/20 pb-0.5">
                                    support@travelaround.com
                                </a>
                            </div>
                        </div>

                        {/* Phone Panel */}
                        <div className="p-6 sm:p-8 bg-[#0a0a0a] rounded-[24px] border border-white/10 hover:border-white/30 transition-all flex items-start gap-6 group">
                            <div className="w-14 h-14 bg-white/5 rounded-[16px] flex items-center justify-center border border-white/10 shrink-0 group-hover:bg-white text-gray-400 group-hover:text-black transition-colors duration-500">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div className="flex-1 pt-1">
                                <h3 className="font-urbanist font-bold text-white text-[20px] mb-1 tracking-tight">Call Us</h3>
                                <p className="text-gray-400 font-inter text-[14px] leading-relaxed mb-4">Mon-Fri from 8am to 5pm.</p>
                                <a href="tel:+15550000000" className="text-white font-inter font-bold text-[15px] hover:text-gray-300 transition-colors border-b border-white/20 pb-0.5">
                                    +1 (555) 000-0000
                                </a>
                            </div>
                        </div>

                        {/* Office Panel */}
                        <div className="p-6 sm:p-8 bg-[#0a0a0a] rounded-[24px] border border-white/10 hover:border-white/30 transition-all flex items-start gap-6 group">
                            <div className="w-14 h-14 bg-white/5 rounded-[16px] flex items-center justify-center border border-white/10 shrink-0 group-hover:bg-white text-gray-400 group-hover:text-black transition-colors duration-500">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div className="flex-1 pt-1">
                                <h3 className="font-urbanist font-bold text-white text-[20px] mb-1 tracking-tight">Office HQ</h3>
                                <p className="text-gray-400 font-inter text-[14px] leading-relaxed mb-4">Come say hello at our office HQ.</p>
                                <p className="text-white font-inter font-bold text-[15px] leading-relaxed max-w-[200px]">
                                    123 Travel Lane, Adventure City, AC 90210
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-[#0a0a0a] p-8 sm:p-10 lg:p-12 rounded-[32px] border border-white/10 relative overflow-hidden">
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                            <div className="relative z-10">
                                <h3 className="text-[28px] font-urbanist font-bold text-white mb-2 tracking-tight">Send a Message</h3>
                                <p className="text-gray-500 font-inter text-[14px] mb-10">We'll get back to you as soon as possible.</p>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-[12px] font-inter font-bold uppercase tracking-widest text-gray-500">Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-5 py-4 bg-[#050505] rounded-[16px] border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-hidden transition-all text-white font-inter text-[15px] placeholder-gray-600"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[12px] font-inter font-bold uppercase tracking-widest text-gray-500">Email</label>
                                            <input
                                                type="email"
                                                className="w-full px-5 py-4 bg-[#050505] rounded-[16px] border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-hidden transition-all text-white font-inter text-[15px] placeholder-gray-600"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[12px] font-inter font-bold uppercase tracking-widest text-gray-500">Message</label>
                                        <textarea
                                            rows="5"
                                            className="w-full px-5 py-4 bg-[#050505] rounded-[16px] border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-hidden transition-all text-white font-inter text-[15px] placeholder-gray-600 resize-none custom-scrollbar"
                                            placeholder="How can we help?"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="button"
                                        className="w-full mt-4 h-14 bg-white text-black font-urbanist font-bold text-[18px] rounded-[16px] hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 group"
                                    >
                                        Send Message
                                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
