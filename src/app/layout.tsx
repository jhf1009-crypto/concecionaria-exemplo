import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import {
  Header,
  Footer,
  FloatingWhatsApp,
  CookieConsent,
} from "@/components/shell";
import { SmoothScroll } from "@/components/motion";
import { site } from "@/config/site";
import "./globals.css";
const dmSans = localFont({
  src: "../../public/fonts/dm-sans.woff2",
  display: "swap",
  variable: "--font-sans",
  weight: "100 900",
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Ninho Veículos | Seu próximo caminho começa aqui",
    template: "%s | Ninho Veículos",
  },
  description:
    "Encontre seu próximo seminovo em Goiânia com a Ninho Veículos. Explore o estoque, simule seu financiamento e converse com a gente. Site de demonstração.",
  alternates: { canonical: "/", languages: { "pt-BR": "/" } },
  openGraph: {
    title: "Ninho Veículos — seu próximo caminho",
    description:
      "Carros escolhidos com cuidado. Uma experiência pensada para você.",
    locale: "pt_BR",
    type: "website",
    siteName: site.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2c94c",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={dmSans.variable}>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <CookieConsent />
        <SmoothScroll />
      </body>
    </html>
  );
}
