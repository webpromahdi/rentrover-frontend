"use client";

import { AtSign, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Field } from "./AuthField";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { loginAction } from "../_actions/AuthActions";

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state && !state.success) {
      toast.error(state.message || "Login failed");
    }
  }, [state]);
  return (
    <form action={formAction} className="mt-8 space-y-5">
      <Field
        label="Email Address"
        icon={AtSign}
        type="email"
        name="email"
        placeholder="your@email.com"
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
  );
}

export default LoginForm;
