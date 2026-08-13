"use client";

import { CircleUserRound } from "lucide-react";
import { Avatar as ShadcnAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { HeaderUser } from "./types";

interface AvatarProps {
  user: HeaderUser;
  size?: "sm" | "md";
}

export const Avatar = ({ user, size = "md" }: AvatarProps) => {
  const dimensions = size === "sm" ? "size-9" : "size-11";

  return (
    <ShadcnAvatar className={`${dimensions} ring-2 ring-slate-100`}>
      <AvatarImage
        src={user.image ?? ""}
        alt={`${user.name} profile`}
        className="object-cover"
      />
      <AvatarFallback
        className="bg-slate-900 text-white"
        aria-label={`${user.name} avatar`}
      >
        <CircleUserRound className="size-5" />
      </AvatarFallback>
    </ShadcnAvatar>
  );
};
