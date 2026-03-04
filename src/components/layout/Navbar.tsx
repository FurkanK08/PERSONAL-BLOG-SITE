"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./Navbar.module.css";

const navLinks = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Projeler", href: "/projects" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
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
        </ul>
      </nav>
    </header>
  );
}
