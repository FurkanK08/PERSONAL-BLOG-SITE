"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./layout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!isLoginPage) {
            fetch("/api/messages/unread")
                .then(res => res.json())
                .then(data => {
                    if (data.count !== undefined) {
                        setUnreadCount(data.count);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [pathname, isLoginPage]);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    }

    // Login sayfasında sidebar yoktur — sadece içerik gösterilir
    if (isLoginPage) {
        return <>{children}</>;
    }

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={styles.wrapper}>
            {/* Mobil Toggle Header */}
            <div className={styles.mobileHeader}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>⚡</span>
                    <span className={styles.logoText}>Admin Panel</span>
                </div>
                <button
                    className={styles.hamburgerBtn}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <div className={`${styles.hamburgerLine} ${sidebarOpen ? styles.line1Open : ""}`}></div>
                    <div className={`${styles.hamburgerLine} ${sidebarOpen ? styles.line2Open : ""}`}></div>
                    <div className={`${styles.hamburgerLine} ${sidebarOpen ? styles.line3Open : ""}`}></div>
                </button>
            </div>

            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>⚡</span>
                    <span className={styles.logoText}>Admin Panel</span>
                </div>
                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={styles.navItem}>
                        📊 Dashboard
                    </Link>
                    <Link href="/admin/profile" className={styles.navItem}>
                        👤 Profil & Hakkımda
                    </Link>
                    <Link href="/admin/messages" className={styles.navItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>📬 Mesajlar</span>
                        {unreadCount > 0 && (
                            <span style={{ background: '#ef4444', color: 'white', fontSize: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontWeight: 'bold' }}>
                                {unreadCount}
                            </span>
                        )}
                    </Link>
                    <Link href="/admin/comments" className={styles.navItem}>
                        💬 Yorumlar
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
