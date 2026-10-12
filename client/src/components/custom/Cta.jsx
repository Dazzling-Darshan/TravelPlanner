import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export default function Cta() {
    return (
        <section className="bg-black py-20 px-6 sm:px-10 lg:px-20 flex justify-center items-center">
            <div className="relative w-full max-w-[1280px] mx-auto rounded-[40px] overflow-hidden flex flex-col items-center justify-center py-24 px-8 text-center bg-[#111111]">

                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen overflow-hidden group">
                    <img
                        src="/cta-bg.png"
                        alt="Adventure awaits"
                        className="w-full h-full object-cover grayscale-[30%] transition-transform duration-[4000ms] ease-out group-hover:scale-105"
                    />
                </div>

                {/* Dark overlay to ensure text contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10 pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center max-w-2xl mx-auto">

                    <h2 className="text-[48px] sm:text-[60px] lg:text-[72px] font-urbanist font-medium tracking-tight leading-[1.05] text-white mb-6">
                        Start planning your next <br className="hidden sm:block" />
                        adventure
                    </h2>

                    <p className="text-white/80 font-inter text-[15px] sm:text-[17px] leading-relaxed mb-10 max-w-lg">
                        Join thousands of travelers who plan smarter trips every day with Travel Around
                    </p>

                    <div className="flex flex-row items-center gap-4">
                        <Link to="/create-trip">
                            <Button className="h-12 px-8 text-black bg-white hover:bg-gray-200 font-inter font-bold text-[14px] rounded-full transition-all">
                                Begin
                            </Button>
                        </Link>

                        <Link to="#explore">
                            <Button variant="outline" className="h-12 px-8 text-white border-white bg-transparent hover:bg-white/20 font-inter font-bold text-[14px] rounded-full transition-all shadow-none">
                                Explore
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
