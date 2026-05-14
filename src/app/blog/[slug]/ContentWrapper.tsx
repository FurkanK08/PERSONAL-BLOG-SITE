"use client";

import { useState, useRef, useEffect } from "react";
import Lightbox from "@/components/ui/Lightbox";
import styles from "./slug.module.css";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        const imgs = Array.from(contentRef.current.querySelectorAll("img"));
        const sources = imgs.map(img => img.src);
        setImages(sources);

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "IMG") {
                const src = (target as HTMLImageElement).src;
                const index = sources.indexOf(src);
                if (index !== -1) {
                    setInitialIndex(index);
                    setLightboxOpen(true);
                }
            }
        };

        contentRef.current.addEventListener("click", handleClick);
        return () => contentRef.current?.removeEventListener("click", handleClick);
    }, [children]);

    return (
        <div ref={contentRef} className={styles.mdxContentWrapper}>
            {children}
            <Lightbox 
                images={images} 
                isOpen={lightboxOpen} 
                initialIndex={initialIndex} 
                onClose={() => setLightboxOpen(false)} 
            />
        </div>
    );
}
