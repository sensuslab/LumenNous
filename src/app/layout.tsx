import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./app-introduction.css";
import { AppIntroduction } from "@/components/chrome/AppIntroduction";
import { BottomNavigation } from "@/components/chrome/BottomNavigation";
import { InstallAppPrompt } from "@/components/chrome/InstallAppPrompt";
import { OfflineNotice } from "@/components/chrome/OfflineNotice";
import { ServiceWorkerRegister } from "@/components/chrome/ServiceWorkerRegister";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { Starfield } from "@/components/celestial/Starfield";

/* Nocturne typography (design.md §2.7): Cormorant Garamond display serif,
   Inter UI sans, IBM Plex Mono metadata — vendored locally (next/font/local)
   so builds never depend on external font downloads; display: swap, exposed
   as CSS vars consumed by globals.css @theme. */
const cormorant = localFont({
  src: [
    { path: "./fonts/cormorantgaramond-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cormorantgaramond-400i.woff2", weight: "400", style: "italic" },
    { path: "./fonts/cormorantgaramond-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorantgaramond-500i.woff2", weight: "500", style: "italic" },
    { path: "./fonts/cormorantgaramond-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "./fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/inter-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = localFont({
  src: [
    { path: "./fonts/ibmplexmono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibmplexmono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "LumenNous",
  title: {
    default: "LumenNous",
    template: "%s · LumenNous",
  },
  description:
    "An open contemplative library — daily prayers, affirmations, guided practices and sacred listening, grounded in sources. No account. Works offline.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LumenNous",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#0A0E1A",
};

/* Apply the persisted low-stimulation preference before first paint so the
   calm rendering never flashes. Honours prefers-reduced-motion when no
   explicit choice has been stored (design.md §4.3). */
const STIM_BOOT =
  "try{var s=localStorage.getItem('lumennous-stim')||localStorage.getItem('pe-stim');if(s==='low'||(!s&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)){document.documentElement.dataset.stim='low';}}catch(e){}";

/* Decide whether the first-launch introduction is due before paint. A short
   fail-open timer ensures the app shell is never stranded if hydration fails. */
const INTRO_BOOT =
  "try{var d=document.documentElement,k='lumennous-intro-seen-v1',p=location.pathname,q=new URLSearchParams(location.search);if(p.length>1&&p.endsWith('/'))p=p.slice(0,-1);if(p==='/'&&(q.get('intro')==='1'||localStorage.getItem(k)!=='1')){d.dataset.intro='show';d.style.overflow='hidden';window.__lumenIntroFallback=window.setTimeout(function(){if(d.dataset.intro==='show'){d.removeAttribute('data-intro');d.style.removeProperty('overflow');}},12000);}}catch(e){}";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${plexMono.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: STIM_BOOT }} />
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
      </head>
      <body className="min-h-dvh">
        <div id="app-shell">
          {/* Skip to content — first in the app shell (WCAG 2.2 §5.10) */}
          <a href="#content" className="skip-link">
            Skip to content
          </a>

          {/* Celestial backdrop: starfield behind everything (z -1),
              grain above everything (z 60, pointer-events none) */}
          <Starfield />
          <div aria-hidden="true" className="grain" />

          <SiteHeader />

          <main
            id="content"
            className={[
              "relative",
              "px-5 md:px-8",
              "pt-[calc(56px+env(safe-area-inset-top)+24px)]",
              "pb-[calc(64px+env(safe-area-inset-bottom)+24px)]",
              "lg:ml-[72px] lg:pb-24",
            ].join(" ")}
          >
            {children}
          </main>

          <BottomNavigation />
          <OfflineNotice />
          <InstallAppPrompt />
          <ServiceWorkerRegister />
        </div>
        <AppIntroduction />
      </body>
    </html>
  );
}
