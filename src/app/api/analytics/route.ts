import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Visitor } from "@/models/Visitor";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const path = body.path || "/";
        const userAgent = req.headers.get("user-agent") || "unknown";

        let ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
        if (!ip) {
            const ipObj = Reflect.get(req, "ip");
            ip = typeof ipObj === "string" ? ipObj : "unknown";
        }

        // IP adresini anonimleştirerek kaydet (GDPR uyumu)
        const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

        // Aynı IP ve Path için son 30 dk içinde kayıt var mı diye kontrol et
        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

        const existingVisitor = await Visitor.findOne({
            ipHash,
            path,
            timestamp: { $gte: thirtyMinsAgo }
        });

        // 30 dk içinde girilmişse tekrar sayma
        if (!existingVisitor) {
            await Visitor.create({
                ipHash,
                userAgent,
                path
            });
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Visitor logging error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        // Toplam benzersiz sayfa gösterimi sayısı
        const totalViews = await Visitor.countDocuments();

        return NextResponse.json({ total: totalViews }, { status: 200 });
    } catch (error) {
        console.error("Visitor count fetch error:", error);
        return NextResponse.json({ total: 0 }, { status: 500 });
    }
}
