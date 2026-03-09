import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";
import { ThemeSync } from "@/components/theme-sync";
import { ThemeDecor } from "@/components/theme-decor";
import { IntroAnimation } from "@/components/intro-animation";
import { AuthWrapper } from "@/components/auth-wrapper";
import { LayoutWrapper } from "@/components/layout-wrapper";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aetheris AI Workspace",
  description: "Flow-state productivity with AI assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${spaceGrotesk.variable} antialiased`}>
        <ThemeSync />
        <ThemeDecor />
        <IntroAnimation />
        <AuthWrapper>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthWrapper>
      </body>
    </html>
  );
}
