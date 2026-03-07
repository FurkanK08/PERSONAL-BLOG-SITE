import connectDB from "@/lib/mongoose";
import { SiteProfile } from "@/models/SiteProfile";
import Link from "next/link";
import { Terminal, Code2, Zap, Globe, BookOpen, ArrowRight } from "lucide-react";
import styles from "./about.module.css";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
    interface IProfile {
        name: string; title: string; bio: string; email: string;
        githubUrl: string; linkedinUrl: string; skills: string[];
        avatarEmoji: string; avatarUrl: string; timeline?: any[];
    }

    let profile: IProfile = {
        name: "Furkan K.", title: "Full-Stack Geliştirici", bio: "", email: "",
        githubUrl: "", linkedinUrl: "", skills: [], avatarEmoji: "👨‍💻", avatarUrl: "",
    };
    try {
        await connectDB();
        const data = await SiteProfile.findOne({}).lean();
        if (data) {
            profile = JSON.parse(JSON.stringify(data));
            // Türkçe karakter kontrolü: bozuk kaydedilmişse düzelt
            const hasTurkish = (s: string) => /[çğıöşüÇĞİÖŞÜ]/.test(s);
            const fixedBio = "Karmaşık problemleri, ölçeklenebilir mimariler ve kullanıcı odaklı arayüzlerle çözüyorum. Fikirden canlıya, dijital ürünler geliştiriyorum.";
            if (profile.bio && !hasTurkish(profile.bio)) profile.bio = fixedBio;
        }
    } catch { }

    const defaultTimeline = [
        { year: "2022", title: "Web'e İlk Adım", desc: "HTML, CSS ve JavaScript öğrenerek ilk projelerimi oluşturdum.", icon: <Globe size={20} /> },
        { year: "2023", title: "React & Next.js", desc: "Modern frontend framework'lerine geçiş yaparak portföy projeleri geliştirdim.", icon: <Code2 size={20} /> },
        { year: "2024", title: "Full-Stack Geliştirme", desc: "Node.js, MongoDB ve REST API tasarımıyla backend geliştirmeye başladım.", icon: <Zap size={20} /> },
        { year: "2025", title: "Profesyonel Projeler", desc: "Gerçek dünya projelerinde çalışarak uzmanlık alanlarımı genişlettim.", icon: <Terminal size={20} /> },
        { year: "2026", title: "Sürekli Gelişim", desc: "TypeScript, Cloud servisleri ve modern web teknolojileri üzerine çalışmaya devam ediyorum.", icon: <BookOpen size={20} /> },
    ];

    const timeline = profile.timeline && profile.timeline.length > 0
        ? profile.timeline.map((t: { year: string; title: string; desc: string }) => ({ ...t, icon: <Zap size={20} /> }))
        : defaultTimeline;

    return (
        <main className={styles.page}>
            <div className={`container ${styles.inner}`}>

                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.avatarWrap}>
                        {profile.avatarUrl
                            ? <img src={profile.avatarUrl} alt={profile.name} className={styles.avatar} />
                            : <div className={styles.avatarEmoji}>{profile.avatarEmoji}</div>
                        }
                    </div>
                    <div className={styles.heroText}>
                        <p className={styles.greeting}>Merhaba, ben</p>
                        <h1 className={styles.name}>{profile.name}</h1>
                        <p className={styles.role}>{profile.title}</p>
                        <p className={styles.bio}>{profile.bio || "Karmaşık problemleri, ölçeklenebilir mimariler ve kullanıcı odaklı arayüzlerle çözüyorum. Fikirden canlıya, dijital ürünler geliştiriyorum."}</p>
                        <div className={styles.ctaRow}>
                            <Link href="/contact" className={styles.primaryBtn}>
                                İletişime Geç <ArrowRight size={16} />
                            </Link>
                            <Link href="/projects" className={styles.secondaryBtn}>
                                Projelerimi Gör
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Teknoloji Stack&apos;im</h2>
                        <div className={styles.skillGrid}>
                            {profile.skills.map((skill: string) => (
                                <div key={skill} className={styles.skillCard}>
                                    <span className={styles.skillName}>{skill}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Timeline */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Yolculuğum</h2>
                    <div className={styles.timeline}>
                        {timeline.map((item, i) => (
                            <div key={i} className={styles.timelineItem}>
                                <div className={styles.timelineLeft}>
                                    <span className={styles.timelineYear}>{item.year}</span>
                                </div>
                                <div className={styles.timelineDot}>
                                    <div className={styles.dot}>{item.icon}</div>
                                    {i < timeline.length - 1 && <div className={styles.line} />}
                                </div>
                                <div className={styles.timelineRight}>
                                    <h3 className={styles.timelineTitle}>{item.title}</h3>
                                    <p className={styles.timelineDesc}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className={styles.ctaSection}>
                    <h2 className={styles.ctaTitle}>Birlikte çalışalım mı?</h2>
                    <p className={styles.ctaSub}>Projende yardımcı olmaktan mutluluk duyarım.</p>
                    <Link href="/contact" className={styles.primaryBtn}>
                        Mesaj Gönder <ArrowRight size={16} />
                    </Link>
                </section>
            </div>
        </main>
    );
}
