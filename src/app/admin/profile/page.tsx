"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

export default function AdminProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

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
        avatarEmoji: "👨‍💻",
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
                        avatarEmoji: data.avatarEmoji || "👨‍💻",
                    });
                }
            })
            .finally(() => setFetching(false));
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const body = {
            ...form,
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        };

        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            setSuccess("Profil başarıyla güncellendi! Ana sayfa değişiklikler yansıtacak.");
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
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Kimlik</h2>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label className={styles.label}>Ad Soyad</label>
                                <input name="name" value={form.name} onChange={handleChange} className={styles.input} placeholder="Furkan K." />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Avatar Emoji</label>
                                <input name="avatarEmoji" value={form.avatarEmoji} onChange={handleChange} className={styles.input} placeholder="👨‍💻" />
                            </div>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label className={styles.label}>Ünvan (Başlık)</label>
                                <input name="title" value={form.title} onChange={handleChange} className={styles.input} placeholder="Full-Stack Geliştirici" />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Alt Başlık</label>
                                <input name="subtitle" value={form.subtitle} onChange={handleChange} className={styles.input} placeholder="Modern Web Uygulamaları İnşa Eden" />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Hakkımda / Bio</label>
                            <textarea name="bio" value={form.bio} onChange={handleChange} className={styles.textarea} rows={4} placeholder="Kendini kısaca anlat..." />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Yetenekler / Teknolojiler (virgülle ayır)</label>
                            <input name="skills" value={form.skills} onChange={handleChange} className={styles.input} placeholder="Next.js, React, Node.js, TypeScript, MongoDB" />
                        </div>
                    </div>

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
