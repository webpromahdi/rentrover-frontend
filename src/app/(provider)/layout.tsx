"use client";
import type React from "react";
import { useState } from "react";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/shared/Logo";
import { logout } from "@/app/services/auth/logout";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/lib/api/auth.api";

const nav: [React.ElementType, string, string][] = [
  [LayoutDashboard, "Dashboard", "/dashboard/provider"],
  [Boxes, "My Gear", "/dashboard/provider/gear"],
  [Plus, "Add New Gear", "/dashboard/provider/gear/new"],
  [ClipboardList, "Orders", "/dashboard/provider/orders"],
  [Settings, "Profile", "/dashboard/provider/profile"],
];

const isNavActive = (pathname: string, href: string) => {
  if (href === "/dashboard/provider") return pathname === href;
  if (href === "/dashboard/provider/gear")
    return (
      pathname === href ||
      (pathname.startsWith(href) &&
        !pathname.startsWith("/dashboard/provider/gear/new"))
    );
  return pathname.startsWith(href);
};

const NavLinks = ({
  pathname,
  onNavClick,
}: {
  pathname: string;
  onNavClick?: () => void;
}) => (
  <nav className="mt-7 space-y-1">
    {nav.map(([Icon, label, href]) => {
      const active = isNavActive(pathname, href);
      return (
        <Link
          key={label as string}
          href={href as string}
          onClick={onNavClick}
          className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-3 text-sm font-semibold transition-colors ${
            active
              ? "border-primary bg-white/10 text-white"
              : "border-transparent text-slate-200 hover:border-primary hover:bg-white/5 hover:text-white"
          }`}
        >
          <Icon className="size-5" />
          {label}
        </Link>
      );
    })}
  </nav>
);

const ProviderSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: profileData } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  const userName = profileData?.data?.profile?.name || "Provider";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col bg-slate-900 px-4 py-7 text-white lg:flex">
      <Link href="/dashboard/provider">
        <Logo inverse />
      </Link>
      <div className="mt-10 flex items-center gap-3 border-b border-white/15 pb-6">
        <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-extrabold">
          {initials}
        </span>
        <div>
          <p className="font-bold">{userName}</p>
          <span className="mt-1 inline-flex rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-foreground">
            Provider
          </span>
        </div>
      </div>
      <NavLinks pathname={pathname} />
      <button
        onClick={handleLogout}
        className="mt-auto flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary text-sm font-bold text-red-200 transition-colors hover:bg-primary hover:text-white"
      >
        <LogOut className="size-4" />
        Log Out
      </button>
    </aside>
  );
};

const ProviderMobileDrawer = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: profileData } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  const userName = profileData?.data?.profile?.name || "Provider";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-slate-900 px-4 py-7 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/provider" onClick={() => setOpen(false)}>
            <Logo inverse />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="flex size-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* User info */}
        <div className="mt-8 flex items-center gap-3 border-b border-white/15 pb-6">
          <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-extrabold">
            {initials}
          </span>
          <div>
            <p className="font-bold">{userName}</p>
            <span className="mt-1 inline-flex rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-foreground">
              Provider
            </span>
          </div>
        </div>

        <NavLinks pathname={pathname} onNavClick={() => setOpen(false)} />

        <button
          onClick={handleLogout}
          className="mt-auto flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary text-sm font-bold text-red-200 transition-colors hover:bg-primary hover:text-white"
        >
          <LogOut className="size-4" />
          Log Out
        </button>
      </aside>

      {/* Hamburger trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex size-9 items-center justify-center rounded-lg text-white hover:bg-white/10"
        aria-label="Open navigation"
      >
        <Menu className="size-6" />
      </button>
    </>
  );
};

const ProviderDashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-muted font-[Inter]">
      <ProviderSidebar />
      {/* Mobile top bar */}
      <header className="flex h-16 items-center justify-between bg-slate-900 px-5 text-white lg:hidden">
        <ProviderMobileDrawer />
        <Link href="/dashboard/provider">
          <Logo inverse />
        </Link>
        <Link href="/" className="text-sm font-bold text-red-200">
          Exit
        </Link>
      </header>
      <main className="min-h-screen lg:ml-[260px]">{children}</main>
    </div>
  );
};

export default ProviderDashboardLayout;
