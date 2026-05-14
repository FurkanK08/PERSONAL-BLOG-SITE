import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Post } from "@/models/Post";

export async function GET() {
    try {
        await connectDB();
        const posts = await Post.find({}).sort({ date: -1 }).lean();

        const siteUrl = "https://furkankeles.vercel.app";
        
        const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>Furkan Keleş Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Modern web teknolojileri ve yazılım geliştirme üzerine notlar.</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts.map(post => `
    <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${siteUrl}/blog/${post.slug}</link>
        <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.summary}]]></description>
    </item>`).join('')}
</channel>
</rss>`;

        return new NextResponse(rss, {
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "s-maxage=3600, stale-while-revalidate",
            },
        });
    } catch (error) {
        console.error("RSS generation error:", error);
        return new NextResponse("Error generating RSS feed", { status: 500 });
    }
}
