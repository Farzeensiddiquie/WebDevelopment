import { Inter } from "next/font/google";
import { playfair } from "./font.js";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";
import ClientProviders from "./ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Fashion Store - Find Clothes That Match Your Style",
  description: "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
  keywords: "fashion, clothing, style, trendy, affordable, online shopping",
  authors: [{ name: "Fashion Store Team" }],
  creator: "Fashion Store",
  publisher: "Fashion Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://fashion-store.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fashion Store - Find Clothes That Match Your Style",
    description: "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
    url: "https://fashion-store.com",
    siteName: "Fashion Store",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Fashion Store - Find Clothes That Match Your Style",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fashion Store - Find Clothes That Match Your Style",
    description: "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
    images: ["/hero.png"],
    creator: "@fashionstore",
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
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="antialiased">
        <ClientProviders>
            <LayoutWrapper>{children}</LayoutWrapper>
        </ClientProviders>
      </body>
    </html>
  );
}
