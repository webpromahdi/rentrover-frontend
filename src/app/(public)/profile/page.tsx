"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getMyProfile } from "@/lib/api/auth.api";
import { ProfileCard } from "@/components/shared/profile/ProfileCard";
import { ProfileOverview } from "@/components/shared/profile/ProfileOverview";
import { Skeleton } from "@/components/ui/skeleton";

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
        <Skeleton className="mb-8 h-8 w-48 rounded-lg" />
        <div className="space-y-6">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
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
