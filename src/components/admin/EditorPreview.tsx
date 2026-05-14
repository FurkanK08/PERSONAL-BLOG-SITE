"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import styles from "../../app/blog/[slug]/slug.module.css";

interface EditorPreviewProps {
    content: string;
}

export default function EditorPreview({ content }: EditorPreviewProps) {
    const isHtml = content.trim().startsWith('<');

    return (
        <div 
            className={styles.mdxContent} 
            style={{ padding: '20px', background: 'var(--bg-color)', minHeight: '100%' }}
        >
            {isHtml ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]}
                >
                    {content}
                </ReactMarkdown>
            )}
        </div>
    );
}


