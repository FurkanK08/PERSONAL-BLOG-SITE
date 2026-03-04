"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Twitter, Send, CheckCircle } from "lucide-react";
import styles from "./contact.module.css";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setSuccess(true);
            setForm({ name: "", email: "", message: "" });
        } else {
            const data = await res.json();
            setError(data.error || "Bir hata oluştu. Lütfen tekrar dene.");
        }
        setLoading(false);
    }

    return (
        <main className={styles.page}>
            <div className={`container ${styles.inner}`}>

                {/* Page header */}
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className={styles.heading}>İletişime Geç</h1>
                    <p className={styles.sub}>
                        Proje fikrin mi var? İş birliği mi yapalım? Ya da sadece merhaba mı demek istiyorsun?
                        Mesajını bırak, en kısa sürede döneceğim.
                    </p>
                </motion.div>

                <div className={styles.grid}>
                    {/* ─ FORM ─ */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        {success ? (
                            <div className={styles.successCard}>
                                <CheckCircle size={48} className={styles.successIcon} />
                                <h2>Mesajın İletildi! 🎉</h2>
                                <p>En kısa sürede geri döneceğim. Teşekkürler!</p>
                                <button onClick={() => setSuccess(false)} className={styles.resetBtn}>
                                    Yeni Mesaj Gönder
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Adın</label>
                                    <input
                                        name="name" value={form.name} onChange={handleChange}
                                        className={styles.input} placeholder="Adın Soyadın" required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>E-Posta Adresin</label>
                                    <input
                                        name="email" type="email" value={form.email} onChange={handleChange}
                                        className={styles.input} placeholder="ornek@email.com" required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Mesajın</label>
                                    <textarea
                                        name="message" value={form.message} onChange={handleChange}
                                        className={styles.textarea} rows={6}
                                        placeholder="Proje detaylarını, fikirlerini veya sorularını yaz..." required
                                    />
                                </div>
                                {error && <p className={styles.error}>{error}</p>}
                                <motion.button
                                    type="submit" disabled={loading} className={styles.submitBtn}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? (
                                        <span className={styles.spinner} />
                                    ) : (
                                        <><Send size={18} /> Mesaj Gönder</>
                                    )}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>

                    {/* ─ INFO ─ */}
                    <motion.div
                        className={styles.info}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        <div className={styles.infoCard}>
                            <h3 className={styles.infoTitle}>Diğer Yollar</h3>
                            <div className={styles.contactItems}>
                                <a href="mailto:furkankeles5600@gmail.com" className={styles.contactItem}>
                                    <Mail size={20} className={styles.contactIcon} />
                                    <div>
                                        <p className={styles.contactLabel}>E-Posta</p>
                                        <p className={styles.contactValue}>furkankeles5600@gmail.com</p>
                                    </div>
                                </a>
                                <a href="https://github.com/FurkanK08" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <Github size={20} className={styles.contactIcon} />
                                    <div>
                                        <p className={styles.contactLabel}>GitHub</p>
                                        <p className={styles.contactValue}>github.com/FurkanK08</p>
                                    </div>
                                </a>
                                <a href="https://linkedin.com/in/furkankeles" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <Linkedin size={20} className={styles.contactIcon} />
                                    <div>
                                        <p className={styles.contactLabel}>LinkedIn</p>
                                        <p className={styles.contactValue}>in/furkankeles</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className={styles.availCard}>
                            <div className={styles.availDot} />
                            <div>
                                <p className={styles.availTitle}>Şu an müsaitim</p>
                                <p className={styles.availSub}>Freelance veya tam zamanlı proje tekliflerine açığım.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
