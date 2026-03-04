"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(true);

    const springConfig = { damping: 25, stiffness: 200 };
    const dotX = useSpring(0, springConfig);
    const dotY = useSpring(0, springConfig);
    const ringX = useSpring(0, { damping: 30, stiffness: 150 });
    const ringY = useSpring(0, { damping: 30, stiffness: 150 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            dotX.set(e.clientX);
            dotY.set(e.clientY);
            ringX.set(e.clientX);
            ringY.set(e.clientY);

            if (isHidden) setIsHidden(false);

            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === "pointer" ||
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") !== null ||
                target.closest("button") !== null
            );
        };

        const handleMouseLeave = () => setIsHidden(true);
        const handleMouseEnter = () => setIsHidden(false);

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [dotX, dotY, ringX, ringY, isHidden]);

    if (typeof window === "undefined") return null;

    return (
        <>
            <motion.div
                className={styles.dot}
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isHidden ? 0 : 1,
                }}
            />
            <motion.div
                className={styles.ring}
                animate={{
                    scale: isPointer ? 1.5 : 1,
                    borderColor: isPointer ? "var(--accent-teal)" : "rgba(6, 182, 212, 0.3)",
                }}
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isHidden ? 0 : 1,
                }}
            />
        </>
    );
}
