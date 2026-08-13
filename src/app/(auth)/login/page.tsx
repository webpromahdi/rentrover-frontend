import Logo from "@/components/shared/Logo";
import Link from "next/link";
import { GoogleButton } from "../_components/GoogleButton";
import LoginForm from "../_components/LoginForm";

const LoginPage = () => {
  return (
    <div className="w-full max-w-md">
      <div className="text-center">
        <div className="mx-auto w-fit lg:hidden">
          <Logo />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] text-foreground">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Sign in to your RentRover account
        </p>
      </div>

      <LoginForm />

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-medium text-slate-400">
          Or continue with
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <GoogleButton />

      <p className="mt-8 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-primary hover:underline"
        >
          Sign Up →
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
