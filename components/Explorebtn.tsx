'use client';

import Image from "next/image";
import Link from "next/link";

const Explorebtn = () => {
    return (
        <Link href="/events" id="explore-btn" className="mt-7 mx-auto">
            Explore Events
            <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} style={{ width: 'auto', height: 'auto' }} />
        </Link>

    )
}
export default Explorebtn
