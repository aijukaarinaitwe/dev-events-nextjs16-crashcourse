'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="glass sticky top-0 z-50">
            <nav className="flex flex-row justify-between items-center mx-auto container sm:px-10 px-5 py-4">
                <Link href='/' className="logo flex flex-row items-center gap-2">
                    <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
                    <p className="text-xl font-bold italic max-sm:block">DevEvent</p>
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden sm:flex flex-row items-center gap-6 list-none">
                    <li className="list-none">
                        <Link href="/events/" className="hover:text-primary transition-colors duration-200">Events</Link>
                    </li>
                    <li className="list-none">
                        <Link href="/events/create/" className="hover:text-primary transition-colors duration-200">Create Event</Link>
                    </li>
                </ul>

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
                    <Link 
                        href="/events/create/" 
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-medium hover:text-primary transition-colors duration-200"
                    >
                        Create Event
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

