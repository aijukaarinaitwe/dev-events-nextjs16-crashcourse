import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Admin Subheader navigation */}
            <div className="bg-dark-100 border-b border-border-dark py-3 px-5 sm:px-10">
                <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-6">
                        <span className="text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-1 rounded-[4px]">
                            Admin Mode
                        </span>
                        <div className="flex flex-row items-center gap-4">
                            <Link 
                                href="/admin/events/" 
                                className="text-sm text-light-100 hover:text-primary transition-colors font-medium"
                            >
                                Dashboard
                            </Link>
                            <Link 
                                href="/admin/events/create/" 
                                className="text-sm text-light-100 hover:text-primary transition-colors font-medium"
                            >
                                Create Event
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/events/" className="text-sm text-light-200 hover:text-light-100">
                            Public View
                        </Link>
                        <LogoutButton />
                    </div>
                </div>
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-5 sm:px-10 py-8">
                {children}
            </main>
        </div>
    );
}
