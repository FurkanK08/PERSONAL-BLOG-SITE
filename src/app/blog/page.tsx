import connectDB from "@/lib/mongoose";
import { Post as PostModel } from "@/models/Post";
import styles from "./blog.module.css";
import BlogList from "./BlogList";
import { Post } from "@/types";

export const metadata = {
    title: "Blog — Furkan K.",
    description: "Yazılım geliştirme, modern mimariler ve teknik tecrübelerim üzerine notlar.",
};

export const revalidate = 3600;

export default async function BlogPage() {
    let posts: Post[] = [];
    try {
        await connectDB();
        const data = await PostModel.find({}).sort({ date: -1 }).lean();
        posts = JSON.parse(JSON.stringify(data));
    } catch (e) {
        console.error("Blog list fetch error:", e);
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
