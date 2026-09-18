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
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
