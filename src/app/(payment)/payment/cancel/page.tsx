"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import Link from "next/link";

const CancelContent = () => {
  const searchParams = useSearchParams();
  const rentalOrderId = searchParams.get("rentalOrderId");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/20">
          <XCircle className="size-10 text-primary" />
        </div>

        <h1 className="text-2xl font-extrabold text-foreground">
          Payment Cancelled
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Your payment was not completed. No charges have been made.
          <br />
          You can retry the payment or go back to your rentals.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {rentalOrderId && (
            <Link
              href={`/dashboard/customer/payment/${rentalOrderId}`}
              className="flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-white transition hover:bg-primary/90"
            >
              Try Payment Again
            </Link>
          )}
          <Link
            href="/dashboard/customer/rentals"
            className="flex h-11 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            View My Rentals
          </Link>
          <Link
            href="/dashboard/customer"
            className="flex h-11 items-center justify-center text-sm font-semibold text-slate-400 transition hover:text-slate-600"
          >
            Back to Dashboard
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          Need help?{" "}
          <a
            href="mailto:support@gearup.com"
            className="font-bold text-primary hover:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

const PaymentCancelPage = () => (
  <Suspense>
    <CancelContent />
  </Suspense>
);

export default PaymentCancelPage;
