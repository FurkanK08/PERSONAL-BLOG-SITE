import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Project } from "@/models/Project";
import { getSession } from "@/lib/auth";

// GET - Tek proje getir
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        await connectDB();
        const project = await Project.findOne({ slug }).lean();
        if (!project) return NextResponse.json({ error: "Proje bulunamadı" }, { status: 404 });
        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Proje getirilirken hata oluştu" }, { status: 500 });
    }
}

// PUT - Projeyi güncelle
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const session = await getSession();
    if (!session?.role) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

    try {
        const { slug } = await params;
        const body = await req.json();
        await connectDB();
        const updated = await Project.findOneAndUpdate({ slug }, body, { new: true });
        if (!updated) return NextResponse.json({ error: "Proje bulunamadı" }, { status: 404 });
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Proje güncellenirken hata oluştu" }, { status: 500 });
    }
}

// DELETE - Projeyi sil
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const session = await getSession();
    if (!session?.role) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

    try {
        const { slug } = await params;
        await connectDB();
        const deleted = await Project.findOneAndDelete({ slug });
        if (!deleted) return NextResponse.json({ error: "Proje bulunamadı" }, { status: 404 });
        return NextResponse.json({ message: "Proje silindi" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Proje silinirken hata oluştu" }, { status: 500 });
    }
}
