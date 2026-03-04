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

        if (!file) {
            return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
        }

        // Dosyayı Buffer'a çevir
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Cloudinary'ye base64 olarak yükle
        const result = await new Promise<{ secure_url: string; public_id: string }>(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            folder: "portfolio/avatar",
                            transformation: [
                                { width: 400, height: 400, crop: "fill", gravity: "face" },
                                { quality: "auto", fetch_format: "auto" },
                            ],
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
