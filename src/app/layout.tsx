import type { Metadata } from "next";
import { headers } from "next/headers";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import "./globals.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import PageTransition from "@/components/layout/PageTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://furkankeles.vercel.app"),
  title: {
    default: "Furkan Keleş | Full-Stack Geliştirici",
    template: "%s | Furkan Keleş"
  },
  description: "Modern web uygulamaları inşa eden, kullanıcı odaklı ve ölçeklenebilir çözümler sunan bir Full-Stack Geliştiricinin portföyü ve blogu.",
  keywords: ["Furkan Keleş", "Full-Stack Geliştirici", "Next.js", "React", "TypeScript", "Node.js", "Portföy", "Blog"],
  authors: [{ name: "Furkan Keleş" }],
  creator: "Furkan Keleş",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://furkankeles.vercel.app",
    siteName: "Furkan Keleş Portföy",
    title: "Furkan Keleş | Full-Stack Geliştirici",
    description: "Modern web uygulamaları inşa eden Full-Stack Geliştiricinin portföyü ve blogu.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Furkan Keleş"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Furkan Keleş | Full-Stack Geliştirici",
    description: "Modern web uygulamaları inşa eden Full-Stack Geliştiricinin portföyü ve blogu.",
    images: ["/og-image.png"],
    creator: "@furkankeles"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="tr" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="canonical" href={`https://furkankeles.vercel.app${pathname}`} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <AnalyticsTracker />
          {!isAdmin && <Navbar />}
          <main>
            {isAdmin ? children : <PageTransition>{children}</PageTransition>}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
