"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const hasLogged = useRef(false); // Sadece bir kere istek atsın

    useEffect(() => {
        // Localhostta (geliştirme ortamında) sayacı artırmasını önlemek için (isteğe bağlı yoruma alınabilir)
        // if (process.env.NODE_ENV === "development") return;

        // Admin sayfalarında istatistik turmamıza gerek yok
        if (pathname && pathname.startsWith("/admin")) return;

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
                console.error("Analytics fetch failed");
            }
        };

        recordVisit();

        return () => {
            hasLogged.current = false;
        };
    }, [pathname]);

    return null;
}
