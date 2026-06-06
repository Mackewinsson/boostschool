import { Geist, Geist_Mono } from "next/font/google";
import { getLocaleFromCookies } from "@/lib/locale-server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromCookies();

  return (
    <html
      lang={locale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Inline script runs before paint to apply stored theme and avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t);var l=localStorage.getItem("locale");if(l==="es"||l==="en"||l==="pl")document.documentElement.setAttribute("lang",l)}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
