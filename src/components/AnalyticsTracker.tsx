"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname } from "next/navigation";

function AnalyticsTrackerInner() {
    const pathname = usePathname();
    const hasLogged = useRef(false);

    useEffect(() => {
        if (!pathname || pathname.startsWith("/admin")) return;

        const recordVisit = async () => {
            if (hasLogged.current) return;
            hasLogged.current = true;

            try {
                await fetch("/api/analytics", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: pathname })
                });
            } catch (e) {
                console.error("Analytics fetch failed", e);
            }
        };

        recordVisit();

        return () => {
            hasLogged.current = false;
        };
    }, [pathname]);

    return null;
}

export default function AnalyticsTracker() {
    return (
        <Suspense fallback={null}>
            <AnalyticsTrackerInner />
        </Suspense>
    );
}
