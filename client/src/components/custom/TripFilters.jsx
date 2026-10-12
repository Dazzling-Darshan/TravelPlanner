import React from 'react';
import { Search } from 'lucide-react';

const TripFilters = ({ filters, setFilters }) => {
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-4 items-center bg-transparent">
            {/* Search Input */}
            <div className="flex-[2] w-full sm:min-w-[280px] relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                    type="text"
                    name="query"
                    placeholder="Search destinations..."
                    value={filters.query}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors text-white font-inter text-[14px] placeholder:text-gray-500"
                />
            </div>

            {/* Budget Select */}
            <div className="flex-1 w-full sm:min-w-[140px]">
                <select
                    name="budget"
                    value={filters.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white font-inter text-[14px] appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
                >
                    <option value="">All Budgets</option>
                    <option value="Cheap">Cheap</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Luxury">Luxury</option>
                </select>
            </div>

            {/* Min Max Days */}
            <div className="flex items-center gap-2 flex-[1.5] w-full sm:min-w-[200px]">
                <input
                    type="number"
                    name="minDays"
                    placeholder="Min Days"
                    value={filters.minDays}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white font-inter text-[14px] placeholder:text-gray-500 min-w-0"
                />
                <span className="text-gray-600 font-inter px-1">-</span>
                <input
                    type="number"
                    name="maxDays"
                    placeholder="Max Days"
                    value={filters.maxDays}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white font-inter text-[14px] placeholder:text-gray-500 min-w-0"
                />
            </div>
        </div>
    );
};

export default TripFilters;
