import connectDB from "@/lib/mongoose";
import { Post } from "@/models/Post";
import styles from "./blog.module.css";
import BlogList from "./BlogList";

export const metadata = {
    title: "Blog — Furkan K.",
    description: "Yazılım geliştirme, modern mimariler ve teknik tecrübelerim üzerine notlar.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    let posts: any[] = [];
    try {
        await connectDB();
        posts = await Post.find({}).sort({ date: -1 }).lean() as any[];
        posts = JSON.parse(JSON.stringify(posts));
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
            <BlogList posts={posts} />
        </div>
    );
}
