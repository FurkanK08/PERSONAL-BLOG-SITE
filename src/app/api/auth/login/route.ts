import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";

        // IP bloke edilmiş mi kontrol et
        const record = rateLimit.store.get(ip);
        if (record && record.count >= rateLimit.maxRequests && Date.now() < record.resetTime) {
            const retryAfter = Math.ceil((record.resetTime - Date.now()) / 1000 / 60);
            return NextResponse.json({
                error: `Çok fazla hatalı deneme. Lütfen ${retryAfter} dakika sonra tekrar deneyin.`
            }, { status: 429 });
        }

        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ error: "Şifre gerekli" }, { status: 400 });
        }

        const success = await login(password);

        if (success) {
            rateLimit.reset(ip); // Başarılı girişte rate limiti sıfırla
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            // Başarısız girişte ratelimit sayacını artır
            const rateResult = rateLimit.fail(ip);
            return NextResponse.json({
                error: `Geçersiz şifre. Kalan deneme hakkınız: ${rateResult.remaining}`
            }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
