"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, ExternalLink, FolderOpen } from "lucide-react";
import styles from "./projects.module.css";

interface Project {
    slug: string;
    title: string;
    summary: string;
    technologies?: string[];
    githubUrl?: string;
    liveUrl?: string;
}

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
    const [activeFilter, setActiveFilter] = useState<string>("Tümü");

    // Tüm teknolojileri topla — tekrarsız, alfabetik
    const allTechs = useMemo(() => {
        const set = new Set<string>();
        projects.forEach((p) => p.technologies?.forEach((t) => set.add(t)));
        return ["Tümü", ...Array.from(set).sort()];
    }, [projects]);

    // Filtrelenmiş projeler
    const filtered = useMemo(() => {
        if (activeFilter === "Tümü") return projects;
        return projects.filter((p) => p.technologies?.includes(activeFilter));
    }, [projects, activeFilter]);

    // Boş durum — hiç proje yok
    if (projects.length === 0) {
        return (
            <div className={styles.grid}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <FolderOpen size={36} />
                    </div>
                    <h3 className={styles.emptyTitle}>Henüz Proje Bulunmuyor</h3>
                    <p className={styles.emptyDesc}>
                        Bu alana yakında yeni ve heyecan verici projeler eklenecektir. Lütfen daha sonra tekrar kontrol edin.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Filtre Bar — sadece teknoloji varsa göster */}
            {allTechs.length > 1 && (
                <div className={styles.filterBar}>
                    {allTechs.map((tech) => {
                        const count = tech === "Tümü"
                            ? projects.length
                            : projects.filter((p) => p.technologies?.includes(tech)).length;
                        return (
                            <button
                                key={tech}
                                className={`${styles.filterBtn} ${activeFilter === tech ? styles.active : ""}`}
                                onClick={() => setActiveFilter(tech)}
                            >
                                {tech}
                                <span className={styles.filterCount}>{count}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Sonuç sayısı */}
            <p className={styles.resultsCount}>
                {activeFilter === "Tümü"
                    ? `${projects.length} proje`
                    : `${filtered.length} / ${projects.length} proje`}
            </p>

            {/* Grid */}
            <div className={styles.grid}>
                {filtered.length === 0 ? (
                    <div className={styles.noResults}>
                        <p>"{activeFilter}" teknolojisiyle etiketlenmiş proje bulunamadı.</p>
                        <button className={styles.clearBtn} onClick={() => setActiveFilter("Tümü")}>
                            Filtreyi Temizle
                        </button>
                    </div>
                ) : (
                    filtered.map((project) => (
                        <motion.article
                            key={project.slug}
                            className={styles.card}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={styles.cardGlow} />
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>{project.title}</h2>
                                    <div className={styles.cardIcons}>
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} title="GitHub">
                                                <Github size={16} />
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} title="Canlı Demo">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <p className={styles.cardSummary}>{project.summary}</p>
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className={styles.tagRow}>
                                        {project.technologies.map((tag) => (
                                            <button
                                                key={tag}
                                                className={styles.tag}
                                                onClick={() => setActiveFilter(tag)}
                                                title={`"${tag}" ile filtrele`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.cardFooter}>
                                <Link href={`/projects/${project.slug}`} className={styles.detailsLink}>
                                    Detaylar <ArrowRight size={14} />
                                </Link>
                            </div>
                        </motion.article>
                    ))
                )}
            </div>
        </>
    );
}
