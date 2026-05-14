import styles from "./skeleton.module.css";

export function Skeleton({ className }: { className?: string }) {
    return <div className={`${styles.skeleton} ${className}`} />;
}

export function BlogCardSkeleton() {
    return (
        <div className={styles.card}>
            <Skeleton className={styles.meta} />
            <Skeleton className={styles.title} />
            <Skeleton className={styles.summary} />
            <Skeleton className={styles.readMore} />
        </div>
    );
}

export function ProjectCardSkeleton() {
    return (
        <div className={styles.card}>
            <Skeleton className={styles.image} />
            <Skeleton className={styles.title} />
            <Skeleton className={styles.summary} />
            <Skeleton className={styles.tags} />
        </div>
    );
}
