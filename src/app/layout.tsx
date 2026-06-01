import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/shared/ToastContainer";
import "./globals.css";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://hng-fe-stage-8.vercel.app";

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
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable}`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          themes={["light", "dark", "system"]}
          enableSystem
          storageKey="nexusdb-theme"
        >
          <TooltipProvider delayDuration={300}>
            <ToastProvider>{children}</ToastProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
