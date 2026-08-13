"use client";
import { ArrowRight, AtSign, Check, LockKeyhole, User } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { registerAction } from "../_actions/AuthActions";
import { Field } from "./AuthField";
import Link from "next/link";

// Password Strength Logic
const PASSWORD_RULES = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special symbol", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const getStrengthBar = (password: string) => {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const percent = (passed / PASSWORD_RULES.length) * 100;
  const colors = [
    "",
    "bg-primary/100",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-blue-500",
    "bg-emerald-500",
  ];
  const labels = ["", "Very Weak", "Weak", "Fair", "Good", "Strong"];
  const textColors = [
    "",
    "text-red-500",
    "text-orange-500",
    "text-yellow-500",
    "text-blue-500",
    "text-emerald-600",
  ];
  return {
    percent,
    barColor: colors[passed],
    label: labels[passed],
    textColor: textColors[passed],
  };
}

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");

  useEffect(() => {
    if (state && !state.success) {
      toast.error(state.message || "Registration failed");
    }
  }, [state]);

  const strength = getStrengthBar(password);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {/* Full Name */}
      <Field
        label="Full Name"
        name="name"
        icon={User}
        placeholder="Your full name"
        defaultValue={state?.data?.name || ""}
      />
      {state?.errors?.name && (
        <p className="text-xs text-red-500">{state.errors.name[0]}</p>
      )}

      {/* Email */}
      <Field
        label="Email Address"
        name="email"
        icon={AtSign}
        type="email"
        placeholder="your@email.com"
        defaultValue={state?.data?.email || ""}
      />
      {state?.errors?.email && (
        <p className="text-xs text-red-500">{state.errors.email[0]}</p>
      )}

      {/* Password + Strength Bar */}
      <div>
        <Field
          label="Password"
          name="password"
          icon={LockKeyhole}
          type="password"
          placeholder="Create a password"
          suffix
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Dynamic Strength Bar + Requirements Checklist */}
        {password && (
          <div className="mt-2 space-y-2">
            {/* Bar */}
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.barColor}`}
                  style={{ width: `${strength.percent}%` }}
                />
              </div>
              <span className={`text-xs font-bold ${strength.textColor}`}>
                {strength.label}
              </span>
            </div>
          </div>
        )}

        {state?.errors?.password && (
          <p className="mt-1 text-xs text-red-500">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <Field
        label="Confirm Password"
        name="confirmPassword"
        icon={LockKeyhole}
        type="password"
        placeholder="Confirm your password"
        suffix
      />
      {state?.errors?.confirmPassword && (
        <p className="text-xs text-red-500">
          {state.errors.confirmPassword[0]}
        </p>
      )}

      {/* Role Selection */}
      <fieldset>
        <legend className="text-sm font-bold text-foreground">I want to:</legend>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {/* Customer */}
          <label
            className={`relative cursor-pointer rounded-xl border-2 p-4 transition-colors ${
              role === "CUSTOMER"
                ? "border-primary bg-primary/10"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <Input
              type="radio"
              name="role"
              value="CUSTOMER"
              checked={role === "CUSTOMER"}
              onChange={() => setRole("CUSTOMER")}
              className="sr-only"
            />
            {role === "CUSTOMER" && (
              <Check className="absolute right-3 top-3 size-4 rounded-full bg-primary p-0.5 text-white" />
            )}
            <span className="text-xl">🏃</span>
            <span className="mt-2 block text-sm font-extrabold text-foreground">
              Customer
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate-600">
              Rent gear for my adventures
            </span>
            <span className="mt-3 block text-[11px] font-semibold leading-5 text-slate-500">
              • Browse gear
              <br />• Rent by day
              <br />• Track orders
            </span>
          </label>

          {/* Provider */}
          <label
            className={`relative cursor-pointer rounded-xl border-2 p-4 transition-colors ${
              role === "PROVIDER"
                ? "border-primary bg-primary/10"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <Input
              type="radio"
              name="role"
              value="PROVIDER"
              checked={role === "PROVIDER"}
              onChange={() => setRole("PROVIDER")}
              className="sr-only"
            />
            {role === "PROVIDER" && (
              <Check className="absolute right-3 top-3 size-4 rounded-full bg-primary p-0.5 text-white" />
            )}
            <span className="text-xl">🏪</span>
            <span className="mt-2 block text-sm font-extrabold text-foreground">
              Provider
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate-600">
              List my gear and earn
            </span>
            <span className="mt-3 block text-[11px] font-semibold leading-5 text-slate-500">
              • List equipment
              <br />• Manage orders
              <br />• Get paid
            </span>
          </label>
        </div>
        {state?.errors?.role && (
          <p className="mt-1 text-xs text-red-500">{state.errors.role[0]}</p>
        )}
      </fieldset>

      {/* Terms */}
      <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-5 text-slate-600">
        <Checkbox
          name="acceptTerms"
          defaultChecked={state?.data?.acceptTerms === "on"}
          className="mt-0.5 size-4 rounded border-slate-300 accent-[#e31824]"
        />
        <span>
          I agree to the{" "}
          <Link
            href="/terms"
            className="font-semibold text-primary hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-semibold text-primary hover:underline"
          >
            Privacy Policy
          </Link>
        </span>
      </label>
      {state?.errors?.acceptTerms && (
        <p className="mt-1 text-xs text-red-500">
          {state.errors.acceptTerms[0]}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-extrabold text-white transition hover:bg-primary/90"
      >
        {isPending ? "Creating Account..." : "Create Account"}
        {!isPending && <ArrowRight className="size-4" />}
      </Button>
    </form>
  );
}

export default RegisterForm;
