import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/navigation/Navbar";
import MobileBottomBar from "@/components/navigation/MobileBottomBar";
import DemoAccountSwitcher from "@/components/shared/DemoAccountSwitcher";
import CursorGlow from "@/components/shared/CursorGlow";

export const metadata: Metadata = {
  title: "QueueWise — Haute Coiffure & Live Token Booking",
  description:
    "Elevate your grooming ritual. Discover elite salons, book bespoke appointments, and monitor live tokens seamlessly.",
  keywords: ["salon booking", "live queue", "token system", "luxury salon", "haircut", "spa"],
  openGraph: {
    title: "QueueWise — Haute Coiffure & Live Token Booking",
    description: "Book your turn. Skip the wait. Live token tracking for premier salons.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#0A0A0B] text-[#F5F5F7] min-h-screen selection:bg-gold-500/20 selection:text-gold-200">
        <CursorGlow />
        <Navbar />
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <MobileBottomBar />
        <DemoAccountSwitcher />
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#111114",
              border: "1px solid rgba(230, 200, 135, 0.2)",
              color: "#F5F5F7",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
