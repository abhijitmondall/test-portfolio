import type { Metadata } from "next";
import { Syne, Instrument_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400", "500", "600"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Abhijit Mondal — Full-Stack Engineer",
    template: "%s | Abhijit Mondal",
  },
  description:
    "Full-Stack Engineer specializing in React, Next.js, Node.js & scalable web applications. Based in Bangladesh.",
  keywords: [
    "Full-Stack Engineer",
    "React Developer",
    "Next.js",
    "Node.js",
    "Bangladesh",
    "Freelance",
  ],
  authors: [{ name: "Abhijit Mondal", url: "https://developer-avi.com" }],
  creator: "Abhijit Mondal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://developer-avi.com",
    title: "Abhijit Mondal — Full-Stack Engineer",
    description:
      "Building scalable web apps with clean code & critical thinking.",
    siteName: "Abhijit Mondal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhijit Mondal — Full-Stack Engineer",
    description:
      "Building scalable web apps with clean code & critical thinking.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${instrument.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="bg-[#08080F] text-[#E8E8F0] antialiased"
      >
        <Providers>
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "#0F0F1A",
                border: "1px solid rgba(232,255,0,0.2)",
                color: "#E8E8F0",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
