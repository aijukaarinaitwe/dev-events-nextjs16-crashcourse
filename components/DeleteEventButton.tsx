'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteEventButtonProps {
    id: string;
    title: string;
}

export default function DeleteEventButton({ id, title }: DeleteEventButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title}"? This will also remove all bookings for this event.`)) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/events/${id}/`, {
                method: 'DELETE'
            });

            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete event');
            }
        } catch (e) {
            console.error(e);
            alert('A network error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleDelete}
            disabled={loading}
            className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white px-3 py-1.5 rounded-[4px] font-semibold text-xs transition-all duration-200 disabled:opacity-50"
        >
            {loading ? 'Deleting...' : 'Delete'}
        </button>
    );
}
