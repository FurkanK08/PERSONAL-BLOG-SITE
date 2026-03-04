import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ error: "Şifre gerekli" }, { status: 400 });
        }

        const success = await login(password);

        if (success) {
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
