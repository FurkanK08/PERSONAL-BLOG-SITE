import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Project } from "@/models/Project";
import { getSession } from "@/lib/auth";

// GET - Tüm projeleri getir
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const projects = await Project.find({}).sort({ date: -1 }).lean();
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Projeler getirilirken hata oluştu" }, { status: 500 });
    }
}

// POST - Yeni proje oluştur (sadece admin)
export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session?.role) {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, slug, summary, content, technologies, githubUrl, liveUrl, date } = body;

        if (!title || !slug || !summary || !content) {
            return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
        }

        await connectDB();

        const existing = await Project.findOne({ slug });
        if (existing) {
            return NextResponse.json({ error: "Bu slug zaten kullanılmakta" }, { status: 409 });
        }

        const newProject = await Project.create({
            title, slug, summary, content,
            technologies: technologies || [],
            githubUrl: githubUrl || "",
            liveUrl: liveUrl || "",
            date: date || new Date(),
        });
        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Proje oluşturulurken hata oluştu" }, { status: 500 });
    }
}
