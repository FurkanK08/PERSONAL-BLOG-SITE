import Link from "next/link";
import { getPosts } from "@/lib/mdx";
import styles from "../blog/page.module.css";
import { ArrowRight, Github, ExternalLink } from "lucide-react";

export const metadata = {
    title: "Projeler - Furkan K.",
    description: "Geliştirdiğim projeler ve yetkinliklerim.",
};

export default function ProjectsPage() {
    const projects = getPosts("projects");

    return (
        <div className={`container ${styles.pageContainer}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>Öne Çıkan Projeler.</h1>
                <p className={styles.subtitle}>
                    Araştırdığım, geliştirdiğim ve açık kaynağa sunduğum bazı ürünler ve
                    çalışmalar.
                </p>
            </div>

            <div className={styles.grid}>
                {projects.map((project) => (
                    <article key={project.slug} className={styles.card}>
                        <div className={styles.cardContent}>

                            <h2 className={styles.cardTitle}>{project.title}</h2>
                            <p className={styles.cardSummary}>{project.summary}</p>

                            {project.tags && (
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                    {project.tags.map(tag => (
                                        <span key={tag} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-teal)' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                {project.link && (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.readMore} style={{ color: 'var(--text-primary)' }}>
                                        <ExternalLink size={16} /> Ziyaret Et
                                    </a>
                                )}
                                <Link href={`/projects/${project.slug}`} className={styles.readMore}>
                                    Detaylar <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}

                {projects.length === 0 && (
                    <p className={styles.emptyState}>Henüz proje verisi eklenmedi.</p>
                )}
            </div>
        </div>
    );
}
