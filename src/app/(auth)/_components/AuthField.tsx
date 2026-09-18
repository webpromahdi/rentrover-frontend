"use client";
import React from "react";
import { AtSign, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Field = ({
  label,
  name,
  icon: Icon,
  placeholder,
  type = "text",
  suffix,
  defaultValue,
  onChange,
  autoComplete,
}: {
  label: string;
  name: string;
  icon: typeof AtSign;
  placeholder: string;
  type?: string;
  suffix?: boolean;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
}) => {
  const id = label.toLowerCase().replaceAll(" ", "-");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-foreground">
        {label}
      </label>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          id={id}
          name={name}
          type={suffix ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={onChange}
          autoComplete={autoComplete}
          /* Disable spellcheck on email and username fields to avoid browser red-underlining */
          spellCheck={type === "email" || name === "email" ? false : undefined}
          className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm transition-[border-color,box-shadow] placeholder:text-slate-400 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        />
        {suffix && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
