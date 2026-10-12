import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { MapPin, Star, Clock, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const TripCard = ({ hotel, isHotel = true, tripId, tripHotelName, isSelected = false, onSelect = null, isOrganiser = false }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageArray, setImageArray] = useState([]);
  const navigate = useNavigate();

  // Generate safe image array
  useEffect(() => {
    const generateImages = () => {
      const name = isHotel ? hotel.hotelName : hotel.placeName;
      const images = [];

      // 1. Provided image
      if (hotel.imageUrl && hotel.imageUrl.startsWith('http')) {
        images.push(hotel.imageUrl);
      }

      // 2. Local AI-generated premium assets
      if (isHotel) {
        images.push('/hotels/luxury.png');
        images.push('/hotels/boutique.png');
        images.push('/hotels/resort.png');
        images.push('/hotels/modern.png');
      } else {
        images.push('/attractions/temple.png');
      }

      // 3. Keyword-based placeholders
      if (name) {
        images.push(`https://loremflickr.com/800/600/${encodeURIComponent(name.toLowerCase())},travel`);
      }

      // 4. Generic safe fallbacks
      images.push(`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80`);
      images.push(`https://picsum.photos/800/600?random=${Math.random()}`);

      const uniqueImages = [...new Set(images.filter(url => url))];
      setImageArray(uniqueImages);
    };

    generateImages();
  }, [hotel, isHotel]);

  const handleImageError = (e, index) => {
    e.target.src = isHotel
      ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=80';
  };

  const handleViewDetails = () => {
    navigate("/view-details", {
      state: {
        hotel,
        isHotel,
        tripId,
        tripHotelName: tripHotelName || (isHotel ? hotel.hotelName : null)
      },
    });
  };

  const handleGoogleMapsSearch = () => {
    const query = encodeURIComponent(`${isHotel ? hotel.hotelName : hotel.placeName} ${hotel.address || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className={`bg-[#0a0a0a] rounded-[16px] overflow-hidden border transition-all duration-300 group flex flex-col ${isSelected ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/10 hover:border-white/30'}`}>

      {/* Image Slider */}
      <div className="relative h-48 bg-black/50">
        {imageArray.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
            className="h-full"
          >
            {imageArray.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={`${hotel.hotelName || hotel.placeName || 'Destination'} - Image ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => handleImageError(e, idx)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <span className="text-4xl opacity-50">{isHotel ? '🏨' : '🏛️'}</span>
          </div>
        )}

        {/* Rating Badge */}
        {hotel.rating && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-white/10 z-10">
            <span className="font-urbanist font-bold text-[12px] text-white">{hotel.rating}</span>
          </div>
        )}

        {/* Category Badge & Selection State */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-10 w-full pr-6">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-urbanist font-bold uppercase tracking-widest ${isHotel ? 'bg-white/10 text-white border border-white/20' : 'bg-white/10 text-white border border-white/20'} backdrop-blur-md`}>
            {isHotel ? 'Hotel' : 'Attraction'}
          </span>
          {isSelected && (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-urbanist font-bold uppercase tracking-widest">
              Booked ✅
            </span>
          )}

          {/* Ensure Organiser Select Button is visible and clearly styled */}
          {isOrganiser && isHotel && onSelect && (
            <label className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 cursor-pointer hover:bg-white/10 transition-colors mt-auto self-end right-3 top-3 absolute">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(hotel)}
                className="w-4 h-4 rounded border-gray-400 text-white focus:ring-0 bg-transparent cursor-pointer"
              />
              <span className={`text-[10px] font-urbanist font-bold uppercase tracking-widest ${isSelected ? 'text-emerald-400' : 'text-gray-300'}`}>
                {isSelected ? 'Hotel Selected' : 'Select'}
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Card Content - Compact padding */}
      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-[16px] sm:text-[18px] font-urbanist font-bold text-white leading-tight mb-1 line-clamp-1">
            {isHotel ? hotel.hotelName || 'Hotel Name' : hotel.placeName || 'Attraction Name'}
          </h3>

          {/* Location / Description */}
          {isHotel && hotel.address && (
            <p className="text-[12px] text-gray-400 font-inter line-clamp-1 mb-1">{hotel.address}</p>
          )}
          <p className="text-[12px] text-gray-500 font-inter line-clamp-1">
            {isHotel ? hotel.description || 'Comfortable accommodation' : hotel.details || 'Popular tourist attraction'}
          </p>
        </div>

        {/* Details Mini Grid */}
        <div className="flex items-center justify-between mb-4 border-t border-white/10 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">{isHotel ? 'Price' : 'Ticket'}</span>
            <span className="text-[14px] font-urbanist font-bold text-white">
              {isHotel ? (hotel.price || '₹12000-₹25000 per night') : (hotel.ticketPricing || 'Varies')}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">{isHotel ? 'Rating' : 'Best Time'}</span>
            <span className="text-[14px] font-urbanist font-bold text-white">
              {isHotel ? (hotel.rating || '4.5') : (hotel.bestTimeToVisit || 'Morning')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 h-9 bg-white text-black hover:bg-gray-200 font-inter font-bold text-[12px] rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            {isHotel ? 'Check Details' : 'View'}
          </button>

          <button
            onClick={handleGoogleMapsSearch}
            title="Open in Maps"
            className="w-9 h-9 flex items-center justify-center bg-transparent border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;