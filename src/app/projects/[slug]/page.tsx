import { getPostBySlug, getPosts } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import styles from "../../blog/[slug]/slug.module.css";

// Build zamanında sayfa rotalarını (SSG) belirle
export async function generateStaticParams() {
    const projects = getPosts("projects");
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = getPostBySlug("projects", slug);

    if (!project) {
        return notFound();
    }

    return (
        <article className={`container ${styles.articleContainer}`}>
            <Link href="/projects" className={styles.backLink}>
                <ArrowLeft size={16} /> Projelere Dön
            </Link>

            <header className={styles.header}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 className={styles.title}>{project.title}</h1>

                        {project.tags && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', marginTop: "0.5rem" }}>
                                {project.tags.map(tag => (
                                    <span key={tag} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                backgroundColor: "var(--accent-teal)", color: "#000",
                                padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", fontWeight: 600
                            }}
                        >
                            <ExternalLink size={18} /> Projeyi Ziyaret Et
                        </a>
                    )}
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
