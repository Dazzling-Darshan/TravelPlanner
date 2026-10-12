import React from "react";
import { Compass, Map, Shield, Zap } from "lucide-react";

const features = [
    {
        title: "AI-Powered Planning",
        description: "Our advanced algorithms create optimized itineraries based on your specific interests and travel style.",
        icon: <Zap className="w-6 h-6 text-yellow-500" />,
        bg: "bg-yellow-50"
    },
    {
        title: "Smart Budgeting",
        description: "Get real-time cost estimates and budget-friendly suggestions without compromising on experience.",
        icon: <Shield className="w-6 h-6 text-blue-500" />,
        bg: "bg-blue-50"
    },
    {
        title: "Hidden Gems",
        description: "Discover off-the-beaten-path locations and local favorites that standard guidebooks often miss.",
        icon: <Compass className="w-6 h-6 text-emerald-500" />,
        bg: "bg-emerald-50"
    },
    {
        title: "Interactive Maps",
        description: "Visualise your entire journey with integrated maps and seamless navigation between destinations.",
        icon: <Map className="w-6 h-6 text-purple-500" />,
        bg: "bg-purple-50"
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-gray-500 mb-4 block">Advanced Capabilities</span>
                    <h2 className="text-[32px] sm:text-[45px] lg:text-[54px] font-urbanist font-black text-white mb-6 leading-[1.1] tracking-tight">
                        Everything You Need for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-white/50">Perfect Trip</span>
                    </h2>
                    <p className="text-lg text-gray-400 font-inter leading-relaxed">
                        Stop spending hours on research. Our AI handles the logistics so you can focus on the adventure.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 bg-[#0a0a0a] rounded-[24px] border border-white/10 hover:border-white/20 transition-all duration-300 group relative"
                        >
                            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-[24px]" />
                            <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 font-urbanist">{feature.title}</h3>
                            <p className="text-gray-400 font-inter leading-relaxed text-[15px]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
