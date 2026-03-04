import { getPostBySlug, getPosts } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import styles from "./slug.module.css";

// Build zamanında oluşturulacak sayfaların yollarını Next.js'e bildiririz (SSG)
export async function generateStaticParams() {
    const posts = getPosts("blog");
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug("blog", slug);

    if (!post) {
        return notFound();
    }

    return (
        <article className={`container ${styles.articleContainer}`}>
            <Link href="/blog" className={styles.backLink}>
                <ArrowLeft size={16} /> Blog'a Dön
            </Link>

            <header className={styles.header}>
                <div className={styles.meta}>
                    <Calendar size={16} />
                    <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </time>
                </div>
                <h1 className={styles.title}>{post.title}</h1>
                {post.summary && <p className={styles.summary}>{post.summary}</p>}
            </header>

            <div className={styles.mdxContent}>
                {/* @ts-ignore */}
                <MDXRemote source={post.content} />
            </div>
        </article>
    );
}
