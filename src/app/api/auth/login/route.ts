import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";

        // IP bloke edilmiş mi kontrol et
        const rateCheck = await rateLimit.check(ip);
        if (!rateCheck.success) {
            const resetTime = rateCheck.resetTime || Date.now();
            const retryAfter = Math.ceil((resetTime - Date.now()) / 1000 / 60);
            return NextResponse.json({
                error: `Çok fazla hatalı deneme. Lütfen ${retryAfter > 0 ? retryAfter : 1} dakika sonra tekrar deneyin.`
            }, { status: 429 });
        }

        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ error: "Şifre gerekli" }, { status: 400 });
        }

        const success = await login(password);

        if (success) {
            await rateLimit.reset(ip); // Başarılı girişte rate limiti sıfırla
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            // Başarısız girişte ratelimit zaten check içinde artırıldı, kalan hakkı göster
            return NextResponse.json({
                error: `Geçersiz şifre. Kalan deneme hakkınız: ${rateCheck.remaining}`
            }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
