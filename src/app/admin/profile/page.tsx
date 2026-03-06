"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./profile.module.css";

export default function AdminProfilePage() {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: "",
        title: "",
        subtitle: "",
        bio: "",
        email: "",
        githubUrl: "",
        linkedinUrl: "",
        twitterUrl: "",
        cvUrl: "",
        skills: "",
        titleWords: "",
        avatarEmoji: "👨‍💻",
        avatarUrl: "",
        timeline: [] as { year: string; title: string; desc: string; icon: string }[],
    });

    useEffect(() => {
        fetch("/api/profile")
            .then((r) => r.json())
            .then((data) => {
                if (data) {
                    setForm({
                        name: data.name || "",
                        title: data.title || "",
                        subtitle: data.subtitle || "",
                        bio: data.bio || "",
                        email: data.email || "",
                        githubUrl: data.githubUrl || "",
                        linkedinUrl: data.linkedinUrl || "",
                        twitterUrl: data.twitterUrl || "",
                        cvUrl: data.cvUrl || "",
                        skills: (data.skills || []).join(", "),
                        titleWords: (data.titleWords || []).join(", "),
                        avatarEmoji: data.avatarEmoji || "👨‍💻",
                        avatarUrl: data.avatarUrl || "",
                        timeline: data.timeline || [],
                    });
                }
            })
            .finally(() => setFetching(false));
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleTimelineChange(index: number, field: string, value: string) {
        setForm((prev) => {
            const newTimeline = [...prev.timeline];
            newTimeline[index] = { ...newTimeline[index], [field]: value };
            return { ...prev, timeline: newTimeline };
        });
    }

    function addTimelineItem() {
        setForm((prev) => ({
            ...prev,
            timeline: [...prev.timeline, { year: "", title: "", desc: "", icon: "Circle" }]
        }));
    }

    function removeTimelineItem(index: number) {
        setForm((prev) => ({
            ...prev,
            timeline: prev.timeline.filter((_, i) => i !== index)
        }));
    }

    async function uploadImage(file: File) {
        if (!file.type.startsWith("image/")) {
            setError("Lütfen bir resim dosyası seçin.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Resim boyutu 5MB'dan küçük olmalıdır.");
            return;
        }

        setUploading(true);
        setError("");
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
            const data = await res.json();
            setForm((prev) => ({ ...prev, avatarUrl: data.url }));
            setSuccess("Resim yüklendi! Profili kaydetmeyi unutma.");
        } else {
            const data = await res.json();
            setError(data.error || "Resim yüklenirken hata oluştu.");
        }
        setUploading(false);
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) uploadImage(file);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadImage(file);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const body = {
            ...form,
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
            titleWords: form.titleWords.split(",").map((s) => s.trim()).filter(Boolean),
        };

        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            setSuccess("Profil başarıyla güncellendi! Ana sayfa değişiklikleri yansıtacak.");
        } else {
            const data = await res.json();
            setError(data.error || "Bir hata oluştu.");
        }
        setLoading(false);
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.heading}>Profil Bilgileri</h1>
                    <p className={styles.sub}>Ana sayfa içeriğini buradan düzenleyebilirsiniz.</p>
                </div>
            </div>

            {fetching ? (
                <div className={styles.loading}>Veriler yükleniyor...</div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* ─── AVATAR YÜKLEME ─── */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Profil Fotoğrafı</h2>

                        <div className={styles.avatarSection}>
                            {/* Mevcut avatar önizleme */}
                            <div className={styles.avatarPreview}>
                                {form.avatarUrl ? (
                                    <Image
                                        src={form.avatarUrl}
                                        alt="Avatar"
                                        width={120}
                                        height={120}
                                        className={styles.avatarImg}
                                        unoptimized
                                    />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        <span>{form.avatarEmoji}</span>
                                        <p>Henüz fotoğraf yüklenmedi</p>
                                    </div>
                                )}
                            </div>

                            {/* Drag & Drop yükleme alanı */}
                            <div
                                className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""} ${uploading ? styles.dropZoneUploading : ""}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                    style={{ display: "none" }}
                                />
                                {uploading ? (
                                    <div className={styles.uploadingState}>
                                        <div className={styles.spinner} />
                                        <p>Cloudinary&apos;ye yükleniyor...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.dropIcon}>📸</div>
                                        <p className={styles.dropText}>
                                            Resmi buraya sürükle ya da <span className={styles.dropLink}>tıkla</span>
                                        </p>
                                        <p className={styles.dropHint}>PNG, JPG, WEBP · Max 5MB · Otomatik kırpılır (400×400)</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Emoji fallback */}
                        <div className={styles.field} style={{ marginTop: "1rem" }}>
                            <label className={styles.label}>Emoji Avatar (resim yoksa gösterilir)</label>
                            <input name="avatarEmoji" value={form.avatarEmoji} onChange={handleChange} className={styles.input} placeholder="👨‍💻" style={{ width: "120px" }} />
                        </div>
                    </div>

                    {/* ─── KİMLİK ─── */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Kimlik</h2>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label className={styles.label}>Ad Soyad</label>
                                <input name="name" value={form.name} onChange={handleChange} className={styles.input} placeholder="Furkan K." />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Ünvan (Başlık)</label>
                                <input name="title" value={form.title} onChange={handleChange} className={styles.input} placeholder="Full-Stack Geliştirici" />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Alt Başlık</label>
                            <input name="subtitle" value={form.subtitle} onChange={handleChange} className={styles.input} placeholder="Modern Web Uygulamaları İnşa Eden" />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Hakkımda / Bio</label>
                            <textarea name="bio" value={form.bio} onChange={handleChange} className={styles.textarea} rows={4} placeholder="Kendini kısaca anlat..." />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Yetenekler / Teknolojiler (virgülle ayır)</label>
                            <input name="skills" value={form.skills} onChange={handleChange} className={styles.input} placeholder="Next.js, React, Node.js, TypeScript, MongoDB" />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>🔄 Ana Sayfa Döngüsel Başlık (virgülle ayır)</label>
                            <input name="titleWords" value={form.titleWords} onChange={handleChange} className={styles.input} placeholder="Full-Stack Geliştirici, Frontend Developer, Backend Developer, UI Enthusiast" />
                            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>Ana sayfadaki dönen yazı animasyonu — her kelime sırayla görünür.</p>
                        </div>
                    </div>

                    {/* ─── İLETİŞİM & SOSYAL ─── */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>İletişim & Sosyal</h2>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label className={styles.label}>E-Posta</label>
                                <input name="email" value={form.email} onChange={handleChange} className={styles.input} placeholder="furkan@example.com" />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>CV / Özgeçmiş URL</label>
                                <input name="cvUrl" value={form.cvUrl} onChange={handleChange} className={styles.input} placeholder="https://cv.example.com" />
                            </div>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label className={styles.label}>GitHub URL</label>
                                <input name="githubUrl" value={form.githubUrl} onChange={handleChange} className={styles.input} placeholder="https://github.com/FurkanK08" />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>LinkedIn URL</label>
                                <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} className={styles.input} placeholder="https://linkedin.com/in/furkankeles" />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Twitter / X URL</label>
                            <input name="twitterUrl" value={form.twitterUrl} onChange={handleChange} className={styles.input} placeholder="https://twitter.com/..." />
                        </div>
                    </div>

                    {/* ─── YOLCULUĞUM (TIMELINE) ─── */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Yolculuğum (Zaman Çizelgesi)</h2>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>Ana sayfadaki "Hakkımda" bölümünde yer alan eğitim/kariyer geçmişiniz.</p>

                        {form.timeline.map((item, index) => (
                            <div key={index} className={styles.grid} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Yıl</label>
                                    <input value={item.year} onChange={(e) => handleTimelineChange(index, "year", e.target.value)} className={styles.input} placeholder="Örn: 2024" />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Başlık</label>
                                    <input value={item.title} onChange={(e) => handleTimelineChange(index, "title", e.target.value)} className={styles.input} placeholder="Örn: Full-Stack Geliştirici" />
                                </div>
                                <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                                    <label className={styles.label}>Açıklama</label>
                                    <textarea value={item.desc} onChange={(e) => handleTimelineChange(index, "desc", e.target.value)} className={styles.textarea} rows={2} placeholder="Deneyim veya eğitim detayı..." />
                                </div>
                                <div className={styles.field} style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                                    <button type="button" onClick={() => removeTimelineItem(index)} style={{ color: "#ef4444", fontSize: "0.875rem", cursor: "pointer", background: "none", border: "none" }}>Öğeyi Sil</button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addTimelineItem} style={{ color: "var(--accent-teal)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", background: "none", border: "none", padding: "0.5rem 0" }}>+ Yeni Deneyim Ekle</button>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}
                    {success && <div className={styles.successMsg}>{success}</div>}

                    <div className={styles.actions}>
                        <button type="submit" disabled={loading} className={styles.submitBtn}>
                            {loading ? "Kaydediliyor..." : "💾 Profili Kaydet"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
