import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

// 1. Korumalı ve public rotaları (path) belirt
const protectedRoutes = ["/admin", "/admin/dashboard", "/admin/editor"];
const publicRoutes = ["/admin/login"];

export default async function middleware(req: NextRequest) {
    // 2. İstenen rotayı kontrol et
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route) && path !== "/admin/login");
    const isPublicRoute = publicRoutes.includes(path);

    // 3. Çerezden oturum bilgisini al deşifre et
    const cookie = req.cookies.get("session")?.value;
    const session = await decrypt(cookie || "");

    // 4. Eğer rota korumalıysa, oturum yoksa veya geçersizse login sayfasına at
    if (isProtectedRoute && !session?.role) {
        return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }

    // 5. Eğer kullanıcı logolanmış ve halihazırda public bir sayfadaysa (örn: login) Dashboard'a at
    if (
        isPublicRoute &&
        session?.role === "admin" &&
        !req.nextUrl.pathname.startsWith("/admin/dashboard")
    ) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    }

    // 6. Root `/admin` dizinine gidiliyorsa (ve loginliyse) yönlendir
    if (path === "/admin" && session?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
