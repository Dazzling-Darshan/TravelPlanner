import { Route, BedSingle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export default function HowItWorks() {
    return (
        <section className="bg-[#050505] py-24 px-6 text-white relative border-t border-white/5 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-gray-500 mb-4 block">Essentials</span>
                    <h2 className="text-[32px] sm:text-[45px] lg:text-[54px] font-urbanist font-black mb-6 tracking-tight leading-[1.1]">
                        How Travel Around <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-gray-500">works for you</span>
                    </h2>
                    <p className="text-lg text-gray-400 font-inter max-w-2xl mx-auto">Three core tools that handle everything from start to finish.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Two smaller cards */}
                    <div className="lg:col-span-4 flex flex-col gap-8">

                        {/* Card 1 */}
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 sm:p-10 flex flex-col justify-between h-full transition-all duration-500 hover:border-white/20 group hover:bg-[#0f0f0f]">
                            <div>
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-500">
                                    <Route className="w-6 h-6 text-white" strokeWidth={2} />
                                </div>
                                <h3 className="text-3xl font-bold font-urbanist leading-tight mb-4 tracking-tight">Itineraries built by AI</h3>
                                <p className="text-gray-400 font-inter text-[15px] leading-relaxed mb-12">Let our cutting-edge algorithm do the thinking and map out your perfect journey.</p>
                            </div>
                            <div className="flex items-center text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white cursor-pointer w-fit group">
                                Discover <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 sm:p-10 flex flex-col justify-between h-full transition-all duration-500 hover:border-white/20 group hover:bg-[#0f0f0f]">
                            <div>
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-500">
                                    <BedSingle className="w-6 h-6 text-white" strokeWidth={2} />
                                </div>
                                <h3 className="text-3xl font-bold font-urbanist leading-tight mb-4 tracking-tight">Hotels appear instantly</h3>
                                <p className="text-gray-400 font-inter text-[15px] leading-relaxed mb-12">See curated prices and seamlessly book your stay without switching between apps.</p>
                            </div>
                            <div className="flex items-center text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white cursor-pointer w-fit group">
                                Explore <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>

                    </div>

                    {/* Right Column - Large Card */}
                    <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 hover:border-white/20 group hover:bg-[#0f0f0f]">
                        <div className="p-8 sm:p-12">
                            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-gray-500 mb-6 block">Command Center</span>
                            <h3 className="text-[32px] sm:text-[45px] lg:text-[54px] font-urbanist font-black leading-[1.1] mb-6 tracking-tight">Change anything<br className="hidden sm:block" /> with a few taps</h3>
                            <p className="text-lg text-gray-400 font-inter mb-10 max-w-xl">Your bespoke trip stays entirely flexible until the exact moment you leave.</p>

                            <div className="flex flex-wrap items-center gap-6">
                                <Link to="/create-trip">
                                    <Button className="rounded-full px-8 h-12 bg-white text-black font-bold font-urbanist hover:bg-gray-200 transition-all">
                                        Customize Now
                                    </Button>
                                </Link>
                                <div className="flex items-center text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white cursor-pointer group px-2">
                                    Learn More <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </div>

                        {/* Image container inside the large card */}
                        <div className="mt-auto px-6 pb-6 pt-2 h-64 sm:h-[400px] w-full">
                            <div className="w-full h-full rounded-[24px] overflow-hidden border border-white/10 relative group-hover:border-white/20 transition-colors">
                                <img
                                    src="/how-it-works-mockup.png"
                                    alt="Travel Dashboard Mockup"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
