import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Star, Clock, Calendar, Navigation, Globe, Share2, Users, Shield, CheckCircle, MessageCircle, Zap, Compass, Sparkles, UserX, Trash2 } from "lucide-react";
import TripCard from "../components/ui/TripCard";
import ItinerarySection from '../components/ItinerarySection';
import api from "../service/api";
import { useToast } from '../components/ui/toast';
import { useAuth } from '../context/AuthContext';

export default function ViewTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { user } = useAuth();
  const [bookingStatus, setBookingStatus] = useState('none');
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [userBooking, setUserBooking] = useState(null);
  const [members, setMembers] = useState([]);
  const [tripOwnerId, setTripOwnerId] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      try {
        const { data } = await api.get(`/trips/${id}`);
        if (data) {
          const normalizedItinerary = Array.isArray(data.tripData?.itinerary)
            ? data.tripData.itinerary.map(day => ({
              ...day,
              places: day.places || day.activities || day.plan || []
            }))
            : data.tripData?.itinerary
              ? Object.entries(data.tripData.itinerary)
                .sort((a, b) => parseInt(a[0].replace(/\D/g, '')) - parseInt(b[0].replace(/\D/g, '')))
                .map(([day, details]) => ({
                  day: parseInt(day.replace(/\D/g, '')) || 1,
                  ...details,
                  places: details.places || details.activities || details.plan || []
                }))
              : [];

          setTrip({
            ...data,
            ...(data.tripData || {}),
            itinerary: normalizedItinerary,
            destination: data.destination,
            price: data.price || 0,
            terms: data.terms || "",
            packageNotes: data.packageNotes || ""
          });
          setTripOwnerId(data.userId?._id || data.userId);
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load trip details.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id, toast]);

  const fetchMembers = async () => {
    if (!id) return;
    try {
      const membersRes = await api.get(`/bookings/trip/${id}/members`);
      const tripRes = await api.get(`/trips/${id}`);
      const creator = tripRes.data?.userId;

      if (creator) {
        const ownerRes = await api.get(`/users/${creator}`);
        const owner = {
          userId: ownerRes.data,
          isOwner: true
        };
        const filteredMembers = membersRes.data.filter(m => m.userId?._id !== creator);
        setMembers([owner, ...filteredMembers]);
      } else {
        setMembers(membersRes.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [id]);

  useEffect(() => {
    if (trip && user) {
      checkBookingStatus();
    }
  }, [trip, user]);

  const checkBookingStatus = async () => {
    try {
      const { data } = await api.get(`/bookings/status/id/${id}`);
      if (data) {
        const tripRes = await api.get(`/trips/${id}`);
        if (tripRes.data?.userId === user.id) {
          setBookingStatus('approved');
        } else {
          setBookingStatus(data.status || 'none');
          setUserBooking(data._id ? data : null);
        }
      }
    } catch (error) {
      console.error("Failed to check status", error);
    }
  };

  const handleJoinTrip = async () => {
    try {
      await api.post('/bookings/join', {
        destination: trip.destination,
        tripId: id
      });
      setBookingStatus('pending');
      fetchMembers();
      toast({
        title: "Request Sent",
        description: "Your request has been sent to the Organiser.",
        className: "bg-emerald-600 text-white border-transparent"
      });
    } catch (error) {
      console.error("Join Trip Error FULL:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to join.";
      toast({
        title: "Error Joining",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "You can now share this trip with your friends.",
      className: "bg-[#0a0a0a] border border-white/20 text-white"
    });
  };

  if (loading) return (
    <div className='min-h-screen bg-[#050505] flex items-center justify-center'>
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="text-center max-w-md bg-[#0a0a0a] p-12 rounded-[24px] border border-white/10 flex flex-col items-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
          <Globe className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-[24px] font-urbanist font-bold text-white mb-3 tracking-tight">No Trip Found</h1>
        <p className="text-gray-400 font-inter text-[14px] mb-8 leading-relaxed">Please generate a trip first to view your itinerary.</p>
        <Link
          to="/create-trip"
          className="inline-flex items-center justify-center h-12 px-8 bg-white text-black font-inter font-bold rounded-lg hover:bg-gray-200 transition-colors w-full"
        >
          Create New Trip
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20">

      {/* Premium Dark Header */}
      <div className="relative overflow-hidden bg-[#050505] border-b border-white/10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />

        <div className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 py-20 relative z-10 max-w-[1400px] mx-auto">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[10px] font-urbanist font-bold uppercase tracking-[0.2em] text-gray-300">
                    AI Optimized Intelligence
                  </span>
                </div>

                <h1 className="text-[24px] sm:text-[48px] md:text-[64px] font-urbanist font-bold text-white mb-4 sm:mb-6 tracking-tight leading-[1.2] sm:leading-[1.05]">
                  <span className="truncate block">{trip.destination?.split(',')[0] || trip.destination}</span>
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-400 font-inter text-[14px]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.locationInfo?.displayName || trip.destination}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{trip.duration || '3'} Days Journey</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <button onClick={handleShare} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 h-12 bg-transparent border border-white/20 rounded-lg font-inter font-bold text-white hover:bg-white/5 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 h-12 bg-white text-black rounded-lg font-inter font-bold hover:bg-gray-200 transition-colors">
                  <Navigation className="w-4 h-4" />
                  <span>Interactive Map</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Complexity', value: 'Highly Curated', icon: Compass },
                { label: 'Local Vibe', value: 'Authentic', icon: Globe },
                { label: 'Efficiency', value: '98%', icon: Zap },
                { label: 'Rating', value: '4.9/5', icon: Star }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col p-5 bg-[#0a0a0a] rounded-[16px] border border-white/10 hover:bg-white/[0.03] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/5 mb-4 flex items-center justify-center border border-white/10">
                    <stat.icon className="w-4 h-4 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-inter font-bold uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
                    <p className="font-urbanist font-bold text-[18px] text-white tracking-tight">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="px-4 sm:px-10 md:px-16 lg:px-24 xl:px-32 py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto space-y-10 sm:space-y-16">

          {/* Organiser Management Bar */}
          {user?.id === tripOwnerId && (
            <div className="bg-[#0a0a0a] border border-emerald-500/30 p-6 rounded-[20px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_20px_rgba(16,185,129,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-[18px] sm:text-[20px] font-urbanist font-bold text-white leading-tight mb-1">Host Management</h3>
                  <p className="text-[12px] sm:text-[13px] font-inter text-emerald-400/80">Premium control enabled</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Link to="/organiser" className="w-full sm:w-auto text-center px-6 h-11 flex items-center justify-center bg-transparent hover:bg-white/5 text-white border border-white/20 rounded-lg text-[13px] font-inter font-bold transition-colors">
                  Manager Dashboard
                </Link>
                <button
                  onClick={() => navigate('/organiser')}
                  className="w-full sm:w-auto px-6 h-11 flex items-center justify-center bg-white hover:bg-gray-200 text-black rounded-lg text-[13px] font-inter font-bold transition-colors"
                >
                  Edit Package
                </button>
              </div>
            </div>
          )}

          {/* Premium Adventurer Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Side: Community (8 Columns) */}
            <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/10 rounded-[20px] p-6 sm:p-8 flex flex-col h-full min-h-[400px]">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[20px] sm:text-[24px] font-urbanist font-bold text-white tracking-tight">Traveler Community</h3>
                  </div>
                  <p className="text-[12px] sm:text-[13px] font-inter text-gray-500">Join {members.length} other adventurers</p>
                </div>

                <div className="flex -space-x-3">
                  {members.slice(0, 5).map((member, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-white/10 flex items-center justify-center text-white font-urbanist font-bold text-[14px]">
                      {member.userId?.username?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {members.length > 5 && (
                    <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-black flex items-center justify-center text-gray-400 text-[10px] font-urbanist font-bold">
                      +{members.length - 5}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {members.length > 0 ? (
                  members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 p-4 bg-black/40 rounded-[12px] border border-white/5 hover:bg-white/[0.03] transition-colors group/member">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white font-urbanist font-bold border transition-colors ${member.isOwner ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/10'}`}>
                          {member.userId?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[14px] font-urbanist font-bold text-white truncate max-w-[120px]">{member.userId?.username}</p>
                          <p className="text-[10px] font-inter font-bold uppercase tracking-widest text-gray-500 mt-0.5">
                            {member.isOwner ? 'Organiser' : 'Verified'}
                          </p>
                        </div>
                      </div>

                      {user?.id === tripOwnerId && !member.isOwner && (
                        <button
                          onClick={async () => {
                            if (window.confirm(`Kick ${member.userId?.username}?`)) {
                              await api.put(`/organiser/requests/${member._id}/validate`, { status: 'revoked' });
                              setMembers(prev => prev.filter(m => m._id !== member._id));
                              toast({ title: "Member Removed" });
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                    <Sparkles className="w-8 h-8 text-white/20 mb-4" />
                    <h4 className="font-urbanist font-bold text-[18px] text-white mb-2">Be the First Adventurer</h4>
                    <p className="text-gray-500 font-inter text-[13px] max-w-[240px]">This trip is fresh out of the AI engine. Claim your spot now!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Status/Action (4 Columns) */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              {/* Trip Summary Card */}
              <div className="bg-[#0a0a0a] rounded-[20px] border border-white/10 p-6 sm:p-8">
                <p className="text-[10px] font-inter font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Trip Summary</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-[40px] font-urbanist font-bold text-white tracking-tight">₹{trip?.price || '15000'}</span>
                  <span className="text-gray-500 font-inter text-[12px]">{trip?.budget || 'Moderate'} Cost</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-[12px] border border-white/5">
                    <Users className="w-4 h-4 text-gray-300 mt-1 shrink-0" />
                    <div>
                      <p className="text-[13px] font-urbanist font-bold text-white mb-1">Community Choice</p>
                      <p className="text-[12px] font-inter text-gray-500 leading-relaxed">Join this trip to connect with other {trip?.destination} travelers.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-[12px] border border-white/5">
                    <Shield className="w-4 h-4 text-gray-300 mt-1 shrink-0" />
                    <div>
                      <p className="text-[13px] font-urbanist font-bold text-white mb-1">Verified Access Only</p>
                      <p className="text-[12px] font-inter text-gray-500 leading-relaxed">Organisers validate all members before they can join the crew.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Status Card */}
              <div className={`rounded-[20px] border p-6 sm:p-8 transition-colors ${bookingStatus === 'approved' ? 'bg-emerald-500/5 border-emerald-500/20' :
                bookingStatus === 'pending' ? 'bg-amber-500/5 border-amber-500/20' :
                  'bg-[#0a0a0a] border-white/10'}`}>

                <p className="text-[10px] font-inter font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Your Status</p>

                {bookingStatus === 'approved' ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[18px] font-urbanist font-bold text-white">Access Granted</p>
                        <p className="text-[12px] font-inter text-gray-400">Explore the full itinerary and chat.</p>
                      </div>
                    </div>
                    <Link
                      to={`/chat?tripId=${id}`}
                      className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg font-inter font-bold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Crew Chat Room
                    </Link>
                  </div>
                ) : bookingStatus === 'pending' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-[18px] font-urbanist font-bold text-white">Pending Review</p>
                        <p className="text-[12px] font-inter text-gray-400">Organiser is verifying your profile</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-[18px] font-urbanist font-bold text-white">Join Adventure</p>
                        <p className="text-[12px] font-inter text-gray-400">Express interest and join the crew!</p>
                      </div>
                    </div>
                    <button
                      onClick={handleJoinTrip}
                      className="w-full h-12 bg-white hover:bg-gray-200 text-black flex items-center justify-center rounded-lg font-inter font-bold transition-colors"
                    >
                      Join Trip
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Hotels Section */}
          <section className="pt-8">
            <div className="flex items-center gap-4 mb-6 sm:mb-10">
              <h2 className="font-urbanist font-bold text-[28px] sm:text-[36px] tracking-tight text-white">
                🏨 {user?.id === tripOwnerId ? "Select Booked Hotel" : "Accommodations"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(user?.id === tripOwnerId ? trip?.hotels : (trip?.selectedHotel ? [trip.selectedHotel] : trip?.hotels))?.map((hotel, index) => (
                <TripCard
                  key={index}
                  hotel={hotel}
                  isHotel={true}
                  tripId={id}
                  tripHotelName={trip.hotels?.[0]?.hotelName}
                  isSelected={trip?.selectedHotel?.hotelName === hotel.hotelName}
                  isOrganiser={user?.id === tripOwnerId}
                  onSelect={async (h) => {
                    try {
                      const isDeselect = trip?.selectedHotel?.hotelName === h.hotelName;
                      const response = await api.put(`/trips/${id}`, {
                        selectedHotel: isDeselect ? null : h
                      });
                      setTrip(prev => ({ ...prev, selectedHotel: response.data.selectedHotel }));
                      toast({
                        title: isDeselect ? "Hotel Removed" : "Hotel Booked",
                        description: isDeselect ? "Removed from itinerary highlight." : "This hotel is now marked as booked for all users.",
                        className: "bg-[#0a0a0a] text-white border-white/20"
                      });
                    } catch (err) {
                      toast({ title: "Error", description: "Failed to update hotel selection.", variant: "destructive" });
                    }
                  }}
                />
              ))}
            </div>
          </section>

          {/* Itinerary Section */}
          <section className="pt-8">
            <div className="mb-8 sm:mb-10">
              <h2 className="font-urbanist font-bold text-[28px] sm:text-[36px] tracking-tight text-white mb-2">
                🗓 Daily Itinerary Plan
              </h2>
              <p className="text-gray-400 font-inter text-[13px] sm:text-[15px]">
                Your personalized day-by-day adventure schedule
              </p>
            </div>

            <ItinerarySection itinerary={trip.itinerary} tripHotelName={trip.hotels?.[0]?.hotelName} />
          </section>

          {/* Summary & Final Actions */}
          <section className="bg-[#050505] border border-white/10 rounded-[24px] p-10 md:p-16 relative overflow-hidden text-center mt-12 bg-white/[0.01]">
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <Sparkles className="w-8 h-8 text-white/20 mb-6" />
              <h3 className="text-[32px] font-urbanist font-bold text-white tracking-tight mb-4">
                Ready to Join This Adventure?
              </h3>
              <p className="text-[15px] font-inter text-gray-400 mb-10 leading-relaxed max-w-lg">
                Connect with the group, discuss plans, and get ready for your upcoming trip to {trip.destination}.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full">

                {bookingStatus === 'approved' && (
                  <Link
                    to={`/chat?tripId=${id}`}
                    className="h-12 px-8 bg-white hover:bg-gray-200 text-black font-inter font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat with Approved Members
                  </Link>
                )}

                <button
                  onClick={() => setShowTripDetails(true)}
                  className="h-12 px-8 bg-transparent hover:bg-white/5 border border-white/20 text-white font-inter font-bold rounded-lg transition-colors flex items-center justify-center w-full sm:w-auto"
                >
                  Trip Details Overview
                </button>
              </div>
            </div>
          </section>

          {/* Custom Trip Details Modal */}
          {showTripDetails && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm transition-all duration-300">
              <div
                className="bg-[#0a0a0a] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-[24px] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
                role="dialog"
                aria-modal="true"
              >
                {/* Modal Header */}
                <div className="relative px-8 py-6 border-b border-white/10 shrink-0 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-[24px] font-urbanist font-bold text-white mb-2">Trip Overview</h2>
                      <div className="flex items-center gap-3 text-gray-400 font-inter text-[13px]">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                          <MapPin className="w-3.5 h-3.5" /> {trip.destination}
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                          <Clock className="w-3.5 h-3.5" /> {trip.duration} Days
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowTripDetails(false)}
                      className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                  <div className="space-y-12">

                    {/* Accommodation Quick Look */}
                    <div>
                      <h3 className="flex items-center gap-3 text-[18px] font-urbanist font-bold text-white mb-6">
                        <MapPin className="w-5 h-5 text-gray-400" /> Accommodation Highlights
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(user?.id === tripOwnerId ? trip.hotels : (trip.selectedHotel ? [trip.selectedHotel] : trip.hotels))?.map((hotel, idx) => (
                          <div key={idx} className={`bg-black/50 rounded-[16px] p-3 border transition-all flex gap-4 ${trip?.selectedHotel?.hotelName === hotel.hotelName ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10'}`}>
                            <div className="w-20 h-20 shrink-0 rounded-[10px] overflow-hidden bg-white/5">
                              <img
                                src={hotel?.imageUrl || '/placeholder.jpg'}
                                alt={hotel?.hotelName}
                                className="w-full h-full object-cover opacity-80"
                                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                              />
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                              <h4 className="font-urbanist font-bold text-white text-[15px] truncate mb-1">{hotel?.hotelName}</h4>
                              <p className="text-[11px] font-inter text-gray-500 mb-2 truncate">{hotel?.address}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-[12px] font-inter font-bold text-emerald-400">
                                  {hotel?.price}
                                </span>
                                <div className="flex items-center gap-1 text-[12px] font-inter font-bold text-amber-500">
                                  <Star className="w-3 h-3 fill-current" /> {hotel?.rating}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-full h-px bg-white/10"></div>

                    {/* Itinerary Matrix */}
                    <div>
                      <h3 className="flex items-center gap-3 text-[18px] font-urbanist font-bold text-white mb-6">
                        <Calendar className="w-5 h-5 text-gray-400" /> Itinerary Roadmap
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {(Array.isArray(trip.itinerary) ? trip.itinerary : []).map((details, idx) => (
                          <div key={idx} className="bg-black/50 p-5 rounded-[16px] border border-white/10 flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-urbanist font-bold text-white text-[14px] uppercase tracking-wider">Day {details.day || idx + 1}</span>
                              <span className="text-[10px] font-inter font-bold text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">{details?.time || details?.totalTime || 'All Day'}</span>
                            </div>
                            <h4 className="font-urbanist font-bold text-white text-[16px] mb-2 line-clamp-1">{details?.theme || details?.area || 'Exploration Day'}</h4>
                            <p className="text-gray-500 text-[12px] font-inter leading-relaxed line-clamp-3 mt-auto">
                              {details?.details || details?.description || `Explore the best of ${trip.destination?.split(',')[0]}.`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Modal */}
                <div className="p-6 border-t border-white/10 shrink-0 flex items-center justify-end gap-3 bg-white/[0.02]">
                  <button
                    onClick={() => setShowTripDetails(false)}
                    className="h-10 px-6 bg-transparent hover:bg-white/5 text-white border border-white/20 rounded-lg text-[13px] font-inter font-bold transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => { setShowTripDetails(false); window.print(); }}
                    className="h-10 px-6 bg-white hover:bg-gray-200 text-black rounded-lg text-[13px] font-inter font-bold transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
