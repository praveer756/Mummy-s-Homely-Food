import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Rozha_One } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const rozhaOne = Rozha_One({
  variable: "--font-marathi",
  subsets: ["devanagari", "latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mummyshomelyfood.in"),
  title: "Mummy’s Homely Food | Authentic Maharashtrian Restaurant & Dhaba",
  description:
    "Experience the soulful warmth of authentic Maharashtrian homely food. Traditional Charpai dining, piping hot Pithla Bhakri, signature Maharashtrian Thalis, and open-air hospitality under warm evening lights.",
  keywords: [
    "Mummy's Homely Food",
    "Maharashtrian Restaurant",
    "Pithla Bhakri",
    "Maharashtrian Thali",
    "Khat Charpai Dining",
    "Authentic Marathi Food",
    "Misal Pav",
    "Solkadhi",
    "Dhaba Maharashtra",
  ],
  openGraph: {
    title: "Mummy’s Homely Food — A Journey Into Maharashtra’s Homely Flavours",
    description:
      "Not just a meal. A little piece of home. Traditional open-air dining, steaming bhakris, and honest roadside hospitality.",
    images: [
      {
        url: "/images/restaurant/hero-exterior-night.jpg",
        width: 1200,
        height: 630,
        alt: "Mummy's Homely Food exterior with glowing illuminated sign at night",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${rozhaOne.variable}`}
    >
      <body className="bg-tamarind text-rice font-sans antialiased selection:bg-turmeric selection:text-tamarind min-h-screen">
        {children}
      </body>
    </html>
  );
}
