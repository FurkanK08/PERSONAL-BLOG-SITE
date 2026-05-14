import { ProjectCardSkeleton } from "@/components/ui/Skeleton";
import styles from "../projects/projects.module.css";

export default function Loading() {
    return (
        <div className={styles.pageContainer}>
            <div className="container">
                <div className={styles.header}>
                    <div style={{ height: '3rem', width: '60%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }} />
                    <div style={{ height: '1.5rem', width: '80%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
                </div>
                <div className={styles.grid}>
                    {[...Array(4)].map((_, i) => (
                        <ProjectCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
