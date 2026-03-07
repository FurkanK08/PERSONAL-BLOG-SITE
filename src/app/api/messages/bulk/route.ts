import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Message } from "@/models/Message";
import { getSession } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session?.role) {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const { ids } = await req.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "Geçersiz istek, ID listesi bekleniyor" }, { status: 400 });
        }

        await connectDB();

        // MongoDB `$in` operatörü ile toplu silme
        const result = await Message.deleteMany({ _id: { $in: ids } });

        return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        console.error("Toplu mesaj silme hatası:", error);
        return NextResponse.json({ error: "Silme işlemi başarısız" }, { status: 500 });
    }
}
