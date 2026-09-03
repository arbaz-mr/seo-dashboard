import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEO & GMB Dashboard",
  description: "Premium SEO & GMB Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-[#f8faff] text-slate-900 min-h-screen flex relative`}>
        {/* Ambient background glow */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
        <AppProvider>
          <div className="relative z-10 flex w-full min-h-screen">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
