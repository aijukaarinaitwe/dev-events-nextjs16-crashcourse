'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/');
                    router.refresh();
                    setIsOpen(false);
                }
            }
        });
    };

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
                            <Link href="/events/" className="hover:text-primary transition-colors duration-200 text-sm">Events</Link>
                        </li>
                        {session?.user?.role === 'admin' && (
                            <li className="list-none">
                                <Link href="/admin/events/" className="hover:text-primary transition-colors duration-200 text-sm text-primary">Admin Panel</Link>
                            </li>
                        )}
                        {session ? (
                            <li className="list-none">
                                <button 
                                    onClick={handleLogout}
                                    className="text-light-200 hover:text-rose-400 text-sm font-semibold transition-colors duration-200 bg-rose-600/10 hover:bg-rose-600/20 px-3.5 py-1.5 rounded-[6px]"
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li className="list-none">
                                <Link 
                                    href="/login/" 
                                    className="bg-primary hover:bg-primary/95 text-black font-semibold px-4.5 py-2 rounded-[6px] transition-all duration-200 text-xs"
                                >
                                    Sign In
                                </Link>
                            </li>
                        )}
                    </ul>
                )}

                {/* Enterprise Grade Hamburger Toggle */}
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
                        href="/events/" 
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-medium hover:text-primary transition-colors duration-200"
                    >
                        Events
                    </Link>
                    {mounted && session?.user?.role === 'admin' && (
                        <Link 
                            href="/admin/events/" 
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-medium hover:text-primary text-primary transition-colors duration-200"
                        >
                            Admin Panel
                        </Link>
                    )}
                    {mounted && session ? (
                        <button 
                            onClick={handleLogout}
                            className="text-2xl font-medium text-rose-400 hover:text-rose-300 transition-colors duration-200"
                        >
                            Logout
                        </button>
                    ) : (
                        mounted && (
                            <Link 
                                href="/login/" 
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


