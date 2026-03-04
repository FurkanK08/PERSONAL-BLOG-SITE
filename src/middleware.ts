import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

const protectedRoutes = ["/admin/dashboard", "/admin/editor"];
const publicRoutes = ["/admin/login"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = req.cookies.get("session")?.value;
    const session = await decrypt(cookie || "");

    // Korumalı rotaya yetkisiz erişim → login'e at
    if (isProtectedRoute && !session?.role) {
        return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }

    // Giriş yapmış kullanıcı login sayfasında → dashboard'a at
    if (isPublicRoute && session?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    }

    // /admin root → dashboard'a yönlendir
    if (path === "/admin") {
        if (session?.role === "admin") {
            return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
        } else {
            return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
        }
    }

    // x-pathname header'ını aktar (layout, admin için Navbar'ı gizlemekte kullanır)
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", path);

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
