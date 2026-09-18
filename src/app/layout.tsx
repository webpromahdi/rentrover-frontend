import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import QueryProvider from "@/lib/query/QueryProvider";

// Geist is the primary brand font — clean, technical, and modern.
// Inter has been removed to avoid the generic "AI default" look.
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RentRover | Sports & Outdoor Equipment Rentals",
  description:
    "Rent verified sports and outdoor gear from trusted local providers. Book by the day, pick up, and adventure. No ownership needed.",
  openGraph: {
    title: "RentRover | Sports & Outdoor Equipment Rentals",
    description:
      "Rent verified sports and outdoor gear from trusted local providers. Book by the day, pick up, and adventure.",
    type: "website",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", geistSans.variable, geistMono.variable)}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col overflow-x-hidden font-sans antialiased"
      >
        <QueryProvider>
          {/* Skip to main content — first focusable element for keyboard/AT users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Skip to main content
          </a>
          {children}
          <Toaster richColors position="top-right" />
          {/* Aria-live region so screen readers announce toast notifications */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
