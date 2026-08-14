"use client";

import { AtSign, LockKeyhole, ShieldCheck, User, Mountain } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Field } from "./AuthField";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { loginAction } from "../_actions/AuthActions";

const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    icon: ShieldCheck,
    email: "admin@gearup.com",
    password: "Test@1234",
    color: "from-red-500 to-rose-600",
    bg: "hover:bg-red-50 border-red-200 text-red-700",
  },
  {
    label: "User",
    icon: User,
    email: "arafat.hossain@gmail.com",
    password: "Arafat@1234",
    color: "from-blue-500 to-indigo-600",
    bg: "hover:bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    label: "Provider",
    icon: Mountain,
    email: "mountainpeak@gmail.com",
    password: "Mountain@1234",
    color: "from-emerald-500 to-teal-600",
    bg: "hover:bg-emerald-50 border-emerald-200 text-emerald-700",
  },
];

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [demoCredentials, setDemoCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  useEffect(() => {
    if (state && !state.success) {
      toast.error(state.message || "Login failed");
    }
  }, [state]);

  const fillDemo = (email: string, password: string) => {
    setDemoCredentials({ email, password });
  };

  return (
    <div className="mt-8 space-y-5">
      {/* Demo Login Buttons */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
          Quick Demo Login
        </p>
        <div className="flex gap-2">
          {DEMO_ACCOUNTS.map(({ label, icon: Icon, email, password, bg }) => (
            <button
              key={label}
              type="button"
              onClick={() => fillDemo(email, password)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-150 ${bg}`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
        {demoCredentials && (
          <p className="mt-2 text-center text-[11px] text-slate-400">
            ✓ Credentials filled — click <strong>Sign In</strong>
          </p>
        )}
      </div>

      <form action={formAction} className="space-y-5">
        <Field
          label="Email Address"
          icon={AtSign}
          type="email"
          name="email"
          placeholder="your@email.com"
          defaultValue={demoCredentials?.email ?? ""}
          key={demoCredentials?.email}
        />
        {state?.errors?.email && (
          <p className="text-xs text-red-500">{state.errors.email[0]}</p>
        )}

        <Field
          label="Password"
          icon={LockKeyhole}
          type="password"
          name="password"
          placeholder="Enter your password"
          suffix
          defaultValue={demoCredentials?.password ?? ""}
          key={demoCredentials?.password}
        />
        {state?.errors?.password && (
          <p className="text-xs text-red-500">{state.errors.password[0]}</p>
        )}

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600">
            <Checkbox className="size-4 rounded border-slate-300 accent-[#e31824]" />
            Remember me
          </label>

          <a
            href="#forgot"
            className="text-sm font-bold text-primary hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-white transition hover:bg-primary/90"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
