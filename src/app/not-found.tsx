import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";
import styles from "@/components/layout/home.module.css";

export default function NotFound() {
    return (
        <main className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className={`container ${styles.inner}`} style={{ textAlign: 'center', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', color: 'var(--accent-teal)' }}>
                    <Terminal size={64} />
                </div>
                <h1 className={styles.headline} style={{ marginBottom: '1rem' }}>404</h1>
                <h2 className={styles.sectionTitle} style={{ paddingLeft: 0, justifyContent: 'center' }}>Sayfa Bulunamadı</h2>
                <p className={styles.bio} style={{ margin: '1.5rem auto', textAlign: 'center' }}>
                    Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir. Lütfen URL'yi kontrol edin veya ana sayfaya dönün.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Link href="/" className={styles.primaryCta}>
                        <ArrowLeft size={18} /> Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </main>
    );
}
