import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Hero() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        "/hero-slider-1.png",
        "/hero-nature.png",
        "/hero-landscape.png",
        "/cta-bg.png"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full h-[100vh] min-h-[600px] flex flex-col p-8 md:p-16 lg:p-24 overflow-hidden bg-black">

            {/* Auto-sliding Background */}
            <div className="absolute inset-0 z-0">
                {/* Overlay for consistency and tone */}
                <div className="absolute inset-0 bg-black/40 z-10"></div>

                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <img
                            src={slide}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover scale-105"
                        />
                    </div>
                ))}
            </div>

            {/* Main Content Container */}
            <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col justify-between z-20">

                {/* Top Left: Headlines */}
                <div className="w-full max-w-5xl mt-8 sm:mt-24">
                    <h1 className="text-white text-[42px] xs:text-[50px] sm:text-[80px] md:text-[100px] lg:text-[130px] font-urbanist font-black tracking-tighter leading-[0.9] sm:leading-[0.85] drop-shadow-2xl uppercase">
                        <span className="block animate-reveal opacity-0 [animation-delay:200ms] mb-1 sm:mb-2">Plan your</span>
                        <span className="block animate-reveal opacity-0 [animation-delay:400ms] text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40 mb-1 sm:mb-2 text-glow">next trip</span>
                        <span className="block animate-reveal opacity-0 [animation-delay:600ms]">
                            with <span className="relative inline-block lg:inline">
                                <span className="relative z-10 text-white animate-glow italic">AI</span>
                                <span className="absolute -inset-2 bg-white/10 blur-xl rounded-full animate-pulse z-0"></span>
                            </span>
                        </span>
                    </h1>
                </div>

                {/* Bottom Right: Subtext & Buttons */}
                <div className="w-full max-w-xl self-end mb-8 sm:mb-12 bg-black/20 p-6 sm:p-8 rounded-lg backdrop-blur-md border border-white/10">
                    <p className="text-white text-base sm:text-lg font-inter font-medium mb-6 leading-relaxed">
                        Travel Around builds your itinerary in minutes. Find hotels where you're going. Travel smarter, not harder.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <Button
                            onClick={() => navigate(user ? "/create-trip" : "/login")}
                            className="h-14 sm:h-12 w-full sm:w-auto flex items-center justify-center px-8 text-black bg-white hover:bg-gray-200 font-inter font-bold text-[14px] transition-all rounded-sm active:scale-95 shadow-xl shadow-white/5"
                        >
                            Start planning
                        </Button>

                        <Link to="#learn-more" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="h-14 sm:h-12 w-full px-8 text-white border border-white/30 bg-white/5 backdrop-blur-sm hover:border-white hover:bg-white/10 font-inter font-bold text-[14px] transition-all rounded-sm shadow-none active:scale-95"
                            >
                                Learn more
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 transition-all duration-300 ${index === currentSlide ? "w-8 bg-white" : "w-4 bg-white/30"
                                }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
