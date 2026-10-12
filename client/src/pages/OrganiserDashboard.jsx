import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Map, MessageSquare,
    CheckCircle, XCircle, Clock, ChevronRight,
    Search, Filter, ExternalLink, Shield,
    Edit, Trash2, Save, UserX, Globe, Plus, Zap, ArrowUpRight, BarChart3, Activity, Bell
} from 'lucide-react';
import api from '../service/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/toast';

const OrganiserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [trips, setTrips] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Management State
    const [editingTrip, setEditingTrip] = useState(null);
    const [editForm, setEditForm] = useState({
        destination: '',
        budget: '',
        duration: '',
        capacity: '',
        price: '',
        terms: '',
        packageNotes: '',
        isBooked: false,
        isPublic: true,
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        if (!user || (user.role !== 'organiser' && user.role !== 'admin')) {
            navigate('/');
            return;
        }
        fetchOrganiserData();
    }, [user, navigate]);

    const fetchOrganiserData = async () => {
        setLoading(true);
        try {
            const [tripsRes, requestsRes] = await Promise.all([
                api.get('/organiser/my-managed-trips'),
                api.get('/organiser/join-requests')
            ]);
            setTrips(tripsRes.data);
            setRequests(requestsRes.data.filter(req => req.tripId));
        } catch (err) {
            console.error("Failed to fetch organiser data", err);
            toast({ title: "Signal Failure", description: "Failed to load dashboard data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleRequestAction = async (requestId, status) => {
        try {
            await api.put(`/organiser/requests/${requestId}/validate`, { status });
            toast({ title: "Authorized", description: `Request ${status} successfully` });
            fetchOrganiserData();
        } catch (err) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to update request", variant: "destructive" });
        }
    };

    const handleDeleteTrip = async (id) => {
        if (!window.confirm("Terminate this operation? Data will be purged permanently.")) return;
        try {
            await api.delete(`/trips/${id}`);
            toast({ title: "Purged", description: "Trip deleted successfully" });
            fetchOrganiserData();
        } catch (err) {
            toast({ title: "Error", description: "Failed to delete trip", variant: "destructive" });
        }
    };

    const openEditModal = (trip) => {
        setEditingTrip(trip);
        setEditForm({
            destination: trip.destination,
            budget: trip.budget,
            duration: trip.duration,
            capacity: trip.capacity || 10,
            price: trip.price || 0,
            terms: trip.terms || "",
            packageNotes: trip.packageNotes || "",
            isBooked: trip.isBooked || false,
            isPublic: trip.isPublic !== undefined ? trip.isPublic : true,
            startDate: trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '',
            endDate: trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : ''
        });
    };

    const handleUpdateTrip = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/trips/${editingTrip._id}`, editForm);
            toast({ title: "Synchronized", description: "Trip parameters updated successfully" });
            setEditingTrip(null);
            fetchOrganiserData();
        } catch (err) {
            toast({ title: "Error", description: "Failed to update trip", variant: "destructive" });
        }
    };

    if (loading) return (
        <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-[#050505]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-t-2 border-white rounded-full animate-spin"></div>
                <span className="font-urbanist font-bold text-[10px] uppercase tracking-[0.4em] text-gray-500">Initializing Control Center</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 font-inter flex flex-col lg:flex-row overflow-x-hidden">

            {/* Navigation - Bottom bar on mobile, Sidebar on desktop */}
            <aside className="fixed bottom-0 left-0 right-0 z-50 lg:relative lg:w-64 bg-[#0a0a0a] border-t lg:border-t-0 lg:border-r border-white/5 flex lg:flex-col h-16 lg:h-screen shrink-0 backdrop-blur-xl lg:backdrop-blur-none">
                <div className="flex-1 lg:p-10 flex lg:flex-col items-center lg:items-stretch">
                    <div className="hidden lg:flex lg:items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-white flex items-center justify-center text-black shrink-0">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="font-urbanist font-black text-white text-[10px] uppercase tracking-[0.3em] truncate">Command Center</h2>
                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em]">{user?.username}</p>
                        </div>
                    </div>

                    <nav className="flex lg:flex-col flex-1 justify-around lg:justify-start lg:space-y-3">
                        {[
                            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                            { id: 'trips', label: 'Trips', icon: Map },
                            { id: 'requests', label: 'Signals', icon: Activity },
                            { id: 'chat', label: 'Chat', icon: MessageSquare },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-4 p-2 lg:px-4 lg:py-3 transition-all relative group ${activeTab === item.id
                                    ? 'text-white'
                                    : 'text-gray-600 hover:text-gray-400'
                                    }`}
                            >
                                {activeTab === item.id && <div className="absolute top-0 lg:left-0 lg:top-0 lg:bottom-0 h-0.5 lg:h-auto lg:w-1 bg-white left-2 right-2 lg:right-auto" />}
                                <div className="relative">
                                    <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-gray-700'}`} />
                                    {item.id === 'requests' && requests.filter(r => r.status === 'pending').length > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-none bg-red-500 ring-2 ring-[#0a0a0a] animate-pulse" />
                                    )}
                                </div>
                                <span className="text-[8px] lg:text-[11px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em]">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="hidden lg:block mt-auto">
                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-sm">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4">Quick Deploy</p>
                            <button
                                onClick={() => navigate('/create-trip')}
                                className="w-full h-10 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2 rounded-sm"
                            >
                                <Plus className="w-3 h-3" />
                                Start Plan
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Content Area - Internal Scroll */}
            <main className="flex-1 overflow-x-hidden min-h-screen p-6 lg:p-12 pb-24 lg:pb-12">
                <div className="max-w-[1240px] mx-auto space-y-12">

                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/5">
                        <div className="flex flex-col gap-6 flex-1">
                            <div className="flex items-center justify-between w-full">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">
                                        <Activity className="w-3 h-3" /> Dashboard / {activeTab}
                                    </div>
                                    <h1 className="text-[36px] md:text-[56px] font-urbanist font-bold text-white tracking-tighter leading-none">
                                        Tactical <span className="text-gray-600">Planner.</span>
                                    </h1>
                                </div>

                                {/* Mobile Notification Shortcut */}
                                <div className="md:hidden flex items-center gap-3">
                                    {requests.filter(r => r.status === 'pending').length > 0 && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full animate-in fade-in zoom-in duration-500">
                                            <Bell className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                                                {requests.filter(r => r.status === 'pending').length} SIGNAL
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-500 text-[14px] font-medium max-w-md">Manage itineraries, monitor traveler signals, and execute global operations from one interface.</p>
                        </div>

                        <div className="flex gap-4">
                            <button className="h-10 px-6 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all rounded-sm flex items-center gap-2">
                                <Filter className="w-3 h-3" /> Search Operations
                            </button>
                        </div>
                    </header>

                    {activeTab === 'overview' && (
                        <div className="space-y-12 animate-in fade-in duration-1000">
                            {/* Ultra-Sleek Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                                {[
                                    { label: 'Total Operations', value: trips.length, trend: '+2', icon: Map },
                                    { label: 'Active Signals', value: requests.filter(r => r.status === 'pending').length, trend: 'HIGH', icon: Activity },
                                    { label: 'Verified Nodes', value: requests.filter(r => r.status === 'approved').length, trend: '+12%', icon: Users },
                                    { label: 'Sync Status', value: 'OK', trend: '100%', icon: Shield },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/[0.03] p-6 lg:p-8 border border-white/5 rounded-sm group hover:border-white/10 transition-all">
                                        <div className="flex justify-between items-start mb-6">
                                            <stat.icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{stat.trend}</span>
                                        </div>
                                        <h3 className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{stat.label}</h3>
                                        <p className="text-3xl font-urbanist font-bold text-white tracking-tighter">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Feed & Monitor Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Signals Feed */}
                                <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden">
                                    <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">PRIORITY SIGNALS</h3>
                                        <ArrowUpRight className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div className="divide-y divide-white/5">
                                        {requests.length > 0 ? requests.slice(0, 4).map((req, idx) => (
                                            <div key={idx} className="p-6 lg:p-8 flex items-center justify-between hover:bg-white/[0.03] transition-all">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-gray-400">
                                                        {req.userId?.username?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[13px] font-bold text-white">{req.userId?.username}</h4>
                                                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-0.5">TARGET: {req.tripId?.destination}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {req.status === 'pending' ? (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleRequestAction(req._id, 'approved')}
                                                                className="h-8 px-4 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm"
                                                            >
                                                                AUTH
                                                            </button>
                                                            <button
                                                                onClick={() => handleRequestAction(req._id, 'rejected')}
                                                                className="h-8 px-4 bg-transparent border border-white/10 text-gray-500 text-[9px] font-black uppercase tracking-widest hover:text-white transition-all rounded-sm"
                                                            >
                                                                DROP
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className={`text-[8px] font-black uppercase tracking-widest ${req.status === 'approved' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {req.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="py-20 text-center opacity-30">
                                                <p className="text-[9px] font-black uppercase tracking-[0.5em]">System Idle</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Active Operations Monitor */}
                                <div className="lg:col-span-4 space-y-4">
                                    <div className="p-8 bg-white text-black rounded-sm h-full flex flex-col justify-between group cursor-pointer hover:bg-gray-200 transition-all" onClick={() => setActiveTab('trips')}>
                                        <div className="space-y-4">
                                            <BarChart3 className="w-6 h-6" />
                                            <h3 className="text-[14px] font-black uppercase tracking-[0.2em] leading-tight">Monitor Active Operations</h3>
                                        </div>
                                        <div className="flex items-end justify-between pt-12">
                                            <span className="text-[48px] font-urbanist font-bold leading-none">{trips.length}</span>
                                            <ArrowUpRight className="w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'trips' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700">
                            {trips.length > 0 ? trips.map((trip) => (
                                <div key={trip._id} className="bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden group hover:border-white/20 transition-all">
                                    <div className="h-40 relative">
                                        <img
                                            src={trip.tripData?.hotels?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'}
                                            alt={trip.destination}
                                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                        />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-sm text-[8px] font-black uppercase tracking-widest text-white border border-white/10">
                                            {trip.duration} DAYS
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h3 className="text-xl font-urbanist font-bold text-white tracking-widest uppercase mb-1">{trip.destination}</h3>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{trip.budget} BUDGET / {trip.price > 0 ? `₹${trip.price}` : 'VARIABLE'}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                            <div className="flex -space-x-2">
                                                {requests.filter(r => r.tripId?._id === trip._id && r.status === 'approved').slice(0, 3).map((r, i) => (
                                                    <div key={i} className="w-8 h-8 bg-white border border-black flex items-center justify-center text-black text-[9px] font-black">
                                                        {r.userId?.username?.[0]?.toUpperCase()}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => navigate(`/view-trip/${trip._id}`)} className="p-2 bg-white/5 hover:bg-white text-gray-500 hover:text-black transition-all rounded-sm">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => openEditModal(trip)} className="p-2 bg-white/5 hover:bg-white text-gray-500 hover:text-black transition-all rounded-sm">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 opacity-20">
                                    <p className="text-[12px] font-black uppercase tracking-[0.5em]">No Managed Operations</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden animate-in fade-in duration-700">
                            <div className="p-8 border-b border-white/5">
                                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.4em]">AUTH SIGNAL TERMINAL</h3>
                            </div>
                            <div className="overflow-x-auto overflow-y-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-white/[0.03]">
                                        <tr>
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">NODE IDENTITY</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">DESTINATION</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">STATUS</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">EXECUTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {requests.map((req) => (
                                            <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-gray-400">
                                                            {req.userId?.username?.[0]?.toUpperCase()}
                                                        </div>
                                                        <div className="text-[12px] font-bold">{req.userId?.username}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-[11px] font-black uppercase tracking-wider">{req.tripId?.destination}</td>
                                                <td className="px-8 py-6 text-[9px] font-black uppercase tracking-widest">
                                                    <span className={req.status === 'approved' ? 'text-emerald-500' : 'text-amber-500'}>{req.status}</span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    {req.status === 'pending' ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleRequestAction(req._id, 'approved')} className="h-8 px-5 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-sm">AUTHORIZE</button>
                                                            <button onClick={() => handleRequestAction(req._id, 'rejected')} className="h-8 px-5 bg-transparent border border-white/10 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-sm">REJECT</button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleRequestAction(req._id, 'revoked')} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-400">PURGE</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700">
                            {trips.map((trip) => (
                                <div key={trip._id} onClick={() => navigate(`/chat?tripId=${trip._id}`)} className="bg-white/[0.02] border border-white/5 p-8 rounded-sm hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer group">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center text-black mb-6 group-hover:scale-110 transition-transform">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-xl font-urbanist font-bold text-white uppercase tracking-widest mb-2">{trip.destination}</h4>
                                    <div className="flex items-center gap-2 mb-8">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-none animate-pulse" />
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">ENCRYPTED FEED</span>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-600 group-hover:text-white uppercase tracking-[0.2em] transition-all">
                                        ENTER FREQUENCY <ArrowUpRight className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main >

            {/* Modal Override Styling to match home page buttons */}
            {
                editingTrip && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-[#0a0a0a] w-full max-w-xl border border-white/10 p-10 space-y-10 rounded-sm">
                            <header className="flex justify-between items-center pb-6 border-b border-white/5">
                                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.4em]">SYSTEM CONFIG OVERRIDE</h3>
                                <button onClick={() => setEditingTrip(null)}><XCircle className="w-6 h-6 text-gray-700 hover:text-white transition-colors" /></button>
                            </header>
                            <form onSubmit={handleUpdateTrip} className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Destination ID</label>
                                        <input value={editForm.destination} onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })} className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-xs font-bold outline-none focus:border-white/30" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Price Unit (₹)</label>
                                        <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-xs font-bold outline-none focus:border-white/30" />
                                    </div>
                                </div>
                                <div className="p-6 bg-white/[0.03] border border-white/5 flex items-center gap-4">
                                    <input type="checkbox" id="ebooked" checked={editForm.isBooked} onChange={(e) => setEditForm({ ...editForm, isBooked: e.target.checked })} className="w-5 h-5 accent-white shrink-0" />
                                    <label htmlFor="ebooked" className="text-[10px] font-black text-white uppercase tracking-widest">Finalize Operation Protocol</label>
                                </div>
                                <button type="submit" className="w-full h-14 bg-white text-black text-[12px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm">Deploy Config Changes</button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default OrganiserDashboard;
