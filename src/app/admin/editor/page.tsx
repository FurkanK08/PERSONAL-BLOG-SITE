"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./editor.module.css";
import ImageGallery from "@/components/admin/ImageGallery";

function EditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || "post"; // 'post' | 'project'
    const editSlug = searchParams.get("slug"); // Düzenleme modunda slug gelir
    const isEdit = !!editSlug;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [galleryOpen, setGalleryOpen] = useState(false);

    const [form, setForm] = useState({
        title: "",
        slug: "",
        summary: "",
        content: "",
        technologies: "",
        githubUrl: "",
        liveUrl: "",
        imageUrl: "",
        date: new Date().toISOString().split("T")[0],
    });

    // Düzenleme modunda mevcut veriyi çek
    useEffect(() => {
        if (isEdit && editSlug) {
            setFetching(true);
            const endpoint = type === "post" ? `/api/posts/${editSlug}` : `/api/projects/${editSlug}`;
            fetch(endpoint)
                .then((r) => r.json())
                .then((data) => {
                    if (data) {
                        setForm({
                            title: data.title || "",
                            slug: data.slug || "",
                            summary: data.summary || "",
                            content: data.content || "",
                            technologies: (data.technologies || []).join(", "),
                            githubUrl: data.githubUrl || "",
                            liveUrl: data.liveUrl || "",
                            imageUrl: data.imageUrl || "",
                            date: data.date ? data.date.split("T")[0] : new Date().toISOString().split("T")[0],
                        });
                    }
                })
                .finally(() => setFetching(false));
        }
    }, [isEdit, editSlug, type]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Title'dan otomatik slug üret (yalnızca yeni içerikte)
        if (name === "title" && !isEdit) {
            const slug = value
                .toLowerCase()
                .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
                .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim().replace(/\s+/g, "-");
            setForm((prev) => ({ ...prev, slug }));
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                setForm((p) => ({ ...p, imageUrl: data.url }));
            } else {
                setError("Yükleme başarısız oldu.");
            }
        } catch {
            setError("Görsel yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const endpoint = type === "post"
            ? isEdit ? `/api/posts/${editSlug}` : "/api/posts"
            : isEdit ? `/api/projects/${editSlug}` : "/api/projects";

        const method = isEdit ? "PUT" : "POST";

        const body = type === "post"
            ? { title: form.title, slug: form.slug, summary: form.summary, content: form.content, date: form.date, imageUrl: form.imageUrl }
            : {
                title: form.title, slug: form.slug, summary: form.summary,
                content: form.content, date: form.date, imageUrl: form.imageUrl,
                technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
                githubUrl: form.githubUrl, liveUrl: form.liveUrl,
            };

        const res = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            setSuccess(isEdit ? "Başarıyla güncellendi!" : "Başarıyla oluşturuldu!");
            setTimeout(() => router.push("/admin/dashboard"), 1500);
        } else {
            const data = await res.json();
            setError(data.error || "Bir hata oluştu.");
        }
        setLoading(false);
    }

    const isProject = type === "project";

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.heading}>
                    {isEdit ? "İçeriği Düzenle" : isProject ? "Yeni Proje Ekle" : "Yeni Blog Yazısı Ekle"}
                </h1>
                <span className={styles.badge}>{isProject ? "🚀 Proje" : "✍️ Blog"}</span>
            </div>

            {fetching ? (
                <div className={styles.loading}>Mevcut içerik yükleniyor...</div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.grid}>
                        <div className={styles.field}>
                            <label className={styles.label}>Başlık *</label>
                            <input name="title" value={form.title} onChange={handleChange} className={styles.input} placeholder="Başlık girin..." required />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Slug *</label>
                            <input name="slug" value={form.slug} onChange={handleChange} className={styles.input} placeholder="url-uyumlu-baslik" required disabled={isEdit} />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Özet *</label>
                        <input name="summary" value={form.summary} onChange={handleChange} className={styles.input} placeholder="Kısa bir özet..." required />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Kapak Görseli URL</label>
                        <div className={styles.uploadRow}>
                            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className={styles.input} placeholder="https://cloudinary.com/..." />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="button" onClick={() => setGalleryOpen(true)} className={styles.uploadBtn} style={{ background: 'var(--surface-hover)', color: 'var(--text-primary)' }}>Galeri</button>
                                <label className={styles.uploadBtn}>
                                    {loading ? "..." : "Yükle"}
                                    <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>
                        {form.imageUrl && (
                            <img src={form.imageUrl} alt="Önizleme" className={styles.preview} />
                        )}
                    </div>


                    {isProject && (
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label className={styles.label}>Teknolojiler</label>
                                <input name="technologies" value={form.technologies} onChange={handleChange} className={styles.input} placeholder="React, Node.js, MongoDB" />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Tarih</label>
                                <input name="date" type="date" value={form.date} onChange={handleChange} className={styles.input} />
                            </div>
                        </div>
                    )}

                    {isProject && (
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label className={styles.label}>GitHub URL</label>
                                <input name="githubUrl" value={form.githubUrl} onChange={handleChange} className={styles.input} placeholder="https://github.com/..." />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Canlı URL</label>
                                <input name="liveUrl" value={form.liveUrl} onChange={handleChange} className={styles.input} placeholder="https://..." />
                            </div>
                        </div>
                    )}

                    <div className={styles.field}>
                        <label className={styles.label}>İçerik (MDX / Markdown) *</label>
                        <textarea name="content" value={form.content} onChange={handleChange} className={styles.textarea} placeholder="## Başlık&#10;&#10;Buraya **markdown** veya **MDX** içerik girin..." rows={18} required />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}
                    {success && <div className={styles.successMsg}>{success}</div>}

                    <div className={styles.actions}>
                        <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>İptal</button>
                        <button type="submit" disabled={loading} className={styles.submitBtn}>
                            {loading ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Yayınla"}
                        </button>
                    </div>
                </form>
            )}

            <ImageGallery
                isOpen={galleryOpen}
                onClose={() => setGalleryOpen(false)}
                onSelect={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            />
        </div>
    );
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div style={{ color: "#94a3b8", padding: "2rem" }}>Yükleniyor...</div>}>
            <EditorContent />
        </Suspense>
    );
}
