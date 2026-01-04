"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";

export function Navigation() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => item.children && setOpenDropdown(item.label)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <Link
            href={item.href}
            className="px-4 py-2 font-ui text-sm uppercase tracking-wider text-gray-300 hover:text-retro-cyan transition-colors duration-200"
          >
            {item.label}
            {item.children && (
              <span className="ml-1 text-xs">▼</span>
            )}
          </Link>

          {item.children && openDropdown === item.label && (
            <div className="absolute left-0 top-full pt-2 z-50">
              <div className="glass rounded-md py-2 min-w-[240px] shadow-lg shadow-retro-purple/20">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-4 py-3 hover:bg-retro-purple/30 transition-colors duration-200"
                  >
                    <span className="block font-ui text-sm text-retro-cyan">
                      {child.label}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">
                      {child.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
