"use client";

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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 shadow-[0_1px_8px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="container flex h-[70px] items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="RentRover home">
          <Logo />
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
                className={`text-sm font-semibold transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground"
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
          <MobileDrawer user={user} />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
