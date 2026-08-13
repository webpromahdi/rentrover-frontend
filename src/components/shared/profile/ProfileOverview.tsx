import {
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Calendar,
  Clock,
  MessageSquare,
  ShoppingBag,
  Store,
  Tag,
  Star,
  LockKeyhole,
} from "lucide-react";

export const ProfileOverview = ({
  profile,
  user,
}: {
  profile: any;
  user: any;
}) => {
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const lastUpdated = new Date(user.updatedAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
            <User className="size-5 text-primary" />
            <h3 className="text-lg font-extrabold text-foreground">
              Personal Information
            </h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-[140px_1fr] items-start gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Phone className="size-4 text-slate-400" />
                Phone Number
              </div>
              <p className="text-sm font-medium text-slate-600">
                {profile?.phone || "Not provided"}
              </p>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-start gap-4 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Mail className="size-4 text-slate-400" />
                Email Address
              </div>
              <p className="text-sm font-medium text-slate-600 truncate">
                {user.email}
              </p>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-start gap-4 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <MapPin className="size-4 text-slate-400" />
                Address
              </div>
              <p className="text-sm font-medium text-slate-600">
                {profile?.address || "Not provided"}
              </p>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-start gap-4 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <MessageSquare className="size-4 text-slate-400" />
                Bio
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-600">
                {profile?.bio || "No bio provided yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
            <ShieldCheck className="size-5 text-primary" />
            <h3 className="text-lg font-extrabold text-foreground">
              Account Information
            </h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Store className="size-4 text-slate-400" />
                Role
              </div>
              <p className="text-sm font-medium text-slate-600 uppercase">
                {user.role}
              </p>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-4 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <ShieldCheck className="size-4 text-slate-400" />
                Status
              </div>
              <div>
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-green-600">
                  {user.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-4 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Calendar className="size-4 text-slate-400" />
                Member Since
              </div>
              <p className="text-sm font-medium text-slate-600">
                {memberSince}
              </p>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-4 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Clock className="size-4 text-slate-400" />
                Last Updated
              </div>
              <p className="text-sm font-medium text-slate-600">
                {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <ShoppingBag className="size-5 text-primary" />
          <h3 className="text-lg font-extrabold text-foreground">
            Profile Overview
          </h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingBag className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground">0</p>
              <p className="text-sm font-bold text-foreground">Total Orders</p>
              <p className="mt-0.5 text-xs text-slate-500">No orders yet</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground">0</p>
              <p className="text-sm font-bold text-foreground">Total Rentals</p>
              <p className="mt-0.5 text-xs text-slate-500">No rentals yet</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Tag className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground">0</p>
              <p className="text-sm font-bold text-foreground">Listed Gear</p>
              <p className="mt-0.5 text-xs text-slate-500">No gear listed</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Star className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground">0</p>
              <p className="text-sm font-bold text-foreground">Reviews</p>
              <p className="mt-0.5 text-xs text-slate-500">No reviews yet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-red-100 bg-primary/10/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4 sm:items-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-foreground">
              Keep Your Account Secure
            </h4>
            <p className="mt-1 text-sm text-slate-600">
              Update your profile information and keep your account secure.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-primary shadow-sm transition hover:bg-slate-50"
        >
          <LockKeyhole className="size-4" />
          Security Settings
        </button>
      </div>
    </div>
  );
}
