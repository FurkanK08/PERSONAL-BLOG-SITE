import connectDB from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import styles from "./slug.module.css";

export const dynamic = "force-dynamic";

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

    return (
        <article className={`container ${styles.articleContainer}`}>
            <Link href="/blog" className={styles.backLink}>
                <ArrowLeft size={16} /> Blog&apos;a Dön
            </Link>

            <header className={styles.header}>
                <div className={styles.meta}>
                    <Calendar size={16} />
                    <time dateTime={(post.date as Date)?.toString()}>
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
