import Logo from "@/components/shared/Logo";
import { GoogleButton } from "../_components/GoogleButton";
import RegisterForm from "../_components/RegisterForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="w-full max-w-md">
      <div className="text-center">
        <div className="mx-auto w-fit lg:hidden">
          <Logo />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] text-foreground">
          Create Your Account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Start renting or listing gear in minutes
        </p>
      </div>
      <RegisterForm />
      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">Or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <GoogleButton register />
      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-primary hover:underline"
        >
          Sign In →
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
