"use client";
import type React from "react";
import { useState } from "react";
import {
  Star,
  LayoutDashboard,
  Package,
  CreditCard,
  Settings,
  LogOut,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/services/auth/logout";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/lib/api/auth.api";

const nav = [
  [LayoutDashboard, "Dashboard", "/dashboard/customer"],
  [Package, "My Rentals", "/dashboard/customer/rentals"],
  [PlusCircle, "Rent New Gear", "/dashboard/customer/rent"],
  [Star, "My Reviews", "/dashboard/customer/reviews"],
  [Settings, "Profile", "/dashboard/customer/profile"],
] as [React.ElementType, string, string][];

const NavLinks = ({
  pathname,
  onNavClick,
}: {
  pathname: string;
  onNavClick?: () => void;
}) => (
  <nav className="mt-7 space-y-1">
    {nav.map(([Icon, label, href]) => {
      const isActive =
        pathname === href ||
        (href !== "/dashboard/customer" && pathname.startsWith(href + "/"));
      return (
        <Link
          key={label}
          href={href}
          onClick={onNavClick}
          className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-3 text-sm font-semibold transition-colors ${
            isActive
              ? "border-primary bg-white/10 text-white"
              : "border-transparent text-slate-200 hover:border-primary hover:bg-white/5 hover:text-white"
          }`}
        >
          <Icon className="size-5" aria-hidden="true" />

          {label}
        </Link>
      );
    })}
  </nav>
);

function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: profileData } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  const userName = profileData?.data?.profile?.name || "Customer";
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
    <aside className="hidden fixed inset-y-0 left-0 z-40 w-[260px] flex-col bg-slate-900 px-4 py-7 text-white lg:flex">
      <Link href="/dashboard/customer" className="mb-10">
        <Logo inverse />
      </Link>
      <div className="flex items-center gap-3 border-b border-white/15 pb-6">
        <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-700 text-sm font-extrabold">
          {initials}
        </span>
        <div>
          <p className="font-bold">{userName}</p>
          {/* Unified role badge style: semi-transparent white like Admin */}
          <span className="mt-1 inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em]">
            Customer
          </span>
        </div>
      </div>
      <NavLinks pathname={pathname} />
      {/* Fixed: w-full, cursor-pointer, transition-colors (matching Admin/Provider) */}
      <button
        onClick={handleLogout}
        className="mt-auto flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary text-sm font-bold text-red-200 transition-colors hover:bg-primary hover:text-white"
      >
        <LogOut className="size-4" aria-hidden="true" />

        Log Out
      </button>
    </aside>
  );
}

function CustomerMobileDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: profileData } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  const userName = profileData?.data?.profile?.name || "Customer";
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
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden cursor-default"
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
          <Link href="/dashboard/customer" onClick={() => setOpen(false)}>
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
          <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-700 text-sm font-extrabold">
            {initials}
          </span>
          <div>
            <p className="font-bold">{userName}</p>
            <span className="mt-1 inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em]">
              Customer
            </span>
          </div>
        </div>

        <NavLinks pathname={pathname} onNavClick={() => setOpen(false)} />

        <Button
          onClick={handleLogout}
          variant="outline"
          className="mt-auto w-full text-red-200 hover:bg-primary hover:text-white"
        >
          <LogOut className="size-4" aria-hidden="true" />

          Log Out
        </Button>
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
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted font-[Inter] text-foreground">
      <DashboardSidebar />
      {/* Mobile top bar — now has hamburger drawer */}
      <header className="flex h-16 items-center justify-between bg-slate-900 px-5 text-white lg:hidden">
        <CustomerMobileDrawer />
        <Link href="/dashboard/customer">
          <Logo inverse />
        </Link>
        {/* Fixed: was a <button> firing logout, now a proper Link */}
        <Link href="/" className="text-sm font-bold text-red-200">
          Exit
        </Link>
      </header>
      <main className="min-h-screen lg:ml-[260px]">{children}</main>
    </div>
  );
}
