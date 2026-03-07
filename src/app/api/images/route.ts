import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
    const session = await getSession();
    if (!session?.role) {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        // Cloudinary'den resimleri çek
        const result = await cloudinary.search
            .expression("resource_type:image")
            .sort_by("created_at", "desc")
            .max_results(30)
            .execute();

        const images = result.resources.map((res: any) => ({
            public_id: res.public_id,
            secure_url: res.secure_url,
            created_at: res.created_at,
            width: res.width,
            height: res.height,
        }));

        return NextResponse.json(images);
    } catch (error) {
        console.error("Cloudinary list error:", error);
        return NextResponse.json({ error: "Resimler yüklenemedi" }, { status: 500 });
    }
}
