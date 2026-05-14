import { BlogCardSkeleton } from "@/components/ui/Skeleton";
import styles from "../blog/blog.module.css";

export default function Loading() {
    return (
        <div className={styles.pageContainer}>
            <div className="container">
                <div className={styles.header}>
                    <div style={{ height: '3rem', width: '60%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }} className="animate-pulse" />
                    <div style={{ height: '1.5rem', width: '80%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} className="animate-pulse" />
                </div>
                <div className={styles.grid}>
                    {[...Array(6)].map((_, i) => (
                        <BlogCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
