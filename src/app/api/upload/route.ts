import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs"; // Cloudinary Node.js ister

// POST /api/upload - Resim yükle
export async function POST(req: NextRequest) {
    // Sadece admin erişebilir
    const session = await getSession();
    if (!session?.role) {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "portfolio/blog";
        const type = (formData.get("type") as string) || "content";

        if (!file) {
            return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const transformations = type === 'avatar' 
            ? [{ width: 400, height: 400, crop: "fill", gravity: "face" }]
            : [];
        // @ts-ignore
        transformations.push({ quality: "auto", fetch_format: "auto" });

        const result = await new Promise<{ secure_url: string; public_id: string }>(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            folder,
                            transformation: transformations,
                        },
                        (error, result) => {
                            if (error || !result) return reject(error);
                            resolve(result as { secure_url: string; public_id: string });
                        }
                    )
                    .end(buffer);
            }
        );

        return NextResponse.json(
            { url: result.secure_url, publicId: result.public_id },
            { status: 200 }
        );
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Resim yüklenirken hata oluştu" },
            { status: 500 }
        );
    }
}
