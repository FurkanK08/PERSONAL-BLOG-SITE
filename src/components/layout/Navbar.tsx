"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import styles from "./Navbar.module.css";

const navLinks = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Projeler", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Hakkımda", href: "/about" },
    { name: "İletişim", href: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <motion.header
            className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <nav className={`container ${styles.nav}`}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoBracket}>{"<"}</span>
                    <span className={styles.logoText}>Furkan K.</span>
                    <span className={styles.logoBracket}>{"/>"}</span>
                </Link>
                <ul className={styles.navLinks}>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.href} className={styles.navItem}>
                                <Link
                                    href={link.href}
                                    className={`${styles.link} ${isActive ? styles.active : ""}`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className={styles.activePill}
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                    {mounted && (
                        <li className={styles.navItem} style={{ display: 'flex', alignItems: 'center', marginLeft: '0.2rem' }}>
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className={styles.themeToggle}
                                aria-label="Temayı Değiştir"
                            >
                                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </motion.header>
    );
}
