"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";

interface Post { _id: string; title: string; slug: string; date: string; }
interface Project { _id: string; title: string; slug: string; date: string; }

export default function AdminDashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [visitors, setVisitors] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<"blog" | "projects">("blog");
    const [loading, setLoading] = useState(true);
    const [confirmSlug, setConfirmSlug] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [postsRes, projectsRes, visitorsRes] = await Promise.all([
                fetch("/api/posts"),
                fetch("/api/projects"),
                fetch("/api/analytics"),
            ]);
            const postsData = await postsRes.json();
            const projectsData = await projectsRes.json();
            const visitorsData = await visitorsRes.json();

            setPosts(Array.isArray(postsData) ? postsData : []);
            setProjects(Array.isArray(projectsData) ? projectsData : []);
            setVisitors(visitorsData.total || 0);
            setLoading(false);
        }
        fetchData();
    }, []);

    async function handleDeletePost(slug: string) {
        const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
        if (res.ok) {
            setPosts(posts.filter((p) => p.slug !== slug));
            setConfirmSlug(null);
        }
    }

    async function handleDeleteProject(slug: string) {
        const res = await fetch(`/api/projects/${slug}`, { method: "DELETE" });
        if (res.ok) {
            setProjects(projects.filter((p) => p.slug !== slug));
            setConfirmSlug(null);
        }
    }

    // Inline onay butonlarını render eden yardımcı
    function DeleteConfirm({ slug, onConfirm }: { slug: string; onConfirm: () => void }) {
        if (confirmSlug === slug) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emin misiniz?</span>
                    <button onClick={onConfirm} className={styles.deleteBtn} style={{ background: '#ef4444', color: 'white' }}>
                        Evet, Sil
                    </button>
                    <button onClick={() => setConfirmSlug(null)} className={styles.editBtn}>
                        İptal
                    </button>
                </div>
            );
        }
        return (
            <button onClick={() => setConfirmSlug(slug)} className={styles.deleteBtn}>
                Sil
            </button>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.heading}>İçerik Yönetimi</h1>
                    <p className={styles.sub}>Tüm yazı ve projeleri buradan yönetebilirsiniz.</p>
                </div>
                <div className={styles.newBtns}>
                    <Link href="/admin/editor?type=post" className={styles.addBtn}>
                        ✍️ Yeni Yazı
                    </Link>
                    <Link href="/admin/editor?type=project" className={styles.addBtnProject}>
                        🚀 Yeni Proje
                    </Link>
                </div>
            </div>

            {/* Özet Kartları */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>✍️</span>
                    <div>
                        <p className={styles.statNum}>{posts.length}</p>
                        <p className={styles.statLabel}>Blog Yazısı</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>🚀</span>
                    <div>
                        <p className={styles.statNum}>{projects.length}</p>
                        <p className={styles.statLabel}>Proje</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>👁️</span>
                    <div>
                        <p className={styles.statNum}>{visitors}</p>
                        <p className={styles.statLabel}>Toplam Ziyaret (Sayfa/Tık)</p>
                    </div>
                </div>
            </div>

            {/* Sekmeler */}
            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === "blog" ? styles.activeTab : ""}`} onClick={() => setActiveTab("blog")}>
                    Blog Yazıları
                </button>
                <button className={`${styles.tab} ${activeTab === "projects" ? styles.activeTab : ""}`} onClick={() => setActiveTab("projects")}>
                    Projeler
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>Yükleniyor...</div>
            ) : activeTab === "blog" ? (
                <div className={styles.table}>
                    {posts.length === 0 ? (
                        <div className={styles.empty}>
                            <p>Henüz hiç yazı yok.</p>
                            <Link href="/admin/editor?type=post" className={styles.addBtn}>İlk Yazını Ekle</Link>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className={styles.row}>
                                <div className={styles.rowInfo}>
                                    <p className={styles.rowTitle}>{post.title}</p>
                                    <p className={styles.rowMeta}>/blog/{post.slug} · {new Date(post.date).toLocaleDateString("tr-TR")}</p>
                                </div>
                                <div className={styles.rowActions}>
                                    <Link href={`/admin/editor?type=post&slug=${post.slug}`} className={styles.editBtn}>Düzenle</Link>
                                    <DeleteConfirm slug={post.slug} onConfirm={() => handleDeletePost(post.slug)} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className={styles.table}>
                    {projects.length === 0 ? (
                        <div className={styles.empty}>
                            <p>Henüz hiç proje yok.</p>
                            <Link href="/admin/editor?type=project" className={styles.addBtnProject}>İlk Projeyi Ekle</Link>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project._id} className={styles.row}>
                                <div className={styles.rowInfo}>
                                    <p className={styles.rowTitle}>{project.title}</p>
                                    <p className={styles.rowMeta}>/projects/{project.slug} · {new Date(project.date).toLocaleDateString("tr-TR")}</p>
                                </div>
                                <div className={styles.rowActions}>
                                    <Link href={`/admin/editor?type=project&slug=${project.slug}`} className={styles.editBtn}>Düzenle</Link>
                                    <DeleteConfirm slug={project.slug} onConfirm={() => handleDeleteProject(project.slug)} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

