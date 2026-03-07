import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { Comment } from "@/models/Comment";

// Yorumu Onayla veya Onayını Kaldır
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session?.role) {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();

        await connectDB();
        const updated = await Comment.findByIdAndUpdate(
            id,
            { isApproved: body.isApproved },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Yorum bulunamadı" }, { status: 404 });
        }

        return NextResponse.json({ success: true, comment: updated });
    } catch (error) {
        console.error("Yorum güncellenemedi:", error);
        return NextResponse.json({ error: "Güncelleme hatası" }, { status: 500 });
    }
}

// Yorumu Sil
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session?.role) {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await connectDB();
        const deleted = await Comment.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: "Yorum bulunamadı" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Yorum silinemedi:", error);
        return NextResponse.json({ error: "Silme hatası" }, { status: 500 });
    }
}
