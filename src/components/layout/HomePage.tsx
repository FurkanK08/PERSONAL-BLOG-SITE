"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
    ArrowRight, Github, Linkedin, Twitter, Mail, Download,
    Terminal, ExternalLink, ChevronDown,
} from "lucide-react";
import styles from "./home.module.css";

/* ── Types ─────────────────────────────────────────────── */
interface Profile {
    name: string; title: string; subtitle: string; bio: string;
    email: string; githubUrl: string; linkedinUrl: string;
    twitterUrl: string; cvUrl: string; skills: string[];
    titleWords: string[];
    avatarEmoji: string; avatarUrl: string;
}
interface Post { slug: string; title: string; summary: string; date: string; }
interface Project { slug: string; title: string; summary: string; technologies?: string[]; }

/* ── Typewriter ─────────────────────────────────────────── */
function Typewriter({ words, speed = 80 }: { words: string[]; speed?: number }) {
    const [idx, setIdx] = useState(0);
    const [text, setText] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const word = words[idx % words.length];
        const timeout = setTimeout(() => {
            if (!deleting) {
                setText(word.slice(0, text.length + 1));
                if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), 1800);
            } else {
                setText(word.slice(0, text.length - 1));
                if (text.length - 1 === 0) { setDeleting(false); setIdx((i) => i + 1); }
            }
        }, deleting ? speed / 2 : speed);
        return () => clearTimeout(timeout);
    }, [text, deleting, idx, words, speed]);

    return (
        <span className={styles.typewriter}>
            {text}
            <span className={styles.cursor}>|</span>
        </span>
    );
}

/* ── Scroll‑reveal wrapper ──────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px 0px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            {children}
        </motion.div>
    );
}

/* ── 3‑D card hover ─────────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const el = ref.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = ((e.clientX - left) / width - 0.5) * 16;
        const y = ((e.clientY - top) / height - 0.5) * -16;
        el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
    }
    function onMouseLeave() {
        if (ref.current) ref.current.style.transform = "";
    }

    return (
        <div ref={ref} className={className} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
            style={{ transition: "transform 0.15s ease", willChange: "transform" }}>
            {children}
        </div>
    );
}

/* ── Page component ─────────────────────────────────────── */
export default function HomePage({
    profile, posts, projects,
}: {
    profile: Profile; posts: Post[]; projects: Project[];
}) {
    const titleWords = (profile.titleWords && profile.titleWords.length > 0)
        ? profile.titleWords
        : ["Full-Stack Geliştirici", "Frontend Developer", "Backend Developer", "UI Enthusiast"];
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

    return (
        <div className={styles.page}>
            {/* ─── HERO ─── */}
            <section ref={heroRef} className={styles.hero}>
                {/* Parallax background orb */}
                <motion.div className={styles.orb} style={{ y: bgY }} />
                <motion.div className={styles.orb2} style={{ y: bgY }} />

                <div className={`container ${styles.heroInner}`}>


                    <div className={styles.heroContent}>
                        {/* Avatar */}
                        <motion.div
                            className={styles.avatarCol}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 120 }}
                        >
                            <div className={styles.avatarRing}>
                                {profile.avatarUrl
                                    ? <img src={profile.avatarUrl} alt={profile.name} className={styles.avatarImage} />
                                    : <div className={styles.avatar}>{profile.avatarEmoji}</div>
                                }
                            </div>
                            <div className={styles.socialPills}>
                                {profile.githubUrl && <SocialPill href={profile.githubUrl} icon={<Github size={18} />} label="GitHub" delay={0.5} />}
                                {profile.linkedinUrl && <SocialPill href={profile.linkedinUrl} icon={<Linkedin size={18} />} label="LinkedIn" delay={0.6} />}
                                {profile.twitterUrl && <SocialPill href={profile.twitterUrl} icon={<Twitter size={18} />} label="Twitter" delay={0.7} />}
                                {profile.email && <SocialPill href={`mailto:${profile.email}`} icon={<Mail size={18} />} label="Mail" delay={0.8} isEmail />}
                            </div>
                        </motion.div>

                        {/* Text */}
                        <div className={styles.textCol}>
                            <motion.p
                                className={styles.subtitle}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                {profile.subtitle}
                            </motion.p>

                            <motion.h1
                                className={styles.headline}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <span className={styles.highlight}>{profile.name}</span>
                                <br />
                                <Typewriter words={titleWords} />
                            </motion.h1>

                            <motion.p
                                className={styles.bio}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                {profile.bio}
                            </motion.p>

                            <motion.div
                                className={styles.ctaRow}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <Link href="/projects" className={styles.primaryCta}>
                                    Projelerimi İncele <ArrowRight size={18} />
                                </Link>
                                {profile.cvUrl ? (
                                    <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryCta}>
                                        <Download size={16} /> CV İndir
                                    </a>
                                ) : profile.email ? (
                                    <a href={`mailto:${profile.email}`} className={styles.secondaryCta}>
                                        <Mail size={16} /> İletişime Geç
                                    </a>
                                ) : null}
                            </motion.div>
                        </div>
                    </div>

                    {/* Skills */}
                    {profile.skills && profile.skills.length > 0 && (
                        <motion.div
                            className={styles.skillsRow}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            {profile.skills.map((skill, i) => (
                                <motion.span
                                    key={skill}
                                    className={styles.skill}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </motion.div>
                    )}

                    {/* Scroll cue */}
                    <motion.div
                        className={styles.scrollCue}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown size={22} />
                    </motion.div>
                </div>
            </section>

            {/* ─── FEATURED PROJECTS ─── */}
            <section className={styles.section}>
                <div className="container">
                    <Reveal>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>Öne Çıkan Projeler</h2>
                            <Link href="/projects" className={styles.seeAll}>Tümünü Gör <ArrowRight size={14} /></Link>
                        </div>
                    </Reveal>
                    {projects.length > 0 ? (
                        <div className={styles.projectGrid}>
                            {projects.map((project, i) => (
                                <Reveal key={project.slug} delay={i * 0.12}>
                                    <TiltCard className={styles.projectCard}>
                                        <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                                            <div className={styles.cardTop}>
                                                <h3 className={styles.cardTitle}>{project.title}</h3>
                                                <ExternalLink size={16} className={styles.cardIcon} />
                                            </div>
                                            <p className={styles.cardDesc}>{project.summary}</p>
                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className={styles.tagRow}>
                                                    {project.technologies.slice(0, 4).map((t) => (
                                                        <span key={t} className={styles.tag}>{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className={styles.cardGlow} />
                                        </Link>
                                    </TiltCard>
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <Reveal delay={0.1}>
                            <div className={styles.emptyState}>
                                <ExternalLink size={36} />
                                <p>Projeler yakında eklenecek. <Link href="/projects">Projeler sayfasına git →</Link></p>
                            </div>
                        </Reveal>
                    )}
                </div>
            </section>

            {/* ─── LATEST POSTS ─── */}
            <section className={styles.section}>
                <div className="container">
                    <Reveal>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>Son Yazılar</h2>
                            <Link href="/blog" className={styles.seeAll}>Tümünü Gör <ArrowRight size={14} /></Link>
                        </div>
                    </Reveal>
                    {posts.length > 0 ? (
                        <div className={styles.postList}>
                            {posts.map((post, i) => (
                                <Reveal key={post.slug} delay={i * 0.1}>
                                    <Link href={`/blog/${post.slug}`} className={styles.postRow}>
                                        <div>
                                            <h3 className={styles.postTitle}>{post.title}</h3>
                                            <p className={styles.postDesc}>{post.summary}</p>
                                        </div>
                                        <div className={styles.postMeta}>
                                            <time>{new Date(post.date).toLocaleDateString("tr-TR", { year: "numeric", month: "short", day: "numeric" })}</time>
                                            <ArrowRight size={16} />
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <Reveal delay={0.1}>
                            <div className={styles.emptyState}>
                                <Terminal size={36} />
                                <p>Blog yazıları yakında gelecek. <Link href="/blog">Blog sayfasına git →</Link></p>
                            </div>
                        </Reveal>
                    )}
                </div>
            </section>

            {/* ─── CONTACT CTA ─── */}
            <Reveal>
                <section className={styles.contactSection}>
                    <div className="container">
                        <div className={styles.contactBox}>
                            <motion.h2
                                className={styles.contactTitle}
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 30 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                Birlikte bir şeyler inşa edelim.
                            </motion.h2>
                            <p className={styles.contactSub}>Proje fikrin mi var? Bir konuyu tartışmak mı istiyorsun? Ulaş.</p>
                            <div className={styles.contactBtns}>
                                {profile.email && (
                                    <a href={`mailto:${profile.email}`} className={styles.primaryCta}>
                                        <Mail size={18} /> E-Posta Gönder
                                    </a>
                                )}
                                {profile.githubUrl && (
                                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryCta}>
                                        <Github size={18} /> GitHub&apos;ı Ziyaret Et
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* ─── FOOTER ─── */}
            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerInner}>
                        <Link href="/" className={styles.footerLogo}>
                            <span className={styles.logoBracket}>{"<"}</span>
                            <span>Furkan K.</span>
                            <span className={styles.logoBracket}>{"/>"}</span>
                        </Link>
                        <p className={styles.footerCopy}>© {new Date().getFullYear()} Furkan K. Tüm hakları saklıdır.</p>
                        <div className={styles.footerLinks}>
                            {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"  ><Github size={18} /></a>}
                            {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>}
                            {profile.twitterUrl && <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" ><Twitter size={18} /></a>}
                            {profile.email && <a href={`mailto:${profile.email}`} aria-label="Mail"><Mail size={18} /></a>}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

/* ── Social Pill ────────────────────────────────────────── */
function SocialPill({
    href, icon, label, delay, isEmail = false,
}: { href: string; icon: React.ReactNode; label: string; delay: number; isEmail?: boolean }) {
    return (
        <motion.a
            href={href}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noopener noreferrer"}
            aria-label={label}
            className={styles.socialPill}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.15, rotate: 5 }}
        >
            {icon}
        </motion.a>
    );
}
