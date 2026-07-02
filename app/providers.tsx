'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function PostHogPageView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const posthogClient = usePostHog()

    useEffect(() => {
        if (pathname && posthogClient) {
            let url = window.origin + pathname
            const search = searchParams.toString()
            if (search) url += `?${search}`
            posthogClient.capture('$pageview', { '$current_url': url })
        }
    }, [pathname, searchParams, posthogClient])

    return null
}

function DbTester() {
    useEffect(() => {
        let active = true;
        const testDb = async () => {
            try {
                const res = await fetch('/api/test-db');
                const data = await res.json();
                if (data.success && active) {
                    console.log('🟢 MongoDB connected successfully!');
                } else if (active) {
                    console.error('🔴 MongoDB connection failed:', data.error);
                }
            } catch (err) {
                if (active) {
                    console.warn('🟡 MongoDB connection check failed initially (will retry in 3s)...');
                    setTimeout(() => {
                        if (active) {
                            fetch('/api/test-db')
                                .then((res) => res.json())
                                .then((data) => {
                                    if (data.success && active) {
                                        console.log('🟢 MongoDB connected successfully after retry!');
                                    }
                                })
                                .catch(() => {});
                        }
                    }, 3000);
                }
            }
        };
        testDb();
        return () => {
            active = false;
        };
    }, []);

    return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
            person_profiles: 'identified_only',
            capture_pageview: false,
        })
    }, [])

    return (
        <PHProvider client={posthog}>
            <Suspense fallback={null}>
                <PostHogPageView />
            </Suspense>
            <DbTester />
            {children}
        </PHProvider>
    )
}

