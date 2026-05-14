"use client";

import { useState } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function TestEditorPage() {
    const [content, setContent] = useState("## Merhaba Tiptap!\n\nBu bir **test** içeriğidir.");

    return (
        <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>Editor Test Sayfası</h1>
            <RichTextEditor 
                content={content} 
                onChange={setContent} 
            />
            
            <div style={{ marginTop: "40px", padding: "20px", background: "#1e293b", borderRadius: "8px" }}>
                <h3>Markdown Çıktısı:</h3>
                <pre style={{ whiteSpace: "pre-wrap", color: "#94a3b8" }}>
                    {content}
                </pre>
            </div>
        </div>
    );
}
