"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Search, FileText, Tag as TagIcon } from "lucide-react";
import styles from "./blog.module.css";
import { Post } from "@/types";

export default function BlogList({ posts }: { posts: Post[] }) {
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Hepsi");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

    const categories = useMemo(() => {
        const standardCats = ["Genel", "Yazılım", "Teknoloji", "Tasarım", "Kişisel"];
        const postCats = posts.map(p => p.category).filter(Boolean);
        const allCats = Array.from(new Set([...standardCats, ...postCats]));
        return ["Hepsi", ...allCats];
    }, [posts]);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        posts.forEach(p => p.tags?.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [posts]);

    const filtered = useMemo(() => {
        let result = posts.filter((p) => {
            const matchesQuery = !query.trim() || 
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.summary.toLowerCase().includes(query.toLowerCase()) ||
                (p.tags && p.tags.some(t => t.toLowerCase().includes(query.toLowerCase())));
            
            const matchesCategory = selectedCategory === "Hepsi" || (p.category || "Genel") === selectedCategory;
            const matchesTag = !selectedTag || (p.tags && p.tags.includes(selectedTag));
            
            return matchesQuery && matchesCategory && matchesTag;
        });

        // Sorting
        return [...result].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });
    }, [posts, query, selectedCategory, selectedTag, sortBy]);

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
            <div className={styles.controls}>
                {/* Arama kutusu */}
                <div className={styles.searchBar}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Yazılarda veya etiketlerde ara..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    {query && (
                        <button className={styles.clearSearch} onClick={() => setQuery("")}>✕</button>
                    )}
                </div>

                <div className={styles.sortOptions}>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                        className={styles.sortSelect}
                    >
                        <option value="newest">En Yeni</option>
                        <option value="oldest">En Eski</option>
                    </select>
                </div>

                {/* Kategoriler */}
                <div className={styles.categories}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.activeCategory : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Etiket Bulutu */}
                {allTags.length > 0 && (
                    <div className={styles.tagCloud}>
                        <TagIcon size={14} className={styles.tagIcon} />
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                className={`${styles.tagBtn} ${selectedTag === tag ? styles.activeTag : ""}`}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Sonuç bilgisi */}
            {(query || selectedCategory !== "Hepsi" || selectedTag) && (
                <div className={styles.activeFilters}>
                    <p className={styles.searchResult}>
                        {filtered.length} sonuç bulundu 
                        {query && <span> "{query}" için</span>}
                        {selectedCategory !== "Hepsi" && <span> <b>{selectedCategory}</b> kategorisinde</span>}
                        {selectedTag && <span> <b>#{selectedTag}</b> etiketiyle</span>}
                    </p>
                    <button className={styles.resetAll} onClick={() => {
                        setQuery("");
                        setSelectedCategory("Hepsi");
                        setSelectedTag(null);
                    }}>Tümünü Temizle</button>
                </div>
            )}

            <div className={styles.grid}>
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <motion.div 
                            key="no-results"
                            className={styles.noResults}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <p>Sonuç bulunamadı.</p>
                            <button className={styles.clearBtn} onClick={() => { setQuery(""); setSelectedCategory("Hepsi"); }}>
                                Tümünü Göster
                            </button>
                        </motion.div>
                    ) : (
                        filtered.map((post) => (
                            <motion.article
                                key={post.slug}
                                className={styles.card}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardTop}>
                                            <span className={styles.cardCategory}>{post.category || "Genel"}</span>
                                            <div className={styles.meta}>
                                                <Calendar size={14} />
                                                <time dateTime={post.date}>
                                                    {new Date(post.date).toLocaleDateString("tr-TR", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </time>
                                            </div>
                                        </div>
                                        <h2 className={styles.cardTitle}>{post.title}</h2>
                                        <p className={styles.cardSummary}>{post.summary}</p>
                                        
                                        {post.tags && post.tags.length > 0 && (
                                            <div className={styles.cardTags}>
                                                {post.tags.slice(0, 3).map(tag => (
                                                    <span 
                                                        key={tag} 
                                                        className={`${styles.cardTag} ${selectedTag === tag ? styles.selectedCardTag : ""}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setSelectedTag(selectedTag === tag ? null : tag);
                                                        }}
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {post.tags.length > 3 && <span className={styles.moreTags}>+{post.tags.length - 3}</span>}
                                            </div>
                                        )}

                                        <div className={styles.readMore}>
                                            Devamını Oku <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
