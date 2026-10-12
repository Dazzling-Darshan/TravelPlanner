import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Star, Clock, Calendar,
  Shield, CheckCircle, Navigation,
  Hotel, Map, Clock3, DollarSign, Users, MessageSquare, Tag, AlertCircle, Share2, Info, LayoutGrid, List, Zap, Globe, ArrowRight
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNav, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useAuth } from '../context/AuthContext';
import api from '../service/api';
import { useToast } from '../components/ui/toast';
import PaymentModal from '../components/PaymentModal';
import ItinerarySection from '../components/ItinerarySection';
import TravelLoader from '../components/custom/TravelLoader';

const ViewDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, isHotel = true, tripId, tripHotelName } = location.state || {};
  const [loading, setLoading] = useState(!hotel);
  const [activeTab, setActiveTab] = useState('overview');

  const { user } = useAuth();
  const { toast } = useToast();
  const [bookingStatus, setBookingStatus] = useState('none');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [members, setMembers] = useState([]);

  const images = hotel ? (function () {
    const name = isHotel ? hotel.hotelName : hotel.placeName;
    const images = [];
    if (hotel.imageUrl && hotel.imageUrl.startsWith('http')) {
      images.push(hotel.imageUrl);
    }
    if (name) {
      images.push(`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200`);
      images.push(`https://images.unsplash.com/photo-1551882547-ff43c6382636?w=1200`);
      images.push(`https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200`);
    }
    return [...new Set(images.filter(url => url && url.startsWith('http')))].slice(0, 5);
  })() : [];

  const name = isHotel ? hotel?.hotelName || 'Premium Residence' : hotel?.placeName || 'Iconic Landmark';
  const displayTitle = tripHotelName || name;
  const description = isHotel ? hotel?.description || 'A sanctuary of modern luxury and refined comfort.' : hotel?.details || 'A testament to architectural brilliance and cultural significance.';
  const address = hotel?.address || 'Premium Coordinates, Intelligence Sector';
  const price = isHotel ? (hotel.price || '₹12,400') : (hotel.ticketPricing || '₹850');
  const rating = hotel?.rating || '4.9';
  const bestTime = hotel?.bestTimeToVisit || '08:00 - 18:00';

  const destinationName = address || hotel?.placeName || hotel?.hotelName || "Secure Sector";

  useEffect(() => {
    if (!hotel) {
      setTimeout(() => setLoading(false), 800);
    } else {
      if (user) checkBookingStatus();
      if (tripId && typeof tripId === 'string' && tripId.length >= 24) {
        fetchTripAndMembers();
      }
    }
  }, [hotel, user, tripId]);

  const fetchTripAndMembers = async () => {
    try {
      const [tripRes, membersRes] = await Promise.all([
        api.get(`/trips/${tripId}`),
        api.get(`/bookings/trip/${tripId}/members`)
      ]);
      setTripData(tripRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error("Context retrieval failed", err);
    }
  };

  const checkBookingStatus = async () => {
    try {
      const { data } = await api.get(`/bookings/status/${encodeURIComponent(destinationName)}`);
      if (data?.status) setBookingStatus(data.status);
    } catch (error) {
      console.error("Status validation failed", error);
    }
  };

  const handleJoinTrip = () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to join this trip.", variant: "destructive" });
      navigate('/login');
      return;
    }
    setShowPaymentModal(true);
  };

  const processBooking = async () => {
    try {
      await api.post('/bookings/join', {
        destination: destinationName,
        tripId: tripId || hotel?.tripId,
        hotelId: hotel?.id || hotel?.name,
        hotelName: name,
        hotelImage: images[0],
        hotelAddress: address,
        price: price
      });

      setBookingStatus('pending');
      setShowPaymentModal(false);
      toast({ title: "Request Sent!", description: "Awaiting approval from the trip organiser.", type: "success" });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to join trip.";
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link Copied!", description: "Share this trip with your friends." });
  };

  if (loading) {
    return <TravelLoader />;
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8">
          <AlertCircle className="w-16 h-16 text-gray-800 mx-auto" />
          <div>
            <h1 className="text-3xl font-urbanist font-bold text-white mb-2">Trip Not Found</h1>
            <p className="text-gray-500 font-inter">The requested trip details could not be found in our database.</p>
          </div>
          <button onClick={() => navigate(-1)} className="px-8 h-12 bg-white text-black font-urbanist font-bold rounded-sm hover:bg-gray-200 transition-all">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 font-inter">
      {/* Premium Compact Header */}
      <div className="bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 transition-all h-16 flex items-center">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all font-bold uppercase tracking-widest text-[11px]"
            >
              <ArrowLeft className="w-4 h-4 cursor-pointer" />
              <span>Back</span>
            </button>

            <h1 className="hidden md:block text-[14px] font-urbanist font-bold text-white tracking-[0.2em] uppercase truncate max-w-[400px]">
              {displayTitle}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified</span>
              </div>
              <button onClick={handleShare} className="p-2 text-gray-400 hover:text-white transition-all cursor-pointer">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Gallery & Content Area - Ensuring no overflow into sidebar */}
          <div className="lg:col-span-8 space-y-12 min-w-0 relative z-10">

            <header className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-500">
                <div className="w-8 h-[1px] bg-emerald-500/50"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sector Overview</span>
              </div>
              <h2 className="text-[40px] lg:text-[56px] font-urbanist font-bold text-white leading-[1.1] tracking-tight">
                Explore <br />
                <span className="text-gray-500 italic">{displayTitle}</span>
              </h2>
              <p className="text-gray-400 text-[16px] font-medium leading-relaxed max-w-xl">
                {description}
              </p>
            </header>

            {/* Premium Media Gallery */}
            <div className="relative group rounded-sm overflow-hidden border border-white/10 aspect-video bg-[#0a0a0a]">
              <Swiper
                modules={[SwiperNav, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                className="w-full h-full"
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent opacity-60"></div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="absolute top-6 left-6 z-10 flex gap-3">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10">
                  <Star className="w-3.5 h-3.5 text-white fill-white" />
                  <span className="font-urbanist font-bold text-white text-sm">{rating}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10">
                  <Tag className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{isHotel ? 'Luxury Stay' : 'Landmark'}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-10">
              <div className="flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-white/5 pb-1">
                {[
                  { id: 'overview', icon: Info, label: 'Overview' },
                  { id: 'amenities', icon: LayoutGrid, label: 'Features' },
                  { id: 'itinerary', icon: List, label: 'Itinerary' },
                  { id: 'community', icon: Users, label: 'Travelers' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-2 py-4 transition-all relative whitespace-nowrap cursor-pointer ${activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>}
                    <tab.icon className="w-4 h-4" />
                    <span className="text-[12px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="animate-in fade-in duration-500">
                {activeTab === 'overview' && (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
                      <div className="p-10 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-white/20 transition-all">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">Coordinates</h4>
                        <div className="flex gap-4">
                          <MapPin className="w-5 h-5 text-white shrink-0" />
                          <p className="text-[15px] font-bold text-white leading-relaxed">{address}</p>
                        </div>
                      </div>
                      <div className="p-10 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-white/20 transition-all">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">Peak Cycle</h4>
                        <div className="flex gap-4">
                          <Clock className="w-5 h-5 text-white shrink-0" />
                          <p className="text-[15px] font-bold text-white leading-relaxed">{bestTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {(isHotel ? ['Wi-Fi 6E', 'Room Service', 'Luxury Pool', 'Wellness Hub', 'City View', 'Air Cond.'] : ['Expert Guide', 'Photo Ops', 'Priority Entry', 'Lounge Area', 'Café Access', 'Info Desk']).map((item, idx) => (
                      <div key={idx} className="p-8 bg-white/[0.02] border border-white/5 rounded-sm flex flex-col gap-4 group hover:border-white/20 transition-all">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-[13px] font-black text-white uppercase tracking-widest">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-sm mt-4">
                    {tripData?.tripData?.itinerary ? (
                      <ItinerarySection itinerary={tripData.tripData.itinerary} />
                    ) : (
                      <div className="py-24 text-center opacity-30">
                        <List className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-[11px] font-black uppercase tracking-[0.4em]">Chronological data is being retrieved...</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'community' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    {members.length > 0 ? members.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-sm hover:border-white/20 transition-all">
                        <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-xs">{member.userId?.username?.[0] || 'U'}</div>
                        <div>
                          <p className="text-[13px] font-black text-white uppercase tracking-wider">{member.userId?.username || 'Verified Traveler'}</p>
                          <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Active Member</span>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full py-24 text-center opacity-20 border-2 border-dashed border-white/5 rounded-sm">
                        <Users className="w-10 h-10 mx-auto mb-4" />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em]">No active nodes found in this sector</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Summary Sidebar - Fixed Width Logic */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit min-w-0 z-20">
            <div className="bg-[#0a0a0a] border border-white/10 p-8 lg:p-10 rounded-sm space-y-10 shadow-2xl relative overflow-hidden group">

              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000 rotate-12">
                <Globe className="w-48 h-48" />
              </div>

              <div className="space-y-4 relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Estimated Cost</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-urbanist font-black text-white tracking-tighter">
                    {price.includes('-')
                      ? price.split('-').map(p => p.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")).join(' - ')
                      : price.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") || price}
                  </span>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">INR</span>
                </div>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-loose">Price per individual traveler</p>
              </div>

              <div className="space-y-4 relative z-10">
                {bookingStatus === 'none' && (
                  <button
                    onClick={handleJoinTrip}
                    className="w-full h-16 bg-white hover:bg-gray-200 text-black rounded-sm font-urbanist font-black text-[16px] uppercase tracking-widest transition-all flex items-center justify-center gap-4 cursor-pointer active:scale-[0.98]"
                  >
                    Join Trip
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                {bookingStatus === 'pending' && (
                  <div className="w-full h-16 bg-white/5 border border-white/10 rounded-sm text-gray-600 font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3">
                    <Clock className="w-4 h-4" />
                    Pending Auth
                  </div>
                )}

                {bookingStatus === 'approved' && (
                  <button
                    onClick={() => navigate('/chat', { state: { tripId } })}
                    className="w-full h-16 bg-white text-black hover:bg-gray-200 rounded-sm font-urbanist font-black text-[16px] uppercase tracking-widest flex items-center justify-center gap-4 transition-all cursor-pointer shadow-lg"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Open Chat
                  </button>
                )}
              </div>

              <div className="pt-8 border-t border-white/5 space-y-8 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-700">Nodes Participating</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {(members.length > 0 ? members : [1, 2, 3]).slice(0, 3).map((m, i) => (
                          <div key={i} className="w-8 h-8 bg-white border-2 border-black text-black flex items-center justify-center text-[10px] font-black rounded-sm">
                            {typeof m === 'object' ? m.userId?.username?.[0] : '?'}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{members.length || 0} Ready</span>
                    </div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-sm flex items-center gap-3 shrink-0">
                    <Shield className="w-4 h-4 text-white" strokeWidth={3} />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Verified</span>
                  </div>
                </div>

                <p className="text-[9px] font-bold text-gray-700 uppercase leading-relaxed tracking-widest max-w-[280px]">Global sector data validated for absolute accuracy.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={processBooking}
        amount={isHotel ? (price.replace(/[^\d]/g, '') || '10000') : '1500'}
        itemName={name}
      />
    </div>
  );
};

export default ViewDetails;