import React, { useEffect, useState } from 'react';
import api from '../service/api';
import UserTripCard from '../components/ui/UserTripCard';
import TripFilters from '../components/custom/TripFilters';
import { Loader2, Globe } from 'lucide-react';

const Explore = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        query: '',
        budget: '',
        minDays: '',
        maxDays: ''
    });
    const [userBookings, setUserBookings] = useState([]);

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                // Construct query params
                const params = new URLSearchParams();
                if (filters.query) params.append('query', filters.query);
                if (filters.budget) params.append('budget', filters.budget);
                if (filters.minDays) params.append('minDays', filters.minDays);
                if (filters.maxDays) params.append('maxDays', filters.maxDays);

                const res = await api.get(`/trips?${params.toString()}`);
                setTrips(res.data);

                // Fetch user bookings if logged in
                if (localStorage.getItem('token')) {
                    const bookingsRes = await api.get('/bookings/user-bookings');
                    setUserBookings(bookingsRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch trips", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchTrips();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    return (
        <div className="px-4 md:px-16 lg:px-24 py-16 bg-[#050505] min-h-screen text-white">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-[32px] sm:text-[48px] lg:text-[56px] font-urbanist font-medium tracking-tight leading-[1.1] mb-2 sm:mb-3 text-white">
                        Explore <span className="text-gray-400">Community.</span>
                    </h1>
                    <p className="text-gray-400 font-inter text-[14px] sm:text-[17px] max-w-xl">
                        Discover itineraries created by our expert travelers.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 sm:mb-12 border-b border-white/10 pb-6 sm:pb-8">
                    <TripFilters filters={filters} setFilters={setFilters} />
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-white/40" />
                    </div>
                ) : trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {trips.map((trip) => {
                            const booking = userBookings.find(b => b.tripId?._id === trip._id || b.tripId === trip._id);
                            return (
                                <UserTripCard
                                    key={trip._id}
                                    trip={trip}
                                    isJoined={!!booking}
                                    bookingStatus={booking?.status}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 border border-white/10 bg-[#0a0a0a] rounded-2xl flex flex-col items-center justify-center">
                        <Globe className="w-12 h-12 text-white/20 mb-6" />
                        <h3 className="text-[20px] font-urbanist font-medium text-white mb-2">No trips found</h3>
                        <p className="text-gray-400 font-inter text-[14px]">Try adjusting your filters to discover more adventures.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
