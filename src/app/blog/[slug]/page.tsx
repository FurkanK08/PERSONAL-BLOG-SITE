import connectDB from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import styles from "./slug.module.css";
import { Metadata } from "next";
import Comments from "./Comments";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await connectDB();
    const post = await Post.findOne({ slug }).lean();

    if (!post) return { title: "Yazı Bulunamadı" };

    return {
        title: `${post.title} | Furkan Keleş Blog`,
        description: post.summary,
        openGraph: {
            title: post.title,
            description: post.summary,
            images: post.imageUrl ? [post.imageUrl] : [],
        }
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    let post: any = null;
    try {
        await connectDB();
        post = await Post.findOne({ slug }).lean();
    } catch (e) {
        return notFound();
    }

    if (!post) {
        return notFound();
    }

    // Okuma süresi hesapla (ortalama 200 kelime/dk)
    const wordCount = post.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
        <article className={`container ${styles.articleContainer}`}>
            <Link href="/blog" className={styles.backLink}>
                <ArrowLeft size={16} /> Blog&apos;a Dön
            </Link>

            {post.imageUrl && (
                <div className={styles.heroImageWrapper} style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '2rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
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
                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <Calendar size={14} />
                        <time dateTime={(post.date as Date)?.toString()}>
                            {new Date(post.date).toLocaleDateString("tr-TR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </time>
                    </div>
                    <div className={styles.metaItem}>
                        <Clock size={14} />
                        <span>{readingTime} dk okuma</span>
                    </div>
                </div>
                <h1 className={styles.title}>{post.title}</h1>
                {post.summary && <p className={styles.summary}>{post.summary}</p>}

                {post.externalUrl && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <a
                            href={post.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.projectLinkBtnSec}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            Bu yazıyı orijinal kaynağında oku ↗
                        </a>
                    </div>
                )}
            </header>


            <div className={styles.mdxContent}>
                {/* @ts-ignore */}
                <MDXRemote source={post.content} />
            </div>

            <Comments postSlug={post.slug} />
        </article>
    );
}
