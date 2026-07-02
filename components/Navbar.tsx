'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from '@/lib/auth-client';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, isPending } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    setIsOpen(false);
                    window.location.href = '/';
                }
            }
        });
    };

    // Initials avatar for logged-in user
    const userInitials = session?.user?.name
        ? session.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <header className="glass sticky top-0 z-50">
            <nav className="flex flex-row justify-between items-center mx-auto container sm:px-10 px-5 py-4">
                <Link href='/' className="logo flex flex-row items-center gap-2">
                    <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
                    <p className="text-xl font-bold italic max-sm:block text-light-100">DevEvent</p>
                </Link>

                {/* Desktop Menu */}
                {mounted && !isPending && (
                    <ul className="hidden sm:flex flex-row items-center gap-6 list-none">
                        <li className="list-none">
                            <Link href="/events" className="hover:text-primary transition-colors duration-200 text-sm">Events</Link>
                        </li>
                        {session?.user?.role === 'admin' && (
                            <li className="list-none">
                                <Link href="/admin/events" className="hover:text-primary transition-colors duration-200 text-sm text-primary">Admin Panel</Link>
                            </li>
                        )}
                        {session ? (
                            <li className="list-none flex items-center gap-3">
                                {/* User avatar + name */}
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-xs font-bold select-none">
                                        {userInitials}
                                    </div>
                                    <span className="text-sm text-light-200 max-lg:hidden">
                                        {session.user.name?.split(' ')[0]}
                                    </span>
                                </div>
                                <button
                                    id="navbar-logout-btn"
                                    onClick={handleLogout}
                                    className="text-light-200 hover:text-rose-400 text-sm font-semibold transition-colors duration-200 bg-rose-600/10 hover:bg-rose-600/20 px-3.5 py-1.5 rounded-[6px]"
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li className="list-none">
                                <Link
                                    id="navbar-signin-btn"
                                    href="/login"
                                    className="bg-primary hover:bg-primary/95 text-black font-semibold px-4 py-2 rounded-[6px] transition-all duration-200 text-xs"
                                >
                                    Sign In
                                </Link>
                            </li>
                        )}
                    </ul>
                )}

                {/* Hamburger Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex sm:hidden flex-col justify-center items-center w-8 h-8 relative focus:outline-none z-50"
                    aria-label="Toggle menu"
                >
                    <span className={`block absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
                    <span className={`block absolute h-0.5 w-6 bg-white transition duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                    <span className={`block absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
                </button>

                {/* Mobile Menu Overlay */}
                <div
                    className={`fixed inset-0 z-40 bg-[#030708]/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 transition-all duration-300 ease-in-out sm:hidden ${
                        isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'
                    }`}
                >
                    <Link
                        href="/events"
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-medium hover:text-primary transition-colors duration-200"
                    >
                        Events
                    </Link>
                    {mounted && session?.user?.role === 'admin' && (
                        <Link
                            href="/admin/events"
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-medium hover:text-primary text-primary transition-colors duration-200"
                        >
                            Admin Panel
                        </Link>
                    )}
                    {mounted && session ? (
                        <div className="flex flex-col items-center gap-4">
                            {/* Mobile user avatar */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold select-none">
                                    {userInitials}
                                </div>
                                <span className="text-lg text-light-200">{session.user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-2xl font-medium text-rose-400 hover:text-rose-300 transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        mounted && (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-medium hover:text-primary transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                        )
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
