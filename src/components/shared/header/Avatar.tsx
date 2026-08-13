"use client";

import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import type { HeaderUser } from "./types";

interface AvatarProps {
  user: HeaderUser;
  size?: "sm" | "md";
}

export const Avatar = ({ user, size = "md" }: AvatarProps) => {
  const dimensions = size === "sm" ? "size-9" : "size-11";

  if (user.image) {
    return (
      <div className={`relative ${dimensions} rounded-full overflow-hidden ring-2 ring-slate-100`}>
        <Image
          src={user.image}
          alt={`${user.name} profile`}
          fill
          sizes="44px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <span
      aria-label={`${user.name} avatar`}
      className={`flex ${dimensions} items-center justify-center rounded-full bg-slate-900 text-white ring-2 ring-slate-100`}
    >
      <CircleUserRound className="size-5" />
    </span>
  );
}
