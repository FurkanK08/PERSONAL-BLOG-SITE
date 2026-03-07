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
                <div className={styles.projectHeroImageWrapper}>
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                        quality={85}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            )}

            <header className={styles.header}>
                <div className={styles.projectHeaderRow}>
                    <div>
                        <h1 className={styles.title}>{project.title}</h1>

                        {project.technologies && project.technologies.length > 0 && (
                            <div className={styles.techTagsRow}>
                                {project.technologies.map((tag: string) => (
                                    <span key={tag} className={styles.techTag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.projectLinksRow}>
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLinkBtnSec}>
                                <Github size={16} /> GitHub
                            </a>
                        )}
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLinkBtnPri}>
                                <ExternalLink size={16} /> Projeyi Ziyaret Et
                            </a>
                        )}
                    </div>
                </div>

                {project.summary && <p className={`${styles.summary} ${styles.projectSummary}`}>{project.summary}</p>}
            </header>

            <div className={styles.mdxContent}>
                {/* @ts-ignore */}
                <MDXRemote source={project.content} />
            </div>
        </article>
    );
}
