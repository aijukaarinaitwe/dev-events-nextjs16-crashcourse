'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
    const router = useRouter();
    
    // States for all the required schema fields
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [venue, setVenue] = useState('');
    const [mode, setMode] = useState('offline');
    const [description, setDescription] = useState('');
    const [overview, setOverview] = useState('');
    const [audience, setAudience] = useState('');
    const [organizer, setOrganizer] = useState('');
    
    // Comma-separated or newline-separated inputs
    const [tags, setTags] = useState('');
    const [agenda, setAgenda] = useState('');

    // Cloudinary upload & Dropzone states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file (PNG, JPG, JPEG, WEBP).');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('File is too large. Max size is 5MB.');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file (PNG, JPG, JPEG, WEBP).');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('File is too large. Max size is 5MB.');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Front-end validations
        const isOnline = mode === 'online';
        if (!title || !date || !time || !location || (!isOnline && !venue) || !mode || !description || !organizer) {
            setError('Please fill in all compulsory fields (*).');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Process tags (comma-separated) and agenda (newline-separated)
            const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
            const parsedAgenda = agenda.split('\n').map(a => a.trim()).filter(Boolean);

            const formDataPayload = new FormData();
            formDataPayload.append('title', title);
            formDataPayload.append('date', date);
            formDataPayload.append('time', time);
            formDataPayload.append('location', location);
            formDataPayload.append('venue', venue);
            formDataPayload.append('mode', mode);
            formDataPayload.append('description', description);
            formDataPayload.append('overview', overview);
            formDataPayload.append('audience', audience);
            formDataPayload.append('organizer', organizer);
            
            // Append arrays as JSON strings
            formDataPayload.append('tags', JSON.stringify(parsedTags));
            formDataPayload.append('agenda', JSON.stringify(parsedAgenda));

            // Append file if selected
            if (imageFile) {
                formDataPayload.append('image', imageFile);
            }

            const res = await fetch('/api/events', {
                method: 'POST',
                body: formDataPayload
            });

            const data = await res.json();

            if (res.ok) {
                // Successful creation
                setSuccess('Event created successfully!');
                // Reset form or redirect after a delay
                setTimeout(() => {
                    router.push(`/events/${data.event.slug}`);
                }, 2000);
            } else {
                setError(data.message || 'event creation failed');
            }
        } catch (err) {
            console.error('Error creating event:', err);
            setError('A network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-2xl mx-auto space-y-8 py-6 w-full px-4">
            <div className="text-center">
                <h1 className="text-4xl text-gradient">Create New Event</h1>
                <p className="text-light-200 mt-2">Share your event with the global developer community.</p>
            </div>

            <div className="bg-dark-100 border border-border-dark card-shadow rounded-[10px] p-6 md:p-8 space-y-6">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    
                    {error && (
                        <div className="p-4 bg-rose-950/30 border border-rose-500/20 text-rose-400 rounded-md text-sm font-semibold">
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 rounded-md text-sm font-semibold">
                            ✅ {success}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className="text-sm font-medium text-light-200">
                            Event Title <span className="text-rose-500">*</span>
                        </label>
                        <input 
                            id="title"
                            type="text" 
                            required
                            placeholder="e.g. Next.js Conf 2026" 
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="date" className="text-sm font-medium text-light-200">
                                Date <span className="text-rose-500">*</span>
                            </label>
                            <input 
                                id="date"
                                type="date" 
                                required
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="time" className="text-sm font-medium text-light-200">
                                Time <span className="text-rose-500">*</span>
                            </label>
                            <input 
                                id="time"
                                type="time" 
                                required
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="location" className="text-sm font-medium text-light-200">
                                Location (City, Country) <span className="text-rose-500">*</span>
                            </label>
                            <input 
                                id="location"
                                type="text" 
                                required
                                placeholder="e.g. San Francisco, CA" 
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="venue" className="text-sm font-medium text-light-200">
                                Venue {mode !== 'online' && <span className="text-rose-500">*</span>}
                            </label>
                            <input 
                                id="venue"
                                type="text" 
                                required={mode !== 'online'}
                                placeholder={mode === 'online' ? 'e.g. Zoom / YouTube Live (Optional)' : 'e.g. Moscone Center'} 
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="mode" className="text-sm font-medium text-light-200">
                            Event Mode <span className="text-rose-500">*</span>
                        </label>
                        <select 
                            id="mode"
                            required
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                        >
                            <option value="offline">Offline</option>
                            <option value="online">Online</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>

                    {/* Enterprise Grade Drag & Drop Upload Zone */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-light-200">
                            Event Banner Image <span className="text-light-200/60 font-normal">(Optional)</span>
                        </label>
                        
                        {imagePreview ? (
                            <div className="relative border border-border-dark/50 rounded-[10px] overflow-hidden group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={imagePreview} 
                                    alt="Upload preview" 
                                    className="w-full max-h-[300px] object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-[6px] font-semibold text-sm transition-colors duration-200"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-[10px] p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[220px] ${
                                    isDragActive 
                                        ? 'border-primary bg-primary/5 scale-[0.99]' 
                                        : 'border-border-dark/60 bg-dark-200/50 hover:border-primary/50'
                                }`}
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <svg 
                                    className={`w-12 h-12 transition-transform duration-300 ${isDragActive ? 'translate-y-[-4px] text-primary' : 'text-light-200/60'}`}
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={1.5} 
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                                    />
                                </svg>
                                <div>
                                    <p className="text-light-100 font-medium">Drag & drop your event banner here</p>
                                    <p className="text-xs text-light-200/60 mt-1">Supports PNG, JPG, JPEG, WEBP (Max 5MB)</p>
                                </div>
                                <button
                                    type="button"
                                    className="mt-2 text-xs font-semibold text-primary border border-primary/30 hover:border-primary px-3 py-1.5 rounded-[4px] hover:bg-primary/5 transition-all duration-200"
                                >
                                    Or Browse Files
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="audience" className="text-sm font-medium text-light-200">
                                Audience <span className="text-light-200/60 font-normal">(Optional)</span>
                            </label>
                            <input 
                                id="audience"
                                type="text" 
                                placeholder="e.g. Next.js Developers, Frontend Engineers" 
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="organizer" className="text-sm font-medium text-light-200">
                                Organizer Description <span className="text-rose-500">*</span>
                            </label>
                            <input 
                                id="organizer"
                                type="text" 
                                required
                                placeholder="e.g. Vercel Events Team" 
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                                value={organizer}
                                onChange={(e) => setOrganizer(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="tags" className="text-sm font-medium text-light-200">
                            Tags (comma-separated) <span className="text-light-200/60 font-normal">(Optional)</span>
                        </label>
                        <input 
                            id="tags"
                            type="text" 
                            placeholder="e.g. Nextjs, React, Web Development" 
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="agenda" className="text-sm font-medium text-light-200">
                            Agenda (One item per line) <span className="text-light-200/60 font-normal">(Optional)</span>
                        </label>
                        <textarea 
                            id="agenda"
                            rows={3}
                            placeholder="09:00 AM - Opening Keynote&#10;10:30 AM - Breakout Sessions&#10;12:00 PM - Lunch & Networking"
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 resize-none w-full focus:outline-none focus:border-primary/50"
                            value={agenda}
                            onChange={(e) => setAgenda(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="overview" className="text-sm font-medium text-light-200">
                            Event Overview (Brief Summary) <span className="text-light-200/60 font-normal">(Optional)</span>
                        </label>
                        <textarea 
                            id="overview"
                            rows={2}
                            placeholder="Provide a brief summary (auto-generated from description if left blank)..."
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 resize-none w-full focus:outline-none focus:border-primary/50"
                            value={overview}
                            onChange={(e) => setOverview(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="description" className="text-sm font-medium text-light-200">
                            Full Description <span className="text-rose-500">*</span>
                        </label>
                        <textarea 
                            id="description"
                            required
                            rows={4}
                            placeholder="Provide the detailed description of the event..."
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 resize-none w-full focus:outline-none focus:border-primary/50"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/95 text-black w-full font-semibold py-3 rounded-[6px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Event & Uploading Banner...' : 'Create Event'}
                    </button>
                </form>
            </div>

            <div className="text-center">
                <Link href="/admin/events/" className="text-primary hover:underline font-medium">
                    ← Back to Dashboard
                </Link>
            </div>
        </section>
    );
}
