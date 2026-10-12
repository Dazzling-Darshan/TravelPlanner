import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const faqs = [
    {
        question: "How does the AI work?",
        answer: "Travel Around uses machine learning to understand your travel style, preferences, and budget. The system analyzes millions of destinations, attractions, and experiences to build an itinerary that matches exactly what you're looking for. It learns from your choices and gets smarter with every trip you plan."
    },
    {
        question: "Can I edit my itinerary?",
        answer: "Absolutely. Every suggestion is adjustable. Change times, swap activities, add restaurants, or remove anything that doesn't fit your vision. The AI adapts to your edits and keeps everything organized for you."
    },
    {
        question: "How are hotels integrated?",
        answer: "Hotels appear directly in your itinerary based on your destination and dates. You see real-time availability, prices, and reviews without leaving Travel Around. Book instantly or compare options across properties in your area."
    },
    {
        question: "Is my data private?",
        answer: "Your privacy matters. Travel Around encrypts all personal information and never sells your data. Your travel preferences stay with you, and you control what information you share."
    },
    {
        question: "What destinations does Travel Around cover?",
        answer: "Travel Around works in over 180 destinations worldwide. Whether you're heading to Tokyo, Barcelona, or a small town in Portugal, the AI can build your itinerary. New destinations are added regularly."
    },
    {
        question: "Can I plan trips for groups?",
        answer: "Yes. Create group trips, invite friends, and collaborate on the itinerary together. Everyone can suggest activities and see the full plan in real time."
    }
];

export default function Faq() {
    return (
        <section className="bg-black py-24 px-6 sm:px-10 lg:px-20 text-white flex justify-center border-t border-white/10">
            <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-16">

                {/* Header */}
                <div>
                    <h2 className="text-[40px] sm:text-[48px] lg:text-[56px] font-urbanist font-medium tracking-tight leading-[1] mb-4">
                        Questions
                    </h2>
                    <p className="text-gray-300 font-inter text-[15px] sm:text-[16px]">
                        Everything you need to know about using Travel Around
                    </p>
                </div>

                {/* FAQ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                    {faqs.map((faq, index) => (
                        <div key={index} className="flex flex-col gap-3">
                            <h3 className="text-[18px] sm:text-[20px] font-urbanist font-bold text-white tracking-tight">
                                {faq.question}
                            </h3>
                            <p className="text-gray-300 font-inter text-[14px] leading-relaxed pr-4">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer Contact */}
                <div className="pt-8">
                    <h3 className="text-[28px] sm:text-[32px] font-urbanist font-medium tracking-tight mb-3">
                        Need more help?
                    </h3>
                    <p className="text-gray-300 font-inter text-[15px] mb-8">
                        Reach out to our team anytime
                    </p>
                    <Link to="#contact">
                        <Button
                            variant="outline"
                            className="h-10 px-8 text-white border-white bg-transparent hover:bg-white/10 font-inter font-bold text-[13px] rounded-full transition-all"
                        >
                            Contact
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}
