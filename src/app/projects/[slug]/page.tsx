import connectDB from "@/lib/mongoose";
import { Project } from "@/models/Project";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import styles from "../../blog/[slug]/slug.module.css";
import Image from "next/image";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await connectDB();
    const project = await Project.findOne({ slug }).lean();

    if (!project) return { title: "Proje Bulunamadı" };

    return {
        title: `${project.title} | Furkan Keleş Projeleri`,
        description: project.summary,
        openGraph: {
            title: project.title,
            description: project.summary,
            images: project.imageUrl ? [project.imageUrl] : [],
        }
    };
}

export default async function ProjectPost({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    let project: any = null;
    try {
        await connectDB();
        project = await Project.findOne({ slug }).lean();
    } catch (e) {
        return notFound();
    }

    if (!project) {
        return notFound();
    }

    return (
        <article className={`container ${styles.articleContainer}`}>
            <Link href="/projects" className={styles.backLink}>
                <ArrowLeft size={16} /> Projelere Dön
            </Link>

            {project.imageUrl && (
                <div className={styles.heroImageWrapper} style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '2rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
            )}

            <header className={styles.header}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 className={styles.title}>{project.title}</h1>

                        {project.technologies && project.technologies.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', marginTop: "0.5rem" }}>
                                {project.technologies.map((tag: string) => (
                                    <span key={tag} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", color: "var(--text-primary)", padding: "0.65rem 1.1rem", borderRadius: "var(--radius-md)", fontWeight: 600, textDecoration: "none" }}>
                                <Github size={16} /> GitHub
                            </a>
                        )}
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "var(--accent-teal)", color: "#000", padding: "0.65rem 1.1rem", borderRadius: "var(--radius-md)", fontWeight: 600, textDecoration: "none" }}>
                                <ExternalLink size={16} /> Projeyi Ziyaret Et
                            </a>
                        )}
                    </div>
                </div>

                {project.summary && <p className={styles.summary} style={{ marginTop: "1.5rem" }}>{project.summary}</p>}
            </header>

            <div className={styles.mdxContent}>
                {/* @ts-ignore */}
                <MDXRemote source={project.content} />
            </div>
        </article>
    );
}
