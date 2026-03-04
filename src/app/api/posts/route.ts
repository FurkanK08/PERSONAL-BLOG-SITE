import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { getSession } from "@/lib/auth";

// GET - Tüm yazıları getir
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const posts = await Post.find({}).sort({ date: -1 }).lean();
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Yazılar getirilirken hata oluştu" }, { status: 500 });
    }
}

// POST - Yeni yazı oluştur (sadece admin)
export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session?.role) {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, slug, summary, content, date, imageUrl } = body;


        if (!title || !slug || !summary || !content) {
            return NextResponse.json({ error: "Tüm alanlar zorunludur" }, { status: 400 });
        }

        await connectDB();

        const existingPost = await Post.findOne({ slug });
        if (existingPost) {
            return NextResponse.json({ error: "Bu slug zaten kullanılmakta" }, { status: 409 });
        }

        const newPost = await Post.create({ title, slug, summary, content, date: date || new Date(), imageUrl });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Yazı oluşturulurken hata oluştu" }, { status: 500 });
    }
}
