"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PageHeader() {
  const pathname = usePathname();

  const links = [
    { label: "Upload", href: "/registry" },
    { label: "Datenbank", href: "/schema" },
    { label: "About", href: "/about" },
  ];

  return (
    <header
      className="flex justify-between items-center px-8 py-4"
      style={{ backgroundColor: "#003063" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 no-underline">
        <span className="text-2xl">&#127800;</span>
        <span className="font-bold text-xl text-white tracking-wide">KIKA</span>
        <span className="text-xs font-light text-white opacity-70 hidden sm:block">
          Hamburgisches Krebsregister
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-6 text-sm">
        {links.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="text-white opacity-80 hover:opacity-100 transition-opacity"
            style={pathname === href ? { opacity: 1, fontWeight: 600 } : {}}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* R-Umgebung */}
      <Link
        href="http://192.168.2.7:8081/"
        className="px-4 py-1.5 rounded text-sm font-medium text-white border border-white border-opacity-40 hover:bg-white hover:bg-opacity-10 transition-colors"
      >
        R-Umgebung
      </Link>
    </header>
  );
}
