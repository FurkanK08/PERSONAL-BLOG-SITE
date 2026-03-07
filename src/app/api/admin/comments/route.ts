import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { Comment } from "@/models/Comment";

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session?.role) {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        await connectDB();
        // Admin tüm yorumları görsün, yeniler (onanmayı bekleyenler) üstte olsun.
        const comments = await Comment.find().sort({ createdAt: -1 });
        return NextResponse.json(comments);
    } catch (error) {
        console.error("Admin yorumları getirilemedi:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
