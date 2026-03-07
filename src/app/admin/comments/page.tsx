"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2, MessageSquare } from "lucide-react";
import styles from "./comments.module.css";

interface CommentType {
    _id: string;
    postSlug: string;
    name: string;
    content: string;
    isApproved: boolean;
    createdAt: string;
}

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteError, setDeleteError] = useState("");
    const [confirmId, setConfirmId] = useState<string | null>(null);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const res = await fetch("/api/admin/comments");
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isApproved: !currentStatus }),
            });
            if (res.ok) {
                setComments((prev) =>
                    prev.map((c) => (c._id === id ? { ...c, isApproved: !currentStatus } : c))
                );
            }
        } catch (error) {
            console.error("Durum değiştirilemedi", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
            if (res.ok) {
                setComments((prev) => prev.filter((c) => c._id !== id));
                setDeleteError("");
                setConfirmId(null);
            } else {
                const data = await res.json();
                const msg = data?.error || `Hata: HTTP ${res.status}`;
                setDeleteError(msg);
                setConfirmId(null);
            }
        } catch (error) {
            console.error("Silinemedi", error);
            setDeleteError("Bağlantı hatası.");
            setConfirmId(null);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Yorumlar yükleniyor...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <MessageSquare size={28} className={styles.icon} />
                    Yorum Yönetimi
                </h1>
                <p className={styles.subtitle}>Blog yazılarına gelen yorumları onaylayın veya silin.</p>
            </div>

            <div className={styles.list}>
                {comments.length === 0 ? (
                    <div className={styles.empty}>Henüz hiç yorum yapılmamış.</div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className={`${styles.card} ${comment.isApproved ? styles.approvedCard : styles.pendingCard}`}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <strong className={styles.name}>{comment.name}</strong>
                                    <span className={styles.slugBadge}>Yazı: {comment.postSlug}</span>
                                </div>
                                <div className={styles.date}>
                                    {new Date(comment.createdAt).toLocaleDateString("tr-TR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </div>
                            </div>

                            <p className={styles.content}>{comment.content}</p>

                            <div className={styles.actions}>
                                {comment.isApproved ? (
                                    <button
                                        onClick={() => toggleApproval(comment._id, comment.isApproved)}
                                        className={`${styles.actionBtn} ${styles.rejectBtn}`}
                                        title="Yayından Kaldır"
                                    >
                                        <XCircle size={18} /> Gizle (Onaylı)
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => toggleApproval(comment._id, comment.isApproved)}
                                        className={`${styles.actionBtn} ${styles.approveBtn}`}
                                        title="Yorumu Yayınla"
                                    >
                                        <CheckCircle size={18} /> Onayla ve Yayınla
                                    </button>
                                )}

                                {confirmId === comment._id ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Emin misiniz?</span>
                                        <button
                                            onClick={() => handleDelete(comment._id)}
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            title="Evet, Sil"
                                        >
                                            <Trash2 size={18} /> Evet, Sil
                                        </button>
                                        <button
                                            onClick={() => setConfirmId(null)}
                                            className={styles.actionBtn}
                                            style={{ background: 'var(--surface-hover)', color: 'var(--text-muted)' }}
                                        >
                                            İptal
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmId(comment._id)}
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                        title="Tamamen Sil"
                                    >
                                        <Trash2 size={18} /> Sil
                                    </button>
                                )}
                            </div>

                            {!comment.isApproved && (
                                <div className={styles.pendingBadge}>Yeni (Onay Bekliyor)</div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
