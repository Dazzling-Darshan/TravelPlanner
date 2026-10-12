import React from 'react';
import { Star, User } from 'lucide-react';

const reviewsCol1 = [
    {
        rating: 5,
        text: '"I spent hours doing research and found hotels I would have missed completely."',
        name: "Marcus Webb",
        role: "Business consultant, London"
    },
    {
        rating: 5,
        text: '"This is how trip planning should work. Simple, smart, and it actually listens."',
        name: "Elena Rodriguez",
        role: "Photographer, Barcelona"
    },
    {
        rating: 5,
        text: '"I planned a two-week European tour in forty minutes and found boutique hotels I\'d never have discovered alone."',
        name: "James Mitchell",
        role: "Adventure guide, Denver"
    }
];

const reviewsCol2 = [
    {
        rating: 5,
        text: '"My family trip came together in minutes. The kids got activities they actually wanted to do."',
        name: "Lisa Chen",
        role: "Parent, Singapore"
    },
    {
        rating: 5,
        text: '"I changed my mind three times and the itinerary adapted instantly. That\'s the kind of control I needed."',
        name: "Robert Novak",
        role: "Entrepreneur, Toronto"
    },
    {
        rating: 5,
        text: '"The AI suggested off-the-beaten-path trails that made our trip unforgettable."',
        name: "Sarah Jenkins",
        role: "Travel Blogger, Sydney"
    }
];

export default function Reviews() {
    return (
        <section className="bg-black py-20 px-6 sm:px-10 lg:px-20 text-white flex justify-center">
            <div className="w-full max-w-[1280px] mx-auto border border-white/20 rounded-[32px] overflow-hidden flex flex-col lg:flex-row bg-[#080808]">

                {/* Left Column */}
                <div className="w-full lg:w-[45%] flex flex-col justify-center p-12 lg:p-20 z-10 shrink-0">
                    <h2 className="text-[52px] sm:text-[64px] lg:text-[76px] font-urbanist font-medium tracking-tight leading-[1] mb-6">
                        Real<br />travelers
                    </h2>
                    <p className="text-white font-inter text-[16px] mb-12 max-w-[320px]">
                        See what people say about planning with Travel Around
                    </p>

                    <div className="flex items-center gap-6">
                        <button className="px-6 py-2.5 rounded-full border border-white text-white font-inter font-bold text-[13px] hover:bg-white hover:text-black transition-all">
                            Explore
                        </button>
                        <button className="text-white font-inter font-bold text-[13px] flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                            Stories
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>

                {/* Right Column (Masonry Grid Simulation) */}
                <div className="w-full lg:w-[55%] relative flex items-start p-4 sm:p-6 gap-4 sm:gap-6 min-h-[500px] lg:h-[650px] overflow-hidden">

                    {/* Fade overlay for bottom just in case we want a soft ending inside the container */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent z-10 pointer-events-none"></div>

                    {/* Col 1 */}
                    <div className="flex-1 flex flex-col gap-6 lg:-mt-24 pb-12">
                        {reviewsCol1.map((review, i) => (
                            <div key={i} className="border border-white/10 bg-[#000000] rounded-[24px] p-6 sm:p-8 shrink-0 hover:border-white/20 transition-all">
                                <div className="flex gap-1.5 mb-6">
                                    {[...Array(review.rating)].map((_, j) => (
                                        <Star key={j} className="w-3.5 h-3.5 fill-white text-white" />
                                    ))}
                                </div>
                                <p className="text-white font-inter text-[14px] sm:text-[15px] font-medium leading-[1.6] mb-8">
                                    {review.text}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-white">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-inter font-bold text-[13px] leading-tight mb-0.5">{review.name}</span>
                                        <span className="text-gray-500 font-inter text-[11px] leading-tight font-medium tracking-tight uppercase">{review.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Col 2 - hidden on smaller mobile to save space, shown on sm+ */}
                    <div className="hidden sm:flex flex-1 flex flex-col gap-6 lg:pt-16 pb-12">
                        {reviewsCol2.map((review, i) => (
                            <div key={i} className="border border-white/10 bg-[#000000] rounded-[24px] p-6 sm:p-8 shrink-0 hover:border-white/20 transition-all">
                                <div className="flex gap-1.5 mb-6">
                                    {[...Array(review.rating)].map((_, j) => (
                                        <Star key={j} className="w-3.5 h-3.5 fill-white text-white" />
                                    ))}
                                </div>
                                <p className="text-white font-inter text-[14px] sm:text-[15px] font-medium leading-[1.6] mb-8">
                                    {review.text}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-white">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-inter font-bold text-[13px] leading-tight mb-0.5">{review.name}</span>
                                        <span className="text-gray-500 font-inter text-[11px] leading-tight font-medium tracking-tight uppercase">{review.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
