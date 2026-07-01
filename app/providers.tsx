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
        fetch('/api/test-db')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log('🟢 MongoDB connected successfully!');
                } else {
                    console.error('🔴 MongoDB connection failed:', data.error);
                }
            })
            .catch((err) => {
                console.error('🔴 MongoDB connection error:', err);
            });
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

