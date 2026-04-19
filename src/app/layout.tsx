import type { Metadata } from "next";
import "./globals.css";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "KIKA — Hamburgisches Krebsregister",
  description: "Import-System fuer oBDS_RKI-konforme XML-Dateien.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className="flex flex-col min-h-screen" style={{ backgroundColor: "#F2F5F7" }}>
        <PageHeader />
        <main className="flex flex-col grow">{children}</main>
        <footer className="py-6 text-sm flex items-center justify-between px-6" style={{ color: "#505050" }}>
          <span>&copy; KIKA 2025 &mdash; Hamburgisches Krebsregister</span>
          <span style={{ color: "#A0A0A0", fontSize: "0.7rem" }}>
            {process.env.NEXT_PUBLIC_BUILD_VERSION ?? "dev"}
          </span>
        </footer>
      </body>
    </html>
  );
}
