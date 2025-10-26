import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@/components/analytics";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ShowWork - AI-Powered Portfolio Builder",
  description:
    "Create stunning 3D portfolios with AI-powered content generation. 4.7 million unique combinations available.",
  keywords: ["portfolio", "AI", "3D", "developer", "designer", "creative"],
  authors: [{ name: "ShowWork Team" }],
  creator: "ShowWork",
  publisher: "ShowWork",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://showwork.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://showwork.com",
    title: "ShowWork - AI-Powered Portfolio Builder",
    description:
      "Create stunning 3D portfolios with AI-powered content generation. 4.7 million unique combinations available.",
    siteName: "ShowWork",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ShowWork Portfolio Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShowWork - AI-Powered Portfolio Builder",
    description:
      "Create stunning 3D portfolios with AI-powered content generation. 4.7 million unique combinations available.",
    images: ["/og-image.jpg"],
    creator: "@showwork",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navigation />
          {children}
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
