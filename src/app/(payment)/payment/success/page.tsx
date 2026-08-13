"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="size-10 text-emerald-500" />
        </div>

        <h1 className="text-2xl font-extrabold text-foreground">
          Payment Successful!
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Your rental order has been confirmed and payment received. 🎉
          <br />
          You can now track your rental from the dashboard.
        </p>

        {sessionId && (
          <p className="mt-4 rounded-lg bg-slate-50 px-4 py-2.5 text-xs font-mono text-slate-400">
            Session: {sessionId.slice(0, 24)}...
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Button
            render={<Link href="/dashboard/customer/rentals" />}
            size="xl"
            className="w-full rounded-xl"
          >
            View My Rentals
          </Button>
          <Button
            render={<Link href="/dashboard/customer" />}
            variant="secondary"
            size="lg"
            className="w-full rounded-xl"
          >
            Back to Dashboard
          </Button>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          Powered by{" "}
          <span className="font-bold text-[#635bff]">Stripe</span> · 256-bit SSL
        </p>
      </div>
    </div>
  );
};

const PaymentSuccessPage = () => (
  <Suspense>
    <SuccessContent />
  </Suspense>
);

export default PaymentSuccessPage;
