"use client";

import { motion, Variants } from "framer-motion";
import styles from "./Hero.module.css";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } as const },
    };

    return (
        <section className={styles.heroSection}>
            <div className={styles.backgroundGlow} />

            <motion.div
                className={`container ${styles.heroContainer}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className={styles.badge}>
                    <Terminal size={16} className={styles.badgeIcon} />
                    <span>Sistemi ve Kodları İnşa Eden Güç</span>
                </motion.div>

                <motion.h1 variants={itemVariants} className={styles.headline}>
                    Modern Web Uygulamaları İnşa Eden <br />
                    <span className={styles.highlight}>Full-Stack Geliştirici.</span>
                </motion.h1>

                <motion.p variants={itemVariants} className={styles.subHeadline}>
                    Karmaşık problemleri, ölçeklenebilir mimariler ve kullanıcı odaklı
                    arayüzlerle çözüyorum. Fikirden canlıya, dijital ürünler geliştiriyorum.
                </motion.p>

                <motion.div variants={itemVariants} className={styles.ctaGroup}>
                    <Link href="/projects" className={styles.primaryCta}>
                        Projelerimi İncele
                        <ArrowRight size={20} className={styles.arrowIcon} />
                    </Link>
                    <a href="mailto:furkan.k08@example.com" className={styles.secondaryCta}>
                        Benimle İletişime Geç
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}
