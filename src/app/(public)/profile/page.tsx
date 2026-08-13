"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getMyProfile } from "@/lib/api/auth.api";
import { ProfileCard } from "@/components/shared/profile/ProfileCard";
import { ProfileOverview } from "@/components/shared/profile/ProfileOverview";

const ProfilePage = () => {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      router.push("/login");
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="space-y-6">
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!data?.success || !data?.data?.profile) return null;

  const user = data.data.profile;

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-foreground">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <ProfileCard user={user} />
        <ProfileOverview profile={user.profile} user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
