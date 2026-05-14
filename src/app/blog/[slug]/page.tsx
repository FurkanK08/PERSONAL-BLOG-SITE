import connectDB from "@/lib/mongoose";
import { Post as PostModel } from "@/models/Post";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import styles from "./slug.module.css";
import { Metadata } from "next";
import Comments from "./Comments";
import { Post } from "@/types";
import JsonLd from "@/components/JsonLd";
import ContentWrapper from "./ContentWrapper";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await connectDB();
    const post = await PostModel.findOne({ slug }).lean();

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

    let post: Post | null = null;
    try {
        await connectDB();
        const data = await PostModel.findOne({ slug }).lean();
        if (data) {
            post = JSON.parse(JSON.stringify(data));
        }
    } catch (e) {
        console.error("Blog post fetch error:", e);
        return notFound();
    }

    if (!post) {
        return notFound();
    }

    // Okuma süresi hesapla (ortalama 200 kelime/dk)
    const wordCount = post.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.summary,
        "image": post.imageUrl,
        "datePublished": post.date,
        "author": {
            "@type": "Person",
            "name": "Furkan Keleş"
        }
    };

    return (
        <>
            <JsonLd data={articleSchema as any} />
            <ContentWrapper>
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
                                <time dateTime={(post.date as unknown as Date)?.toString()}>
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
                            {post.category && (
                                <div className={styles.categoryBadge}>
                                    {post.category}
                                </div>
                            )}
                        </div>
                        <h1 className={styles.title}>{post.title}</h1>
                        
                        {post.tags && post.tags.length > 0 && (
                            <div className={styles.tagRow}>
                                {post.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>#{tag}</span>
                                ))}
                            </div>
                        )}
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
                        {post.content.trim().startsWith('<') ? (
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        ) : (
                            <MDXRemote source={post.content} />
                        )}
                    </div>

                    <Comments postSlug={post.slug} />
                </article>
            </ContentWrapper>
        </>
    );
}
