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
}: {
  label: string;
  name: string;
  icon: typeof AtSign;
  placeholder: string;
  type?: string;
  suffix?: boolean;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
          className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-red-100"
        />
        {suffix && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
