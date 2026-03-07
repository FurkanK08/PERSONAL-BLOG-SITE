import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { Comment } from "@/models/Comment";
import { getSession } from "@/lib/auth";

// GET - Tek bir yazıyı slug ile getir
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        await connectDB();
        const post = await Post.findOne({ slug }).lean();
        if (!post) return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 });
        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Yazı getirilirken hata oluştu" }, { status: 500 });
    }
}

// PUT - Yazıyı güncelle (sadece admin)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const session = await getSession();
    if (!session?.role) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

    try {
        const { slug } = await params;
        const body = await req.json();
        await connectDB();
        const updated = await Post.findOneAndUpdate({ slug }, body, { new: true });
        if (!updated) return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 });
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Yazı güncellenirken hata oluştu" }, { status: 500 });
    }
}

// DELETE - Yazıyı sil (sadece admin)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const session = await getSession();
    if (!session?.role) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

    try {
        const { slug } = await params;
        await connectDB();
        const deleted = await Post.findOneAndDelete({ slug });
        if (!deleted) return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 });

        // Cascade: Bu yazıya ait tüm yorumları da sil
        await Comment.deleteMany({ postSlug: slug });

        return NextResponse.json({ message: "Yazı ve ilgili yorumlar silindi" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Yazı silinirken hata oluştu" }, { status: 500 });
    }
}
