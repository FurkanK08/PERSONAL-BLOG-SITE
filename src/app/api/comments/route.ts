import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Comment } from "@/models/Comment";

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
        const { postSlug, name, content } = await req.json();

        if (!postSlug || !name || !content) {
            return NextResponse.json({ error: "Eksik alanlar var" }, { status: 400 });
        }

        await connectDB();
        const newComment = await Comment.create({
            postSlug,
            name,
            content,
            isApproved: false // Admin onayı bekleyecek
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Yorum ekleme hatası:", error);
        return NextResponse.json({ error: "Yorum kaydedilemedi" }, { status: 500 });
    }
}
