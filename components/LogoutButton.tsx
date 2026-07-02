'use client';

import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/');
                    router.refresh();
                }
            }
        });
    };

    return (
        <button 
            onClick={handleLogout}
            className="text-light-200 hover:text-rose-400 text-sm font-semibold transition-colors duration-200 bg-rose-600/10 hover:bg-rose-600/20 px-3.5 py-1.5 rounded-[6px]"
        >
            Logout
        </button>
    );
}
