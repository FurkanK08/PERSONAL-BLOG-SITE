import type { Metadata } from "next";
import { headers } from "next/headers";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern Web Uygulamaları İnşa Eden Full-Stack Geliştirici",
  description: "Yazılım Geliştiricisi Portföy ve Blog Sayfası",
};


import PageTransition from "@/components/layout/PageTransition";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          {!isAdmin && <Navbar />}
          <main>
            {isAdmin ? children : <PageTransition>{children}</PageTransition>}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}


