import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export function getPosts(type: "blog" | "projects") {
    const dirPath = path.join(contentDirectory, type);

    if (!fs.existsSync(dirPath)) {
        return [];
    }

    const files = fs.readdirSync(dirPath);

    const posts = files.map((filename) => {
        const slug = filename.replace(/\.mdx$/, "");
        const fullPath = path.join(dirPath, filename);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);

        return {
            slug,
            ...(data as { title: string; date: string; summary: string; tags?: string[]; image?: string; link?: string }),
        };
    });

    return posts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export function getPostBySlug(type: "blog" | "projects", slug: string) {
    const fullPath = path.join(contentDirectory, type, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        slug,
        content,
        ...(data as { title: string; date: string; summary: string; tags?: string[]; image?: string; link?: string }),
    };
}
