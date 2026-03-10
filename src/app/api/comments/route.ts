import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Comment } from "@/models/Comment";
import DOMPurify from 'isomorphic-dompurify';
import { rateLimit } from "@/lib/rate-limit";

// Yorum getirme (Sadece onaylananlar, postSlug'a göre)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const postSlug = searchParams.get("postSlug");

        if (!postSlug) {
            return NextResponse.json({ error: "postSlug gerekli" }, { status: 400 });
        }

        await connectDB();
        const comments = await Comment.find({ postSlug, isApproved: true }).sort({ createdAt: -1 });
        return NextResponse.json(comments);
    } catch (error) {
        console.error("Yorum getirme hatası:", error);
        return NextResponse.json({ error: "Yorum listesi alınamadı" }, { status: 500 });
    }
}

// Ziyaretçinin yeni yorum eklemesi
export async function POST(req: NextRequest) {
    try {
        // Rate Limiting (IP tabanlı)
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const limitCheck = rateLimit.check(ip);

        if (!limitCheck || !limitCheck.success) {
            return NextResponse.json({ error: "Çok fazla istek yapıldı. Lütfen daha sonra tekrar deneyin." }, { status: 429 });
        }

        const { postSlug, name, content } = await req.json();

        if (!postSlug || !name || !content) {
            return NextResponse.json({ error: "Eksik alanlar var" }, { status: 400 });
        }

        // Girdilerin Sanitizasyonu (XSS engelleme)
        const sanitizedName = DOMPurify.sanitize(name.trim());
        const sanitizedContent = DOMPurify.sanitize(content.trim());

        if (!sanitizedName || !sanitizedContent) {
            return NextResponse.json({ error: "Geçersiz giriş algılandı" }, { status: 400 });
        }

        // Boyut kontrolü
        if (sanitizedName.length > 50 || sanitizedContent.length > 1000) {
            return NextResponse.json({ error: "Girdi çok uzun" }, { status: 400 });
        }

        await connectDB();
        const newComment = await Comment.create({
            postSlug: DOMPurify.sanitize(postSlug.trim()),
            name: sanitizedName,
            content: sanitizedContent,
            isApproved: false // Admin onayı bekleyecek
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Yorum ekleme hatası:", error);
        return NextResponse.json({ error: "Yorum kaydedilemedi" }, { status: 500 });
    }
}
