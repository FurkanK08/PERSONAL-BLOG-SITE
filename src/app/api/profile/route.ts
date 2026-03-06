import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { SiteProfile } from "@/models/SiteProfile";
import { getSession } from "@/lib/auth";

// GET - Profil verisini getir (herkes okuyabilir)
export async function GET() {
    try {
        await connectDB();
        let profile = await SiteProfile.findOne({});
        if (!profile) {
            // İlk kullanımda varsayılan profil oluştur
            profile = await SiteProfile.create({});
        }

        // Auto-heal empty timelines
        if (!profile.timeline || profile.timeline.length === 0) {
            profile.timeline = [
                { year: "2022", title: "Web'e İlk Adım", desc: "HTML, CSS ve JavaScript öğrenerek ilk projelerimi oluşturdum.", icon: "Globe" },
                { year: "2023", title: "React & Next.js", desc: "Modern frontend framework'lerine geçiş yaparak portföy projeleri geliştirdim.", icon: "Code2" },
                { year: "2024", title: "Full-Stack Geliştirme", desc: "Node.js, MongoDB ve REST API tasarımıyla backend geliştirmeye başladım.", icon: "Zap" },
                { year: "2025", title: "Profesyonel Projeler", desc: "Gerçek dünya projelerinde çalışarak uzmanlık alanlarımı genişlettim.", icon: "Terminal" },
                { year: "2026", title: "Sürekli Gelişim", desc: "TypeScript, Cloud servisleri ve modern web teknolojileri üzerine çalışmaya devam ediyorum.", icon: "BookOpen" }
            ];
            await profile.save();
        }

        // Auto-heal missing titleWords
        if (!profile.titleWords || profile.titleWords.length === 0) {
            profile.titleWords = ["Full-Stack Geliştirici", "Frontend Developer", "Backend Developer", "UI Enthusiast"];
            await profile.save();
        }

        return NextResponse.json(profile.toJSON ? profile.toJSON() : profile, { status: 200 });
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

        // $set kullanarak sadece gelen alanları güncelle — diğer alanları silmez
        const profile = await SiteProfile.findOneAndUpdate(
            {},
            { $set: body },
            { new: true, upsert: true }
        );

        return NextResponse.json(profile, { status: 200 });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Profil güncellenemedi", detail: String(error) }, { status: 500 });
    }
}

