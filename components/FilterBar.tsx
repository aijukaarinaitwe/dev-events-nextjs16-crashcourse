'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, MapPin, Globe, Users, Calendar as CalendarIcon } from 'lucide-react';

export default function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [mode, setMode] = useState(searchParams.get('mode') || 'all');
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [date, setDate] = useState(searchParams.get('date') || '');

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (search) params.set('search', search);
        else params.delete('search');
        
        if (mode !== 'all') params.set('mode', mode);
        else params.delete('mode');
        
        if (location) params.set('location', location);
        else params.delete('location');

        if (date) params.set('date', date);
        else params.delete('date');

        const query = params.toString();
        router.push(`/events${query ? `?${query}` : ''}`, { scroll: false });
    }, [search, mode, location, date, router, searchParams]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-dark-100/50 p-6 rounded-xl border border-border-dark">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-300" />
                <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full bg-dark-200 border border-border-dark rounded-[6px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-light-100"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-300" />
                <select
                    className="w-full bg-dark-200 border border-border-dark rounded-[6px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-light-100 appearance-none"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                >
                    <option value="all">All Modes</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                </select>
            </div>

            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-300" />
                <input
                    type="text"
                    placeholder="Location..."
                    className="w-full bg-dark-200 border border-border-dark rounded-[6px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-light-100"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-300" />
                <input
                    type="date"
                    className="w-full bg-dark-200 border border-border-dark rounded-[6px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-light-100 [color-scheme:dark]"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
        </div>
    );
}
