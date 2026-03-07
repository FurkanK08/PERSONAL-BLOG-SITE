import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Message } from "@/models/Message";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    const session = await getSession();
    if (!session?.role) {
        return NextResponse.json({ count: 0 }, { status: 401 });
    }

    try {
        await connectDB();
        const unreadCount = await Message.countDocuments({ isRead: false });
        return NextResponse.json({ count: unreadCount });
    } catch (error) {
        console.error("Okunmamış mesaj sayısı alınamadı:", error);
        return NextResponse.json({ count: 0 }, { status: 500 });
    }
}
