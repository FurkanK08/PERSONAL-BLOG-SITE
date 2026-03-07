import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { Message } from "@/models/Message";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }

        const { id } = await params;
        const { isRead } = await req.json();

        await connectDB();

        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            { isRead },
            { returnDocument: 'after' } // Güncellenmiş dokümanı geri dön
        );

        if (!updatedMessage) {
            return NextResponse.json({ error: "Mesaj bulunamadı" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: updatedMessage }, { status: 200 });
    } catch (error) {
        console.error("Message Update Error:", error);
        return NextResponse.json({ error: "Mesaj güncellenirken bir hata oluştu" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const deletedMessage = await Message.findByIdAndDelete(id);

        if (!deletedMessage) {
            return NextResponse.json({ error: "Silinecek mesaj bulunamadı" }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Message Delete Error:", error);
        return NextResponse.json({ error: "Mesaj silinirken bir hata oluştu" }, { status: 500 });
    }
}
