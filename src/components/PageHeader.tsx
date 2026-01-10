"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function PageHeader() {
  const pathname = usePathname();

  const links = [
    { label: "Features", href: "/" },
    { label: "Krebsregister", href: "/registry" },
    { label: "Datenbank", href: "/schema" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-50">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">🌀</span>{" "}
        <span className="font-semibold text-lg text-gray-900">Krebs DB</span>
      </div>

      <nav className="flex items-center space-x-6 text-sm text-gray-600">
        {links.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className={`hover:text-black ${
              pathname === href ? "font-medium" : ""
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div>
        <Link
          href="http://localhost:8091/"
          className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-black bg-white hover:bg-gray-100"
        >
          R-Umgebung
        </Link>
      </div>
    </header>
  );
}

export default PageHeader;
