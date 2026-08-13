"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/app/services/auth/logout";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import Logo from "../Logo";
import { Avatar } from "./Avatar";
import { GuestActions } from "./UserMenu";
import { accountLinks, guestLinks, logoutLink } from "./nav-links";
import type { HeaderUser } from "./types";

interface MobileDrawerProps {
  user?: HeaderUser;
  isTransparent?: boolean;
}

export const MobileDrawer = ({ user, isTransparent }: MobileDrawerProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("User Logged Out Successfully!");
    router.push("/login");
  };

  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open navigation menu"
        className={`flex size-10 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#e31824] ${
          isTransparent
            ? "text-white hover:bg-white/10"
            : "text-foreground hover:bg-slate-50"
        }`}
      >
        <Menu className="size-6" />
      </SheetTrigger>

      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[min(86vw,340px)] p-0 flex flex-col"
      >
        {/* Drawer Header */}
        <div className="flex h-[70px] items-center justify-between border-b border-border px-5">
          <Link href="/" aria-label="RentRover home">
            <Logo />
          </Link>
          <SheetClose
            aria-label="Close navigation menu"
            className="flex size-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-foreground"
          >
            <X className="size-5" />
          </SheetClose>
        </div>

        {/* User info (if logged in) */}
        {user && (
          <div className="border-b border-border bg-slate-50 px-5 py-5">
            <div className="flex items-center gap-3">
              <Avatar user={user} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  {user.name}
                </p>
                <p className="truncate pt-0.5 text-xs text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto px-3 py-4"
        >
          <div className="space-y-1">
            {guestLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-foreground transition hover:bg-primary/10 hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Logged-in account section */}
          {user && (
            <>
              <div className="my-4 h-px bg-slate-200" />
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {user.role === "provider" ? "Provider" : "Account"}
              </p>
              <div className="space-y-1">
                {accountLinks[user.role].map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-foreground transition hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold text-primary transition hover:bg-primary/10 text-left"
                >
                  <logoutLink.icon className="size-4" />
                  {logoutLink.label}
                </button>
              </div>
            </>
          )}
        </nav>

        {/* Guest CTA at bottom */}
        {!user && (
          <div className="border-t border-border p-5">
            <GuestActions mobile />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
