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
        e.stopPropagation(); // Kartın click eventini tetiklememesi için
        if (!confirm("Bu mesajı kalıcı olarak silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
            if (res.ok) {
                setMessages((prev) => prev.filter((msg) => msg._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    }

    function handleCardClick(id: string, isRead: boolean) {
        setOpenId(openId === id ? null : id);
        if (!isRead && openId !== id) {
            // İlk kez okunuyorsa otomatik "Okundu" işaretle
            toggleRead(id, false);
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
                                        <div className={styles.senderName}>
                                            {item.name}
                                            {!item.isRead && <span className={styles.unreadBadge}>YENİ</span>}
                                        </div>
                                        <span className={styles.senderEmail}>{item.email}</span>
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
                                            <button
                                                className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                                onClick={(e) => deleteMessage(item._id, e)}
                                                title="Mesajı Sil"
                                            >
                                                <Trash2 size={18} />
                                            </button>
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
