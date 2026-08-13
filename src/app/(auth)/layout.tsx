import type { ReactNode } from "react";
import { AuthPanel } from "./_components/AuthPanel";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-white font-[Inter] text-foreground">
      <main className="grid lg:grid-cols-2">
        <AuthPanel />
        <section className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-white px-5 py-14 sm:px-8">
          {children}
        </section>
      </main>
    </div>
  );
};

export default AuthLayout;
