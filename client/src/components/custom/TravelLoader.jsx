import React, { useState, useEffect } from 'react';
import { Sparkles, Globe } from 'lucide-react';

const TravelLoader = () => {
    const [statusIndex, setStatusIndex] = useState(0);
    const statuses = [
        "Analyzing preferences",
        "Curating adventure",
        "Syncing itineraries",
        "Finalizing plan"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % statuses.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] font-inter">
            <div className="relative flex flex-col items-center gap-12">

                {/* Minimalist Logo Animation */}
                <div className="relative flex flex-col items-center select-none">
                    <div className="flex items-end font-sans font-black tracking-[0.1em] text-white text-[32px] leading-[0.8] animate-pulse duration-[2000ms]">
                        <span>TRAVE</span>
                        <div className="relative flex flex-col items-center justify-end w-[22px] h-[34px] ml-1">
                            {/* Handle */}
                            <div className="absolute top-0 w-[12px] h-[6px] border-[2px] border-white border-b-0 rounded-t-[3px]"></div>

                            {/* Main Box */}
                            <div className="w-full h-[22px] border-l-[4px] border-b-[4px] border-t-[1.5px] border-r-[1.5px] border-white rounded-[3px] mt-1 relative flex justify-center overflow-hidden bg-[#050505]">
                                <div className="w-[1.5px] h-full bg-white opacity-40 translate-x-[1px]"></div>
                            </div>

                            {/* Wheels */}
                            <div className="flex justify-between w-[16px] mt-[1.5px]">
                                <div className="w-[5px] h-[5px] bg-white rounded-full"></div>
                                <div className="w-[5px] h-[5px] bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status & Subtext */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="h-6 flex items-center justify-center">
                        <p className="text-[12px] font-black uppercase tracking-[0.5em] text-white/90 animate-fade-in-out">
                            {statuses[statusIndex]}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">AI Processing</span>
                    </div>
                </div>

                {/* Ultra Thin Progress Line */}
                <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/40 w-1/3 animate-loading-slide"></div>
                </div>
            </div>

            <style>{`
                @keyframes loading-slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
                .animate-loading-slide {
                    animation: loading-slide 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                @keyframes fade-in-out {
                    0%, 100% { opacity: 0; transform: translateY(4px); }
                    10%, 90% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-out {
                    animation: fade-in-out 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default TravelLoader;
