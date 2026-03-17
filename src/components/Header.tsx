"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { NavigationData, GlobalSettings } from "@/lib/types";
import { defaultNavigation, defaultSettings } from "@/lib/defaults";
import { BasketIcon } from "@/components/BasketIcon";

interface HeaderProps {
  navigation?: NavigationData;
  settings?: GlobalSettings;
}

export default function Header({ navigation, settings }: HeaderProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const nav = navigation || defaultNavigation;
  const siteSettings = settings || defaultSettings;

  return (
    <nav className="nav-demo">
      <div className="nav-header">
        <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "CLOSE" : "MENU"}
        </button>
        
        <Link href="/" className="nav-logo">
          <Image 
            src={siteSettings.site?.logo || "/cocoon-logo-black.svg"} 
            alt={siteSettings.site?.name || "Cocoon Healthcare"}
            width={220}
            height={49}
            priority
          />
        </Link>

        <div className="nav-actions">
          <Link href="/utility/contact" className="nav-cta">
            BOOK NOW
          </Link>
          <BasketIcon />
        </div>
      </div>

      {/* Dropdown Menu */}
      <div className={`nav-menu${menuOpen ? ' active' : ''}`}>
        <div className="nav-menu-grid">
          {nav.mainNav?.map((column, index) => (
            <div key={index} className="nav-menu-column">
              <h3 className="nav-column-title">
                {column.label}
              </h3>
              {column.children && column.children.length > 0 && (
                <ul className="nav-menu-links">
                  {column.children.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link 
                        href={item.url} 
                        className="nav-link" 
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
