"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<typeof Button>;

interface LinkButtonProps extends Omit<ButtonProps, "render"> {
  href: string;
}

/**
 * A Button that renders as a Next.js Link.
 * Use this in Server Components instead of passing a render function to Button.
 */
export function LinkButton({ href, children, ...props }: LinkButtonProps) {
  return (
    <Button render={(p) => <Link href={href} {...p} />} {...props}>
      {children}
    </Button>
  );
}
