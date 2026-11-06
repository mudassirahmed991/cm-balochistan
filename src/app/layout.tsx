import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BackToTop } from "@/components/back-to-top";
import { AIChatbot } from "@/components/ai-chatbot";
import { site } from "@/lib/site";
import { LanguageProvider } from "@/lib/i18n";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cm.balochistan.gob.pk"),
  title: {
    default: `${site.fullName} | Government of Balochistan`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.fullName,
  keywords: [
    "Chief Minister Balochistan",
    "Government of Balochistan",
    "Office of the Chief Minister",
    "Balochistan priorities",
    "Balochistan news",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: site.fullName,
    title: `${site.fullName} | Government of Balochistan`,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.fullName,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={openSans.variable} suppressHydrationWarning>
      <body className={`${openSans.className} flex min-h-screen flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-pine-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <LanguageProvider>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <BackToTop />
          <AIChatbot />
        </LanguageProvider>
      </body>
    </html>
  );
}
