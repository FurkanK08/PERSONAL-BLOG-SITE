"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";

interface CloudImage {
    public_id: string;
    secure_url: string;
    created_at: string;
}

interface ImageGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export default function ImageGallery({ isOpen, onClose, onSelect }: ImageGalleryProps) {
    const [images, setImages] = useState<CloudImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetch("/api/images")
                .then(res => res.json())
                .then(data => {
                    if (data.error) setError(data.error);
                    else setImages(data);
                })
                .catch(() => setError("Bağlantı hatası."))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 100, display: "flex",
            alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)"
        }}>
            <div style={{
                background: "var(--surface-color)", width: "90%", maxWidth: "800px",
                height: "80vh", borderRadius: "var(--radius-lg)", display: "flex",
                flexDirection: "column", overflow: "hidden", border: "1px solid var(--border-color)"
            }}>
                {/* Header */}
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-color)",
                    background: "var(--surface-hover)"
                }}>
                    <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0, fontSize: "1.2rem", color: "var(--text-primary)" }}>
                        <ImageIcon size={20} className="text-teal-500" /> Medya Galerisi
                    </h2>
                    <button onClick={onClose} style={{ color: "var(--text-muted)", cursor: "pointer", background: "none", border: "none" }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
                            <Loader2 size={32} style={{ animation: "spin 1s linear infinite", marginBottom: "1rem" }} />
                            <p>Resimler Cloudinary'den yükleniyor...</p>
                        </div>
                    ) : error ? (
                        <div style={{ color: "#ef4444", textAlign: "center", marginTop: "2rem" }}>{error}</div>
                    ) : images.length === 0 ? (
                        <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "2rem" }}>
                            Görünüşe göre bulutta henüz hiç resim yok.
                        </div>
                    ) : (
                        <div style={{
                            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem"
                        }}>
                            {images.map(img => (
                                <div
                                    key={img.public_id}
                                    onClick={() => {
                                        onSelect(img.secure_url);
                                        onClose();
                                    }}
                                    style={{
                                        position: "relative", aspectRatio: "1/1", borderRadius: "var(--radius-md)",
                                        overflow: "hidden", cursor: "pointer", border: "2px solid transparent",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--accent-teal)"}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = "transparent"}
                                >
                                    <Image
                                        src={img.secure_url}
                                        alt={img.public_id}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        unoptimized // Admin panel for fast preview
                                    />
                                    <div style={{
                                        position: "absolute", bottom: 0, left: 0, right: 0,
                                        background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                                        color: "white", fontSize: "0.7rem", padding: "0.5rem",
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                    }}>
                                        {img.public_id.split('/').pop()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
