"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { MobileDrawer } from "./header/MobileDrawer";
import { GuestActions, UserMenu } from "./header/UserMenu";
import { guestLinks } from "./header/nav-links";
import type { HeaderUser } from "./header/types";

interface SiteHeaderProps {
  user?: HeaderUser;
}

const SiteHeader = ({ user }: SiteHeaderProps) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
          !isTransparent
            ? "border-b border-border/60 bg-white/96 shadow-[0_1px_16px_0_rgba(37,99,235,0.07)] backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="container flex h-[70px] items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="RentRover home">
            <Logo inverse={isTransparent} />
          </Link>

          {/* Desktop Nav */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {guestLinks.map(({ label, href }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={label}
                  href={href}
                  className={`text-sm font-semibold transition-colors duration-200 hover:text-primary ${
                    isActive
                      ? "text-primary"
                      : !isTransparent
                      ? "text-foreground"
                      : "text-white/90"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden items-center lg:flex">
            {user ? <UserMenu user={user} /> : <GuestActions />}
          </div>

          {/* Mobile Hamburger / Drawer */}
          <div className="lg:hidden">
            <MobileDrawer user={user} isTransparent={isTransparent} />
          </div>
        </div>
      </header>
      {/* Spacer to prevent content from hiding under the fixed navbar on non-home pages */}
      {!isHomePage && <div className="h-[70px]" aria-hidden="true" />}
    </>
  );
};

export default SiteHeader;
