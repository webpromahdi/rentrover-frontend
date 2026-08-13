"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/app/services/auth/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "./Avatar";
import { accountLinks, logoutLink } from "./nav-links";
import type { HeaderUser } from "./types";

//Guest Actions

export const GuestActions = ({ mobile = false }: { mobile?: boolean }) => {
  if (mobile) {
    return (
      <div className="grid gap-3">
        <Link
          href="/login"
          className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-bold text-white transition hover:bg-primary/90"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary/90"
      >
        Log In
      </Link>
    </div>
  );
};

//Desktop Account Dropdown

export const UserMenu = ({ user }: { user: HeaderUser }) => {
  const links = accountLinks[user.role];
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("User Logged Out Successfully!");
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="flex items-center gap-1 rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-[#e31824] focus-visible:ring-offset-2"
      >
        <Avatar user={user} size="sm" />
        <ChevronDown className="ml-0.5 size-3.5 text-slate-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={10}
        className="w-56"
      >
        {/* User Info Header */}
        <div className="border-b border-border px-3 py-2.5">
          <p className="truncate text-sm font-bold text-foreground">
            {user.name}
          </p>
          <p className="truncate pt-0.5 text-xs text-slate-500">{user.email}</p>
        </div>

        {/* Nav Links */}
        <div className="pt-1">
          {links.map(({ label, href, icon: Icon }) => (
            <DropdownMenuItem
              key={label}
              onClick={() => {
                window.location.assign(href);
              }}
              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-foreground"
            >
              <Icon className="size-4" />
              {label}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-primary"
          >
            <logoutLink.icon className="size-4" />
            {logoutLink.label}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
