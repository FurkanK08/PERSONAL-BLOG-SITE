"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import ImageResize from "tiptap-extension-resize-image";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { common, createLowlight } from "lowlight";
import { FontSize } from "./extensions/FontSize";
import EditorToolbar from "./EditorToolbar";
import styles from "./rich-editor.module.css";
import { useEffect } from "react";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
    content: string;
    onChange: (markdown: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = "İçeriğinizi buraya yazın..." }: RichTextEditorProps) {
    const uploadImage = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "portfolio/blog");
        formData.append("type", "content");

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            return data.url || null;
        } catch (error) {
            console.error("Upload error:", error);
            return null;
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            TextStyle,
            FontSize,
            Color,
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            Markdown,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link',
                },
            }),
            ImageResize.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'editor-image',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: content,
        immediatelyRender: false,
        editorProps: {
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith("image/")) {
                        uploadImage(file).then(url => {
                            if (url) {
                                const { schema } = view.state;
                                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                                const node = schema.nodes.image.create({ src: url });
                                const transaction = view.state.tr.insert(coordinates!.pos, node);
                                view.dispatch(transaction);
                            }
                        });
                        return true;
                    }
                }
                return false;
            },
            handlePaste: (view, event) => {
                if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
                    const file = event.clipboardData.files[0];
                    if (file.type.startsWith("image/")) {
                        uploadImage(file).then(url => {
                            if (url) {
                                const { schema } = view.state;
                                const node = schema.nodes.image.create({ src: url });
                                const transaction = view.state.tr.replaceSelectionWith(node);
                                view.dispatch(transaction);
                            }
                        });
                        return true;
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
    });

    // Dışarıdan content değişirse (örneğin edit modunda veri gelirse) editorü güncelle
    useEffect(() => {
        if (editor && content !== editor.getHTML() && content !== editor.getText()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className={styles.editorWrapper}>
            <EditorToolbar editor={editor} />
            <div className={styles.editorContent}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
