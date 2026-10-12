import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/toast';
import api from '../../service/api';

const UserTripCard = ({ trip, isJoined, bookingStatus }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const [joining, setJoining] = React.useState(false);

    // Explicit Ownership Check
    const isOwner = React.useMemo(() => {
        if (!user || !trip.userId) return false;
        const tripUid = typeof trip.userId === 'object' ? trip.userId._id : trip.userId;
        return tripUid === user.id;
    }, [user, trip.userId]);

    const [imgSrc, setImgSrc] = React.useState(
        trip.tripData?.locationInfo?.photoUrl ||
        trip.tripData?.hotels?.[0]?.imageUrl ||
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
    );

    const handleImageError = () => {
        setImgSrc('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800');
    };

    const handleJoinClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to join trips");
            navigate('/login');
            return;
        }

        setJoining(true);
        try {
            await api.post('/bookings/join', {
                destination: trip.destination,
                tripId: trip._id,
                hotelName: trip.tripData?.hotels?.[0]?.hotelName || "Main Accommodation",
                hotelImage: imgSrc,
                price: trip.budget || "Varies"
            });
            toast.success("Join request sent to organiser!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to join trip");
        } finally {
            setJoining(false);
        }
    };

    return (
        <div
            onClick={() => navigate(`/view-trip/${trip._id}`)}
            className='border border-white/10 rounded-[20px] p-4 sm:p-5 hover:bg-white/[0.03] transition-colors cursor-pointer h-full flex flex-col bg-[#0a0a0a] group relative overflow-hidden'
        >
            <div className="relative h-[180px] sm:h-[220px] w-full mb-4 sm:mb-6 overflow-hidden rounded-[14px]">
                <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                <img
                    src={imgSrc}
                    alt={trip.destination}
                    className='h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105'
                    onError={handleImageError}
                />

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-[10px] sm:text-[11px] font-urbanist font-bold shadow-sm tracking-wide text-white z-20">
                    {trip.duration || trip.tripData?.duration || 3} Days
                </div>

                {/* Status Badge */}
                {trip.status === 'approved' && (
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-[9px] sm:text-[10px] font-urbanist font-bold text-white uppercase tracking-widest z-20">
                        Verified
                    </div>
                )}
            </div>

            <div className='flex justify-between items-start mb-2'>
                <h2 className='font-urbanist font-bold text-[18px] sm:text-[22px] tracking-tight leading-tight truncate flex-1 text-white pr-2'>
                    {trip.destination || 'Unnamed Adventure'}
                </h2>
            </div>

            <div className='flex flex-col gap-1.5 sm:gap-2 mb-4 sm:mb-6'>
                <p className='text-[12px] sm:text-[13px] text-gray-400 font-inter flex items-center gap-1.5'>
                    <Calendar className='w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70' />
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Flexible'}
                    {trip.endDate ? ` - ${new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                </p>
                <p className='text-[13px] sm:text-[14px] text-gray-400 font-inter leading-relaxed line-clamp-2'>
                    {trip.tripData?.itinerary?.[0]?.theme || `Exploring the wonders of ${trip.destination}`}
                </p>
            </div>

            {/* Bottom Section */}
            <div className="flex items-end justify-between mt-auto pt-4 sm:pt-6 border-t border-white/10 gap-2">

                {/* Budget */}
                <div className='flex flex-col'>
                    <span className='text-[10px] sm:text-[11px] font-inter text-gray-500 font-medium tracking-wider mb-0.5'>Est. Budget</span>
                    <span className='font-urbanist font-bold text-[16px] sm:text-[18px] text-white'>
                        {trip.price > 0 ? `₹${trip.price}` : `₹${trip.budget === 'Luxury' ? '50,000+' : trip.budget === 'Standard' ? '20,000+' : '10,000+'}`}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {isOwner ? (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate('/organiser');
                            }}
                            className="px-4 sm:px-6 h-9 sm:h-10 bg-white text-black hover:bg-gray-200 rounded-lg text-[12px] sm:text-[13px] font-inter font-bold transition-all shadow-lg active:scale-95"
                        >
                            Manage
                        </button>
                    ) : (
                        <>
                            {!isJoined && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        navigate(`/view-trip/${trip._id}`);
                                    }}
                                    className="w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                                    title="View Details"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            )}

                            <button
                                onClick={!isJoined ? handleJoinClick : undefined}
                                disabled={joining}
                                className={`px-4 sm:px-5 h-9 sm:h-10 rounded-lg text-[12px] sm:text-[13px] font-inter font-bold transition-all flex items-center justify-center gap-1.5 min-w-[80px] sm:min-w-[100px]
                                        ${isJoined
                                        ? 'bg-transparent border border-white/20 text-white cursor-default'
                                        : 'bg-white text-black hover:bg-gray-200 shadow-lg active:scale-95'}`}
                            >
                                {joining ? (
                                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                ) : isJoined ? (
                                    <div className='flex items-center gap-1.5'>
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        {bookingStatus === 'approved' ? 'Joined' : 'Requested'}
                                    </div>
                                ) : (
                                    'Join'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserTripCard;
