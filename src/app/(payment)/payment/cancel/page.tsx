"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
            <Button
              render={<Link href={`/dashboard/customer/payment/${rentalOrderId}`} />}
              size="xl"
              className="w-full rounded-xl"
            >
              Try Payment Again
            </Button>
          )}
          <Button
            render={<Link href="/dashboard/customer/rentals" />}
            variant="secondary"
            size="lg"
            className="w-full rounded-xl"
          >
            View My Rentals
          </Button>
          <Button
            render={<Link href="/dashboard/customer" />}
            variant="ghost"
            size="lg"
            className="w-full text-slate-400 hover:bg-transparent hover:text-slate-600"
          >
            Back to Dashboard
          </Button>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          Need help?{" "}
          <a
            href="mailto:support@rentrover.com"
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
