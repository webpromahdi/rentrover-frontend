import Image from "next/image";
import { Mail, Calendar, CircleUserRound, Pencil } from "lucide-react";

export const ProfileCard = ({ user }: { user: any }) => {
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Decorative Banner Background */}
      <div className="absolute inset-y-0 right-0 w-full max-w-[600px] opacity-70 sm:opacity-100">
        <Image
          src="https://i.ibb.co.com/BKwFc3SP/profile-banner.png"
          alt="Profile Banner"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover object-right"
          priority
          unoptimized
        />
        {/* Gradient overlay to smoothly blend image into white background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        {/* Avatar */}
        <div className="relative shrink-0">
          {user.profile?.profileImage ? (
            <Image
              src={user.profile.profileImage}
              alt={user.name}
              width={120}
              height={120}
              className="size-[120px] rounded-full object-cover ring-4 ring-white shadow-sm"
            />
          ) : (
            <div className="flex size-[120px] items-center justify-center rounded-full bg-slate-900 text-white ring-4 ring-white shadow-sm">
              <CircleUserRound className="size-[60px]" />
            </div>
          )}
          {/* Edit Avatar Button */}
          <button
            type="button"
            className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-primary"
          >
            <Pencil className="size-4" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              {user.name}
            </h2>
            <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              {user.role}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Mail className="size-4 shrink-0 text-slate-400" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Calendar className="size-4 shrink-0 text-slate-400" />
              Joined {joinedDate}
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="sm:self-start">
          <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary/90">
            <Pencil className="size-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
