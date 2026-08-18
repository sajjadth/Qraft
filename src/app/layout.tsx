import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qraft — Make anything scannable.",
  description:
    "Create, customize, and share QR codes — privately, directly in your browser. Supports URLs, text, contacts, Wi-Fi, events, locations, and more.",
  keywords: [
    "QR code",
    "QR generator",
    "QR creator",
    "privacy",
    "offline",
    "browser",
    "Wi-Fi QR",
    "vCard",
  ],
  authors: [{ name: "Qraft" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Qraft — Make anything scannable.",
    description:
      "Create, customize, and share QR codes — privately, directly in your browser.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="system" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          fontFamily: "var(--font-sans)",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {children}
      </body>
    </html>
  );
}
