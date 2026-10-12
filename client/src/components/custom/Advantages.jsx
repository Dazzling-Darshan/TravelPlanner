import React from 'react';
import { Flag, Briefcase, LayoutGrid, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export default function Advantages() {
    return (
        <section className="bg-[#0b1410] py-24 px-6 text-white relative border-t border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-20 md:w-2/3 lg:w-[60%]">
                    <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-emerald-500 mb-6 block">The Edge</span>
                    <h2 className="text-[32px] sm:text-[45px] lg:text-[60px] font-urbanist font-black mb-8 leading-[1] tracking-tighter">
                        What makes Travel<br className="hidden sm:block" />Around <span className="text-emerald-500">different</span>
                    </h2>
                    <p className="text-lg text-gray-400 font-inter leading-relaxed max-w-2xl">
                        Travel planning used to demand patience and compromise. Travel Around removes both. The AI handles the heavy lifting while you stay in control.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-16">
                    <div className="group">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500">
                            <Flag className="w-6 h-6 text-emerald-500" strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-bold font-urbanist leading-tight mb-4 tracking-tight">Hours become<br className="hidden lg:block" /> minutes</h3>
                        <p className="text-gray-400 font-inter text-[15px] leading-relaxed">
                            Stop spending days researching. Get a complete, highly-tailored itinerary instantly.
                        </p>
                    </div>

                    <div className="group">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500">
                            <Briefcase className="w-6 h-6 text-emerald-500" strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-bold font-urbanist leading-tight mb-4 tracking-tight">Trips made<br className="hidden lg:block" /> personal</h3>
                        <p className="text-gray-400 font-inter text-[15px] leading-relaxed">
                            The AI learns what matters to you and builds everything accordingly.
                        </p>
                    </div>

                    <div className="group">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500">
                            <LayoutGrid className="w-6 h-6 text-emerald-500" strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-bold font-urbanist leading-tight mb-4 tracking-tight">Everything in<br className="hidden lg:block" /> one place</h3>
                        <p className="text-gray-400 font-inter text-[15px] leading-relaxed">
                            Plan activities, discover new hotels, and manage your entire trip without switching apps.
                        </p>
                    </div>
                </div>

                <div className="mt-20 flex flex-wrap items-center gap-6">
                    <Link to="/create-trip">
                        <Button className="rounded-full px-10 h-14 bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-urbanist text-lg transition-all shadow-xl shadow-emerald-500/20">
                            Start Your Plan
                        </Button>
                    </Link>
                    <Link to="/explore">
                        <div className="flex items-center text-sm font-bold uppercase tracking-widest text-emerald-500 hover:text-white cursor-pointer group transition-colors px-2">
                            Explore <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
