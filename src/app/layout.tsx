import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/shared/ToastContainer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nexusdb.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "NexusDB Explorer",
    template: "%s | NexusDB Explorer",
  },
  description:
    "NexusDB Explorer — a visual query builder for SQL, MongoDB, and GraphQL. Build complex queries with a no-code tree interface and see live results.",
  keywords: [
    "query builder",
    "SQL",
    "MongoDB",
    "GraphQL",
    "visual query builder",
    "no-code",
    "database explorer",
  ],
  authors: [{ name: "NexusDB" }],
  creator: "NexusDB",
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    url: APP_URL,
    title: "NexusDB Explorer",
    description:
      "Build complex SQL, MongoDB, and GraphQL queries visually — no code needed.",
    siteName: "NexusDB Explorer",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusDB Explorer",
    description:
      "Build complex SQL, MongoDB, and GraphQL queries visually — no code needed.",
    creator: "@nexusdb",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          themes={["light", "dark", "system"]}
          enableSystem
          storageKey="nexusdb-theme"
        >
          <TooltipProvider delayDuration={300}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
