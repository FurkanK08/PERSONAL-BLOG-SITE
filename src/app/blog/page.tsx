import Link from "next/link";
import connectDB from "@/lib/mongoose";
import { Post } from "@/models/Post";
import styles from "./page.module.css";
import { ArrowRight, Calendar } from "lucide-react";

export const metadata = {
    title: "Blog - Furkan K.",
    description: "Yazılım geliştirme, teknoloji ve kariyer üzerine yazılarım.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    let posts: any[] = [];
    try {
        await connectDB();
        posts = await Post.find({}).sort({ date: -1 }).lean() as any[];
    } catch (e) {
        posts = [];
    }

    return (
        <div className={`container ${styles.pageContainer}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>Yazılar ve Düşünceler.</h1>
                <p className={styles.subtitle}>
                    Yazılım geliştirme, modern mimariler ve teknik tecrübelerim üzerine
                    notlar paylaşıyorum.
                </p>
            </div>

            <div className={styles.grid}>
                {posts.map((post) => (
                    <article key={post.slug} className={styles.card}>
                        <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                            <div className={styles.cardContent}>
                                <div className={styles.meta}>
                                    <Calendar size={14} />
                                    <time dateTime={post.date?.toString()}>
                                        {new Date(post.date).toLocaleDateString("tr-TR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </time>
                                </div>
                                <h2 className={styles.cardTitle}>{post.title}</h2>
                                <p className={styles.cardSummary}>{post.summary}</p>
                                <div className={styles.readMore}>
                                    Devamını Oku <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}

                {posts.length === 0 && (
                    <p className={styles.emptyState}>Henüz yayınlanmış bir yazı bulunmuyor.</p>
                )}
            </div>
        </div>
    );
}
