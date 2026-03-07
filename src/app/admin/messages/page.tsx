"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen, Check } from "lucide-react";
import styles from "./messages.module.css";

interface IMessage {
    _id: string;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openId, setOpenId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    async function fetchMessages() {
        setLoading(true);
        try {
            const res = await fetch("/api/messages");
            if (!res.ok) throw new Error("Mesajlar getirilemedi");
            const data = await res.json();
            setMessages(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function toggleRead(id: string, currentStatus: boolean) {
        try {
            const res = await fetch(`/api/messages/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: !currentStatus }),
            });
            if (res.ok) {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === id ? { ...msg, isRead: !currentStatus } : msg
                    )
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteMessage(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        try {
            const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
            if (res.ok) {
                setMessages((prev) => prev.filter((msg) => msg._id !== id));
                setConfirmDeleteId(null);
            }
        } catch (error) {
            console.error(error);
            setConfirmDeleteId(null);
        }
    }

    function handleCardClick(id: string, isRead: boolean) {
        setOpenId(openId === id ? null : id);
        if (!isRead && openId !== id) {
            // İlk kez okunuyorsa otomatik "Okundu" işaretle
            toggleRead(id, false);
        }
    }

    function toggleSelect(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }

    function toggleSelectAll() {
        if (selectedIds.length === messages.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(messages.map(m => m._id));
        }
    }

    async function handleBulkDelete() {
        if (selectedIds.length === 0) return;
        try {
            const res = await fetch("/api/messages/bulk", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds })
            });
            if (res.ok) {
                setMessages(prev => prev.filter(m => !selectedIds.includes(m._id)));
                setSelectedIds([]);
                setConfirmBulkDelete(false);
            }
        } catch (error) {
            console.error("Toplu silme hatası", error);
            setConfirmBulkDelete(false);
        }
    }

    if (loading) return <div>Mesajlar yükleniyor...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    const unreadCount = messages.filter((m) => !m.isRead).length;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Gelen Kutusu</h1>
                <div className={styles.stats}>
                    {unreadCount} Okunmamış / {messages.length} Toplam
                </div>
            </div>

            {messages.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'var(--surface-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                        <input
                            type="checkbox"
                            checked={selectedIds.length === messages.length && messages.length > 0}
                            onChange={toggleSelectAll}
                            style={{
                                width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-teal)'
                            }}
                        />
                        Tümünü Seç
                    </label>

                    {selectedIds.length > 0 && (
                        confirmBulkDelete ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedIds.length} mesaj silinecek. Emin misiniz?</span>
                                <button onClick={handleBulkDelete} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}>
                                    <Trash2 size={16} /> Evet, Sil
                                </button>
                                <button onClick={() => setConfirmBulkDelete(false)} style={{ background: 'var(--surface-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', cursor: 'pointer' }}>
                                    İptal
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setConfirmBulkDelete(true)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}
                            >
                                <Trash2 size={16} /> Seçilileri Sil ({selectedIds.length})
                            </button>
                        )
                    )}
                </div>
            )}

            {messages.length === 0 ? (
                <div className={styles.emptyState}>
                    <MailOpen size={48} className={styles.emptyIcon} />
                    <p>Henüz hiç iletişim mesajınız yok.</p>
                </div>
            ) : (
                <div className={styles.messageList}>
                    {messages.map((item) => {
                        const isOpen = openId === item._id;
                        return (
                            <div
                                key={item._id}
                                className={`${styles.messageCard} ${!item.isRead ? styles.unread : ""}`}
                                onClick={() => handleCardClick(item._id, item.isRead)}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.senderInfo}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(item._id)}
                                                onChange={(e) => { e.stopPropagation(); toggleSelect(item._id, e as unknown as React.MouseEvent); }}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-teal)' }}
                                            />
                                            <div className={styles.senderName}>
                                                {item.name}
                                                {!item.isRead && <span className={styles.unreadBadge}>YENİ</span>}
                                            </div>
                                        </div>
                                        <span className={styles.senderEmail} style={{ marginLeft: '1.8rem' }}>{item.email}</span>
                                    </div>
                                    <div className={styles.dateInfo}>
                                        {new Date(item.createdAt).toLocaleDateString("tr-TR", {
                                            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                                        })}
                                    </div>
                                </div>

                                {/* Kapalıyken Önizleme, Açıkken Tam Metin */}
                                {!isOpen ? (
                                    <p className={styles.messagePreview}>{item.message}</p>
                                ) : (
                                    <div className={styles.messageFull}>
                                        {item.message}

                                        <div className={styles.actions}>
                                            <button
                                                className={styles.iconBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleRead(item._id, item.isRead);
                                                }}
                                                title={item.isRead ? "Okunmadı İşaretle" : "Okundu İşaretle"}
                                            >
                                                {item.isRead ? <Mail size={18} /> : <Check size={18} />}
                                            </button>
                                            {confirmDeleteId === item._id ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Silinsin mi?</span>
                                                    <button
                                                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                                        onClick={(e) => { e.stopPropagation(); deleteMessage(item._id, e); }}
                                                        title="Evet, Sil"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className={styles.iconBtn}
                                                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                                                        title="İptal"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(item._id); }}
                                                    title="Mesajı Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
