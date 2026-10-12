import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../service/api'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Trash2, MapPin } from 'lucide-react'

function MyTrips() {
    const { user } = useAuth()
    const [trips, setTrips] = useState([])
    const [bookings, setBookings] = useState([])
    const [creatorRequests, setCreatorRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tripsRes, bookingsRes, requestsRes] = await Promise.all([
                    api.get('/trips/user-trips'),
                    api.get('/bookings/user-bookings'),
                    api.get('/bookings/creator-requests')
                ]);
                setTrips(tripsRes.data);
                setBookings(bookingsRes.data);
                setCreatorRequests(requestsRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        }

        if (user) fetchData()
    }, [user])

    const handleRemoveBooking = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this join request?")) return;
        try {
            await api.delete(`/bookings/${id}`);
            // Remove from local state
            setBookings(prev => prev.filter(b => b._id !== id));
        } catch (error) {
            console.error("Failed to remove booking", error);
            alert("Failed to cancel join request. Please try again.");
        }
    };

    const handleRemoveTrip = async (id) => {
        if (!window.confirm("Are you sure you want to delete this trip? This will also remove all group messages and join requests.")) return;
        try {
            await api.delete(`/trips/${id}`);
            // Remove from local state
            setTrips(prev => prev.filter(t => t._id !== id));
        } catch (error) {
            console.error("Failed to remove trip", error);
            alert("Failed to delete trip. You might not have permission or the trip may have already been deleted.");
        }
    };

    if (loading) return (
        <div className='min-h-screen bg-[#050505] flex items-center justify-center'>
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className='min-h-screen bg-[#050505] px-4 sm:px-10 md:px-16 lg:px-24 xl:px-32 py-16 text-white'>
            <div className='max-w-[1280px] mx-auto'>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12'>
                    <div className='flex flex-col'>
                        <h1 className='font-urbanist font-medium text-[32px] sm:text-[48px] tracking-tight text-white mb-2 leading-[1.1]'>
                            {user?.role === 'organiser' ? 'My Created Trips' : 'My Planned Trips'}
                        </h1>
                    </div>

                    {(user?.role === 'organiser' || user?.role === 'admin') && (
                        <Link
                            to={user.role === 'admin' ? "/admin" : "/organiser"}
                            className='inline-flex items-center justify-center gap-2 px-6 h-12 bg-white text-black rounded-lg font-inter font-bold hover:bg-gray-200 transition-colors shadow-sm'
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            Go to {user.role === 'admin' ? 'Admin' : 'Organiser'} Panel
                        </Link>
                    )}
                </div>

                {/* MY PLANNED TRIPS SECTION */}
                {trips.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-20'>
                        {trips.map((trip, index) => (
                            <div key={index} className='relative group h-full'>
                                <Link to={`/view-trip/${trip._id}`} className='block h-full'>
                                    <div className='bg-[#0a0a0a] border border-white/10 rounded-[16px] overflow-hidden hover:border-white/30 transition-all duration-300 cursor-pointer h-full flex flex-col group/card p-4 relative'>

                                        <div className='relative h-[160px] overflow-hidden rounded-[12px] mb-4 bg-black/50'>
                                            <div className="absolute inset-0 bg-black/20 z-10 group-hover/card:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                            <img
                                                src={trip.tripData?.locationInfo?.photoUrl || trip.tripData?.hotels?.[0]?.imageUrl || '/placeholder.jpg'}
                                                alt={trip.destination}
                                                className='h-full w-full object-cover transition-transform duration-1000 group-hover/card:scale-105'
                                                onError={(e) => {
                                                    if (e.target.src.includes(trip.tripData?.locationInfo?.photoUrl) && trip.tripData?.hotels?.[0]?.imageUrl) {
                                                        e.target.src = trip.tripData?.hotels?.[0]?.imageUrl;
                                                    } else {
                                                        e.target.src = '/placeholder.jpg';
                                                    }
                                                }}
                                            />
                                            {/* Status Badge */}
                                            <div className='absolute bottom-2 left-2 z-20'>
                                                <span className={`px-2.5 py-1 rounded-md text-[9px] font-urbanist font-bold uppercase tracking-widest ${trip.status === 'approved' ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white' :
                                                    trip.status === 'rejected' ? 'bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200' :
                                                        'bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-200'
                                                    }`}>
                                                    {trip.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className='flex-1 flex flex-col'>
                                            <h2 className='font-urbanist font-bold text-[18px] tracking-tight leading-tight text-white mb-2 truncate pr-8'>
                                                {trip.destination}
                                            </h2>

                                            <div className='flex items-center gap-1.5 text-gray-500 font-inter text-[11px] mb-4'>
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(trip.createdAt).toLocaleDateString()}
                                            </div>

                                            <div className='flex flex-wrap gap-1.5 mb-4 mt-auto'>
                                                <span className='px-2.5 py-1 bg-white/5 text-gray-300 rounded text-[10px] font-inter font-bold border border-white/10'>
                                                    {trip.duration || 3} Days
                                                </span>
                                                <span className='px-2.5 py-1 bg-white/5 text-gray-300 rounded text-[10px] font-inter font-bold border border-white/10'>
                                                    {trip.budget || 'Budget'}
                                                </span>
                                                {trip.requestOrganiser && (
                                                    <span className='px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-inter font-bold border border-emerald-500/20'>
                                                        Lead
                                                    </span>
                                                )}
                                                {trip.price > 0 && (
                                                    <span className='px-2.5 py-1 bg-white/5 text-gray-300 rounded text-[10px] font-inter font-bold border border-white/10'>
                                                        ${trip.price}
                                                    </span>
                                                )}
                                            </div>

                                            <div className='pt-3 border-t border-white/10 mt-auto'>
                                                <div className='w-full h-9 bg-white text-black hover:bg-gray-200 rounded-lg text-[12px] font-inter font-bold transition-all flex items-center justify-center'>
                                                    View Full Itinerary
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleRemoveTrip(trip._id);
                                    }}
                                    className='absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-md text-gray-400 rounded-lg hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all z-20 shadow-sm'
                                    title="Delete Trip"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='bg-[#0a0a0a] border border-white/10 rounded-2xl p-16 text-center mb-20 flex flex-col items-center justify-center'>
                        <h2 className='text-[20px] font-urbanist font-medium text-white mb-3'>
                            {user?.role === 'organiser' ? 'No Created Trips' : 'No Planned Trips'}
                        </h2>
                        <p className='text-gray-400 font-inter text-[14px] mb-8 max-w-sm mx-auto'>
                            You haven't generated any trips yet. Start planning your perfect itinerary now!
                        </p>
                        <Link
                            to="/create-trip"
                            className='inline-flex items-center justify-center h-12 px-8 bg-white text-black font-inter font-bold rounded-lg hover:bg-gray-200 transition-colors'
                        >
                            {user?.role === 'organiser' ? 'Create First Trip' : 'Plan First Trip'}
                        </Link>
                    </div>
                )}

                {/* JOINED TRIPS SECTION */}
                <div className='pt-12 border-t border-white/10'>
                    <div className='flex items-center gap-4 mb-10'>
                        <h1 className='font-urbanist font-medium text-[36px] tracking-tight text-white'>Joined Trips</h1>
                    </div>

                    {bookings.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-20'>
                            {bookings.map((booking, index) => (
                                <div key={index} className='relative h-full group'>
                                    <Link to={booking.tripId ? `/view-trip/${booking.tripId?._id || booking.tripId}` : '#'} className='block h-full'>
                                        <div className='bg-[#0a0a0a] border border-white/10 rounded-[16px] overflow-hidden hover:border-white/30 transition-all duration-300 cursor-pointer h-full flex flex-col group/card p-4 relative'>

                                            <div className='relative h-[140px] overflow-hidden rounded-[12px] mb-4 bg-black/50'>
                                                <div className="absolute inset-0 bg-black/20 z-10 group-hover/card:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                                <img
                                                    src={booking.hotelImage || booking.tripId?.tripData?.locationInfo?.photoUrl || booking.tripId?.tripData?.hotels?.[0]?.imageUrl || '/placeholder.jpg'}
                                                    alt={booking.hotelName || booking.destination}
                                                    className='h-full w-full object-cover transition-transform duration-1000 group-hover/card:scale-105'
                                                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                                                />
                                                <div className='absolute top-2 right-2 z-20'>
                                                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-urbanist font-bold uppercase tracking-widest text-white shadow-lg
                                                        ${booking.status === 'approved' ? 'bg-white/10 backdrop-blur-md border border-white/20' :
                                                            booking.status === 'rejected' ? 'bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200' :
                                                                'bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-200'}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className='flex-1 flex flex-col'>
                                                <h2 className='font-urbanist font-bold text-[16px] tracking-tight text-white mb-1 truncate'>
                                                    {booking.tripId?.tripData?.hotels?.[0]?.hotelName || booking.destination || 'Unnamed Trip'}
                                                </h2>
                                                <div className="flex items-center gap-1.5 text-gray-500 font-inter text-[11px] mb-4 line-clamp-1">
                                                    <MapPin className="w-3 h-3 shrink-0" />
                                                    <span className="truncate">{booking.destination}</span>
                                                </div>

                                                <div className='mt-auto space-y-2 pt-3 border-t border-white/10'>
                                                    {booking.status === 'approved' && (
                                                        <Link
                                                            to={`/chat?tripId=${booking.tripId?._id || booking.tripId}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className='w-full h-9 bg-white hover:bg-gray-200 text-black flex items-center justify-center rounded-lg text-[12px] font-inter font-bold transition-colors'
                                                        >
                                                            Community Chat
                                                        </Link>
                                                    )}

                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleRemoveBooking(booking._id);
                                                        }}
                                                        className='w-full h-9 flex items-center justify-center bg-transparent border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-[12px] font-inter font-bold transition-colors'
                                                    >
                                                        Cancel Request
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='bg-[#0a0a0a] border border-white/10 rounded-2xl p-16 text-center flex flex-col items-center justify-center mb-20'>
                            <h2 className='text-[20px] font-urbanist font-medium text-white mb-3'>No Joined Trips</h2>
                            <p className='text-gray-400 font-inter text-[14px] max-w-sm mx-auto mb-8'>
                                Join other community trips to meet fellow travelers!
                            </p>
                            <Link to="/explore" className='inline-flex items-center justify-center h-12 px-8 bg-transparent border border-white text-white hover:bg-white/10 font-inter font-bold rounded-lg transition-colors'>
                                Explore Destinations →
                            </Link>
                        </div>
                    )}
                </div>

                {/* Incoming Requests for My Trips */}
                {creatorRequests.length > 0 && (
                    <div className='pt-12 border-t border-white/10 mb-20'>
                        <div className='flex items-center gap-4 mb-10'>
                            <h1 className='font-urbanist font-medium text-[36px] tracking-tight text-white'>Incoming Join Requests</h1>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {creatorRequests.map((request, index) => (
                                <div key={index} className='bg-[#0a0a0a] border border-white/10 rounded-[16px] p-5 relative overflow-hidden group/req hover:border-white/20 transition-colors'>

                                    <div className='relative z-10'>
                                        <div className='flex justify-between items-start mb-5'>
                                            <div className='w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white font-urbanist font-bold text-[18px]'>
                                                {request.userId?.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-urbanist font-bold uppercase tracking-widest ${request.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                request.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                {request.status}
                                            </span>
                                        </div>

                                        <h3 className='font-urbanist font-bold text-white text-[16px] mb-1'>{request.userId?.username}</h3>
                                        <p className='text-[12px] font-inter text-gray-500 mb-5'>{request.userId?.email}</p>

                                        <div className='bg-white/5 rounded-[12px] p-3 border border-white/10'>
                                            <p className='text-[10px] font-inter uppercase font-bold text-gray-500 tracking-wider mb-1'>Requesting to join</p>
                                            <p className='text-[13px] font-urbanist font-bold text-white line-clamp-1 mb-0.5'>{request.tripId?.destination || 'This Trip'}</p>
                                            <p className='text-[11px] font-inter text-gray-400 line-clamp-1'>{request.hotelName}</p>
                                        </div>

                                        <div className='mt-5 pt-4 border-t border-white/10 flex items-center justify-between'>
                                            <span className='text-[11px] font-inter text-gray-500'>{new Date(request.createdAt).toLocaleDateString()}</span>
                                            <Link to="/organiser" className='text-[12px] font-inter font-bold text-white hover:text-gray-300 flex items-center gap-1 transition-colors'>
                                                Process Panel
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyTrips
