import React, { useState } from 'react';
import { Clock, ChevronRight, ChevronDown, DollarSign, Compass, Navigation } from 'lucide-react';

const ItinerarySection = ({ itinerary, tripHotelName }) => {
  const [expandedDays, setExpandedDays] = useState({ 0: true }); // Expand first day by default
  const [likedPlaces, setLikedPlaces] = useState({});

  const PlaceCard = ({ place, placeIndex, isLast, dayIndex }) => {
    return (
      <div className="relative pl-6 md:pl-8 pb-4 group/place">
        {/* Very Simple Timeline */}
        {!isLast && (
          <div className="absolute left-[9px] md:left-[9px] top-6 bottom-0 w-[1px] bg-white/5" />
        )}

        {/* Minimal Dot */}
        <div className="absolute left-0 top-1.5 flex flex-col items-center">
          <div className="w-5 h-5 rounded-sm border border-white/10 bg-black flex items-center justify-center z-10">
            <div className="w-1.5 h-1.5 rounded-none bg-gray-600 group-hover/place:bg-white transition-colors" />
          </div>
        </div>

        {/* Ultra-Clean Single Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-1 px-2 transition-all">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1 min-w-0">
            <span className="text-[10px] font-inter font-black text-gray-700 uppercase tracking-widest shrink-0">
              {place.visitTime || `${9 + placeIndex}:00`}
            </span>
            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 flex-1 min-w-0">
              <h3 className="font-urbanist font-bold text-[15px] text-gray-200 tracking-tight group-hover/place:text-white transition-colors truncate">
                {place.placeName}
              </h3>
              <span className="hidden md:inline text-gray-700 text-xs">•</span>
              <p className="text-gray-600 font-inter text-[11px] truncate flex-1 font-medium">
                {place.details || 'Explore this location.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-[9px] font-inter font-bold text-gray-700 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
              {place.duration || '2h'}
            </span>
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`, '_blank')}
              className="group/map flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all duration-300 active:scale-95"
            >
              <Navigation className="w-3 h-3 text-white group-hover/map:translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-inter font-black uppercase tracking-[0.2em] text-gray-400 group-hover/map:text-white">
                Map
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {itinerary?.map((dayPlan, dayIndex) => {
        const isExpanded = expandedDays[dayIndex];

        return (
          <div key={dayIndex} className="animate-fade-in relative z-10">
            {/* Premium Day Header */}
            <div
              onClick={() => setExpandedDays(prev => ({ ...prev, [dayIndex]: !isExpanded }))}
              className="group cursor-pointer mb-6"
            >
              <div className={`flex flex-col lg:flex-row lg:items-center gap-4 bg-[#0a0a0a] p-5 md:p-6 rounded-[20px] border transition-all duration-300 ${isExpanded ? 'border-white/30 bg-white/[0.03]' : 'border-white/10 hover:border-white/20'}`}>

                <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0">
                  <div className={`w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-[14px] flex items-center justify-center shrink-0 border transition-colors ${isExpanded ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10 group-hover:bg-white/10'}`}>
                    <span className="font-urbanist font-bold text-[14px] sm:text-[20px] tracking-tight">D{dayPlan.day}</span>
                  </div>
                  <div className="flex flex-col overflow-hidden pr-2 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                      <span className="text-[7px] sm:text-[10px] font-inter font-black sm:font-bold uppercase tracking-[0.2em] sm:tracking-widest text-gray-500 sm:text-gray-400 shrink-0">Day {dayPlan.day} Plan</span>
                      <span className="text-[7px] sm:text-[10px] font-inter font-bold uppercase tracking-widest text-gray-600 sm:text-gray-400 flex items-center gap-1 before:content-['•'] before:mr-0.5 sm:before:mr-1">
                        <Compass className="w-2 sm:w-3 h-2 sm:h-3" />
                        <span className="sm:hidden">{dayPlan.area?.split(',')[0] || 'City Center'}</span>
                        <span className="hidden sm:inline">{dayPlan.area || 'City Center'}</span>
                      </span>
                    </div>
                    <h2 className={`font-urbanist font-bold text-[15px] sm:text-[22px] tracking-tight truncate transition-colors ${isExpanded ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      <span className="sm:hidden">{dayPlan.theme?.split(',')[0] || `Exploring ${itinerary[0]?.area?.split(',')[0] || 'the city'}`}</span>
                      <span className="hidden sm:block">{dayPlan.theme || `Exploring ${itinerary[0]?.area || 'the city'}`}</span>
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-start gap-4 lg:gap-6 lg:border-l border-white/10 lg:pl-6 pt-2.5 lg:pt-0 border-t lg:border-t-0 mt-2.5 lg:mt-0 shrink-0">
                  <div className="flex items-center gap-5 sm:gap-6">
                    <div className="flex flex-col">
                      <span className="text-[7px] font-inter font-black sm:font-bold text-gray-600 sm:text-gray-500 uppercase tracking-widest mb-0.5">Stops</span>
                      <span className="text-[12px] sm:text-[16px] font-urbanist font-bold text-white">{dayPlan.places?.length || 0}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[7px] font-inter font-black sm:font-bold text-gray-600 sm:text-gray-500 uppercase tracking-widest mb-0.5">Time</span>
                      <span className="text-[12px] sm:text-[16px] font-urbanist font-bold text-white">{dayPlan.totalTime || '8h'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[7px] font-inter font-black sm:font-bold text-gray-600 sm:text-gray-500 uppercase tracking-widest mb-0.5">Budget</span>
                      <span className="text-[12px] sm:text-[16px] font-urbanist font-bold text-white">~₹{dayPlan.totalExpense || '5k'}</span>
                    </div>
                  </div>

                  <div className="lg:ml-2">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors border ${isExpanded ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/20 group-hover:text-white group-hover:border-white/40'}`}>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Places Timeline */}
            {isExpanded && (
              <div className="pl-2 md:pl-6 space-y-2 mt-4 relative z-0">
                {dayPlan.places?.map((place, placeIndex) => (
                  <PlaceCard
                    key={placeIndex}
                    place={place}
                    placeIndex={placeIndex}
                    isLast={placeIndex === dayPlan.places.length - 1}
                    dayIndex={dayIndex}
                  />
                ))}

                {/* Day Footer / Transition */}
                <div className="pl-6 md:pl-10 mt-2 mb-8">
                  <div className="p-3.5 md:p-5 bg-white/5 border border-white/10 rounded-[16px] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg">
                        <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-gray-300" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[7px] sm:text-[10px] font-inter font-black sm:font-bold text-gray-600 sm:text-gray-500 uppercase tracking-widest mb-0.5">End of Day {dayPlan.day}</span>
                        <span className="text-[12px] sm:text-[14px] font-urbanist font-bold text-white truncate">
                          <span className="sm:hidden">Home Base Sync</span>
                          <span className="hidden sm:inline">Heading back to Accommodation</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/50 rounded-lg border border-white/10 w-full sm:w-auto">
                      <span className="text-[10px] sm:text-[11px] font-inter text-gray-500 sm:text-gray-400">Hotel:</span>
                      <span className="text-[11px] sm:text-[12px] font-urbanist font-bold text-white truncate max-w-[150px] sm:max-w-[200px]">
                        <span className="sm:hidden">{dayPlan.suggestedHotel?.split(',')[0] || tripHotelName?.split(',')[0] || 'Confirmed'}</span>
                        <span className="hidden sm:block">{dayPlan.suggestedHotel || tripHotelName || 'Confirmed Stay'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ItinerarySection;