import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

export default function TrustedBy() {
    return (
        <section className="bg-[#050505] py-24 px-4 sm:px-8 text-white relative border-t border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="md:w-1/2">
                        <span className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 block">Results</span>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
                            Trusted by travelers<br />everywhere
                        </h2>
                    </div>
                    <div className="md:w-1/2 md:pl-12 lg:pl-24">
                        <p className="text-lg text-gray-300 font-medium leading-relaxed mb-8">
                            Travel Around has helped thousands plan better trips. Our users spend less time planning and more time experiencing the world.
                        </p>
                        <div className="flex flex-wrap items-center gap-6">
                            <Link to="/create-trip">
                                <Button variant="outline" className="rounded-full px-8 h-12 border-white/30 bg-transparent text-white hover:bg-white hover:text-black transition-all">
                                    Start your trip
                                </Button>
                            </Link>
                            <Link to="#features">
                                <div className="flex items-center text-sm font-semibold hover:text-gray-300 cursor-pointer group">
                                    See features <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Dashboard / Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[250px] lg:auto-rows-[300px]">

                    {/* Tall Left Box */}
                    <div className="sm:col-span-2 md:col-span-1 md:row-span-2 bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 lg:p-10 flex flex-col justify-between group hover:border-white/20 transition-all overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
                        <h3 className="text-xl font-bold font-urbanist tracking-tight">Trips planned</h3>
                        <div className="mt-8">
                            <div className="text-6xl lg:text-[80px] font-black font-urbanist mb-4 tracking-tighter text-white">50K+</div>
                            <div className="w-full h-[1px] bg-white/10 mb-6"></div>
                            <p className="text-sm text-gray-400 font-inter">Travelers using Travel Around every month.</p>
                        </div>
                    </div>

                    {/* Image Box 1 (Top Middle) */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden group">
                        <img
                            src="/trusted-image-1.png"
                            alt="Travel aesthetic"
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                        />
                    </div>

                    {/* Top Right Box */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 lg:p-10 flex flex-col justify-between group hover:border-white/20 transition-all">
                        <h3 className="text-xl font-bold font-urbanist tracking-tight">Destinations</h3>
                        <div className="text-right mt-8">
                            <span className="text-5xl lg:text-[70px] font-black font-urbanist tracking-tighter block mb-4">180+</span>
                            <div className="w-full h-[1px] bg-white/10 mb-6"></div>
                            <p className="text-sm text-gray-400 font-inter">Plan anywhere in the world.</p>
                        </div>
                    </div>

                    {/* Bottom Middle Box */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 lg:p-10 flex flex-col justify-between group hover:border-white/20 transition-all">
                        <h3 className="text-xl font-bold font-urbanist tracking-tight">Satisfaction</h3>
                        <div className="text-right mt-8">
                            <span className="text-5xl lg:text-[70px] font-black font-urbanist tracking-tighter block mb-4 text-emerald-500">4.8/5</span>
                            <div className="w-full h-[1px] bg-white/10 mb-6"></div>
                            <p className="text-sm text-gray-400 font-inter text-right">Rated by our community.</p>
                        </div>
                    </div>

                    {/* Image Box 2 (Bottom Right) */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden group">
                        <img
                            src="/trusted-image-2.png"
                            alt="Travel aesthetic"
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
