"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./layout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    }

    // Login sayfasında sidebar yoktur — sadece içerik gösterilir
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className={styles.wrapper}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>⚡</span>
                    <span className={styles.logoText}>Admin Panel</span>
                </div>
                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={styles.navItem}>
                        📊 Dashboard
                    </Link>
                    <Link href="/admin/dashboard?tab=blog" className={styles.navItem}>
                        ✍️ Blog Yazıları
                    </Link>
                    <Link href="/admin/dashboard?tab=projects" className={styles.navItem}>
                        🚀 Projeler
                    </Link>
                    <Link href="/admin/editor?type=post" className={styles.navItem}>
                        ➕ Yeni Yazı
                    </Link>
                    <Link href="/admin/editor?type=project" className={styles.navItem}>
                        ➕ Yeni Proje
                    </Link>
                </nav>
                <div className={styles.sidebarBottom}>
                    <Link href="/" className={styles.navItem}>
                        🏠 Siteye Dön
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        🚪 Çıkış Yap
                    </button>
                </div>
            </aside>
            <main className={styles.main}>{children}</main>
        </div>
    );
}
