"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Search, FileText } from "lucide-react";
import styles from "./blog.module.css";

interface Post {
    slug: string;
    title: string;
    summary: string;
    date: string;
}

export default function BlogList({ posts }: { posts: Post[] }) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!query.trim()) return posts;
        const q = query.toLowerCase();
        return posts.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.summary.toLowerCase().includes(q)
        );
    }, [posts, query]);

    // Boş durum — hiç yazı yok
    if (posts.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <FileText size={36} />
                </div>
                <h3 className={styles.emptyTitle}>Henüz yayınlanmış yazı yok</h3>
                <p className={styles.emptyDesc}>
                    Blog yazıları yakında buraya eklenecek. Takipte kalın!
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Arama kutusu */}
            <div className={styles.searchBar}>
                <Search size={16} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Yazılarda ara..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.searchInput}
                />
                {query && (
                    <button className={styles.clearSearch} onClick={() => setQuery("")}>✕</button>
                )}
            </div>

            {/* Sonuç bilgisi */}
            {query && (
                <p className={styles.searchResult}>
                    {filtered.length} sonuç bulundu <span>"{query}" için</span>
                </p>
            )}

            <div className={styles.grid}>
                {filtered.length === 0 ? (
                    <div className={styles.noResults}>
                        <p>"{query}" için sonuç bulunamadı.</p>
                        <button className={styles.clearBtn} onClick={() => setQuery("")}>
                            Aramayı Temizle
                        </button>
                    </div>
                ) : (
                    filtered.map((post) => (
                        <motion.article
                            key={post.slug}
                            className={styles.card}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                                <div className={styles.cardContent}>
                                    <div className={styles.meta}>
                                        <Calendar size={14} />
                                        <time dateTime={post.date}>
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
                        </motion.article>
                    ))
                )}
            </div>
        </>
    );
}
