import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { SiteProfile } from "@/models/SiteProfile";
import { getSession } from "@/lib/auth";

// GET - Profil verisini getir (herkes okuyabilir)
export async function GET() {
    try {
        await connectDB();
        let profile = await SiteProfile.findOne({}).lean();
        if (!profile) {
            // İlk kullanımda varsayılan profil oluştur
            profile = await SiteProfile.create({});
        }
        return NextResponse.json(profile, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Profil alınamadı" }, { status: 500 });
    }
}

// PUT - Profil güncelle (sadece admin)
export async function PUT(req: NextRequest) {
    const session = await getSession();
    if (!session?.role) {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const body = await req.json();
        await connectDB();
        let profile = await SiteProfile.findOne({});
        if (!profile) {
            profile = await SiteProfile.create(body);
        } else {
            Object.assign(profile, body);
            await profile.save();
        }
        return NextResponse.json(profile, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Profil güncellenemedi" }, { status: 500 });
    }
}
