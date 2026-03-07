"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import styles from "./comments.module.css";

interface CommentType {
    _id: string;
    name: string;
    content: string;
    createdAt: string;
}

export default function Comments({ postSlug }: { postSlug: string }) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comments?postSlug=${postSlug}`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.error("Yorumlar yüklenirken hata oluştu", error);
            }
        };
        fetchComments();
    }, [postSlug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !content.trim()) return;

        setStatus("loading");
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postSlug, name, content }),
            });

            if (res.ok) {
                setStatus("success");
                setName("");
                setContent("");
                // Yorum admin onayına düştüğü için anlık eklemiyoruz, uyarı veriyoruz
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <section className={styles.commentsSection}>
            <div className={styles.header}>
                <MessageSquare size={24} className={styles.icon} />
                <h2>Yorumlar ({comments.length})</h2>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <User size={18} className={styles.inputIcon} />
                    <input
                        type="text"
                        placeholder="Adınız"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <textarea
                    placeholder="Düşüncelerinizi paylaşın..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={4}
                    className={styles.textarea}
                />

                <button
                    type="submit"
                    disabled={status === "loading"}
                    className={styles.submitBtn}
                >
                    {status === "loading" ? "Gönderiliyor..." : "Yorum Yap"}
                    <Send size={16} />
                </button>

                {status === "success" && (
                    <div className={styles.successMsg}>
                        Yorumunuz başarıyla gönderildi! Yönetici onayından sonra burada görünecektir.
                    </div>
                )}
                {status === "error" && (
                    <div className={styles.errorMsg}>
                        Bir hata oluştu, lütfen daha sonra tekrar deneyin.
                    </div>
                )}
            </form>

            <div className={styles.list}>
                {comments.length === 0 ? (
                    <p className={styles.emptyMsg}>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className={styles.commentCard}>
                            <div className={styles.commentHeader}>
                                <strong>{comment.name}</strong>
                                <time>
                                    {new Date(comment.createdAt).toLocaleDateString("tr-TR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </time>
                            </div>
                            <p className={styles.commentContent}>{comment.content}</p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
