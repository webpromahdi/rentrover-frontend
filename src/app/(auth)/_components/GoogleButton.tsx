import Link from "next/link";

export const GoogleButton = ({ register = false }: { register?: boolean }) => {
  const googleAuthUrl = `${process.env.BACKEND_API_URL}/api/auth/google`;

  return (
    <Link
      href={googleAuthUrl}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white text-sm font-bold text-[#1b2748] transition hover:bg-slate-50"
    >
      <span className="text-lg font-extrabold">
        <span className="text-[#4285F4]">G</span>
      </span>
      {register ? "Sign up with Google" : "Continue with Google"}
    </Link>
  );
};
