import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { Message } from "@/models/Message";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }

        await connectDB();

        // En yeni mesajlar en üstte gelecek şekilde (descending) sıralıyoruz
        const messages = await Message.find().sort({ createdAt: -1 });

        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        console.error("Messages API Fetch Error:", error);
        return NextResponse.json({ error: "Mesajlar getirilemedi" }, { status: 500 });
    }
}
