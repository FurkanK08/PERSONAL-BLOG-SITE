"use client";

import { type Editor } from "@tiptap/react";
import { useState, useRef } from "react";
import {
    Bold, Italic, Underline, Strikethrough,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Code,
    Image as ImageIcon, Link as LinkIcon,
    Undo, Redo, Minus, Table as TableIcon,
    Loader2, Trash2, Columns, Rows, Trash,
    AlignLeft, AlignCenter, AlignRight, AlignJustify
} from "lucide-react";
import styles from "./rich-editor.module.css";

interface EditorToolbarProps {
    editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!editor) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "portfolio/blog");
        formData.append("type", "content");

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                editor.chain().focus().setImage({ src: data.url }).run();
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Resim yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const addImage = () => {
        fileInputRef.current?.click();
    };

    const addLink = () => {
        const url = window.prompt("URL girin:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarGroup}>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`${styles.toolbarBtn} ${editor.isActive("heading", { level: 1 }) ? styles.toolbarBtnActive : ""}`}
                    title="Başlık 1"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`${styles.toolbarBtn} ${editor.isActive("heading", { level: 2 }) ? styles.toolbarBtnActive : ""}`}
                    title="Başlık 2"
                >
                    <Heading2 size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`${styles.toolbarBtn} ${editor.isActive("heading", { level: 3 }) ? styles.toolbarBtnActive : ""}`}
                    title="Başlık 3"
                >
                    <Heading3 size={18} />
                </button>
            </div>

            <div className={styles.toolbarGroup}>
                <select
                    className={styles.toolbarSelect}
                    title="Yazı Boyutu"
                    onChange={(e) => {
                        if (e.target.value === "default") {
                            editor.chain().focus().unsetFontSize().run();
                        } else {
                            editor.chain().focus().setFontSize(e.target.value).run();
                        }
                    }}
                    value={editor.getAttributes('textStyle').fontSize || "default"}
                >
                    <option value="default">Varsayılan Boyut</option>
                    <option value="12px">12px (Çok Küçük)</option>
                    <option value="14px">14px (Küçük)</option>
                    <option value="16px">16px (Normal)</option>
                    <option value="18px">18px (Orta)</option>
                    <option value="20px">20px (Büyük)</option>
                    <option value="24px">24px (Çok Büyük)</option>
                    <option value="30px">30px (Dev)</option>
                </select>
            </div>

            <div className={styles.toolbarGroup}>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`${styles.toolbarBtn} ${editor.isActive("bold") ? styles.toolbarBtnActive : ""}`}
                    title="Kalın (Ctrl+B)"
                >
                    <Bold size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`${styles.toolbarBtn} ${editor.isActive("italic") ? styles.toolbarBtnActive : ""}`}
                    title="İtalik (Ctrl+I)"
                >
                    <Italic size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`${styles.toolbarBtn} ${editor.isActive("underline") ? styles.toolbarBtnActive : ""}`}
                    title="Altı Çizili (Ctrl+U)"
                >
                    <Underline size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`${styles.toolbarBtn} ${editor.isActive("strike") ? styles.toolbarBtnActive : ""}`}
                    title="Üstü Çizili"
                >
                    <Strikethrough size={18} />
                </button>
            </div>

            <div className={styles.toolbarGroup}>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`${styles.toolbarBtn} ${editor.isActive("bulletList") ? styles.toolbarBtnActive : ""}`}
                    title="Madde İşaretli Liste"
                >
                    <List size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`${styles.toolbarBtn} ${editor.isActive("orderedList") ? styles.toolbarBtnActive : ""}`}
                    title="Numaralı Liste"
                >
                    <ListOrdered size={18} />
                </button>
            </div>

            <div className={styles.toolbarGroup}>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`${styles.toolbarBtn} ${editor.isActive("blockquote") ? styles.toolbarBtnActive : ""}`}
                    title="Alıntı"
                >
                    <Quote size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`${styles.toolbarBtn} ${editor.isActive("codeBlock") ? styles.toolbarBtnActive : ""}`}
                    title="Kod Bloğu"
                >
                    <Code size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className={styles.toolbarBtn}
                    title="Yatay Çizgi"
                >
                    <Minus size={18} />
                </button>
            </div>

            <div className={styles.toolbarGroup}>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`${styles.toolbarBtn} ${editor.isActive({ textAlign: 'left' }) ? styles.toolbarBtnActive : ""}`}
                    title="Sola Hizala"
                >
                    <AlignLeft size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`${styles.toolbarBtn} ${editor.isActive({ textAlign: 'center' }) ? styles.toolbarBtnActive : ""}`}
                    title="Ortala"
                >
                    <AlignCenter size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`${styles.toolbarBtn} ${editor.isActive({ textAlign: 'right' }) ? styles.toolbarBtnActive : ""}`}
                    title="Sağa Hizala"
                >
                    <AlignRight size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`${styles.toolbarBtn} ${editor.isActive({ textAlign: 'justify' }) ? styles.toolbarBtnActive : ""}`}
                    title="İki Yana Yasla"
                >
                    <AlignJustify size={18} />
                </button>
            </div>

            <div className={styles.toolbarGroup}>
                <button
                    type="button"
                    onClick={addLink}
                    className={`${styles.toolbarBtn} ${editor.isActive("link") ? styles.toolbarBtnActive : ""}`}
                    title="Bağlantı Ekle"
                >
                    <LinkIcon size={18} />
                </button>
                <button
                    type="button"
                    onClick={addImage}
                    disabled={uploading}
                    className={styles.toolbarBtn}
                    title="Görsel Yükle"
                >
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    className={styles.toolbarBtn}
                    title="Tablo Ekle"
                >
                    <TableIcon size={18} />
                </button>
                {editor.isActive("table") && (
                    <>
                        <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className={styles.toolbarBtn} title="Sütun Ekle"><Columns size={18} /></button>
                        <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className={styles.toolbarBtn} title="Satır Ekle"><Rows size={18} /></button>
                        <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className={styles.toolbarBtn} title="Tabloyu Sil"><Trash size={18} /></button>
                    </>
                )}
            </div>

            <div className={styles.toolbarGroup}>
                <div className={styles.toolbarBtn} title="Metin Rengi">
                    <input
                        type="color"
                        onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                        value={editor.getAttributes("textStyle").color || "#000000"}
                        style={{ width: '20px', height: '20px', padding: 0, border: 'none', cursor: 'pointer' }}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetColor().run()}
                    className={styles.toolbarBtn}
                    title="Rengi Sıfırla"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className={styles.toolbarGroup}>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className={styles.toolbarBtn}
                    title="Geri Al"
                >
                    <Undo size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className={styles.toolbarBtn}
                    title="İleri Al"
                >
                    <Redo size={18} />
                </button>
            </div>
        </div>
    );
}
