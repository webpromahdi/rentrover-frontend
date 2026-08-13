"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import PageHeading from "@/components/shared/PageHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Package,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { getCustomerRentalOrderByIdAction } from "@/app/(customer)/_actions/rentalActions";
import { createCheckoutSessionAction } from "@/app/(customer)/_actions/paymentActions";
import Image from "next/image";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const statusBadgeVariants: Record<string, any> = {
  PLACED: "colorAmber",
  CONFIRMED: "colorBlue",
  PAID: "colorEmerald",
  PICKED_UP: "colorPurple",
  RETURNED: "colorSlate700",
  CANCELLED: "colorRed",
};

const CustomerPaymentPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["rental-order", orderId],
    queryFn: () => getCustomerRentalOrderByIdAction(orderId),
    retry: false,
  });

  const payMutation = useMutation({
    mutationFn: () => createCheckoutSessionAction(orderId),
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Could not get payment URL. Please try again.");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to start payment");
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 sm:p-10">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-6 sm:p-10">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <Package className="mb-4 size-12 text-slate-300" />
          <p className="text-lg font-bold text-slate-500">Order not found.</p>
          <Button onClick={() => router.push("/dashboard/customer/rentals")} variant="outline" className="mt-4">
            View My Rentals
          </Button>
        </div>
      </div>
    );
  }

  if (order.status === "PAID" || order.status === "RETURNED") {
    return (
      <div className="p-6 sm:p-10">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <CheckCircle2 className="mb-4 size-12 text-emerald-500" />
          <p className="text-lg font-bold text-slate-700">This order has already been paid!</p>
          <Button onClick={() => router.push("/dashboard/customer/rentals")} className="mt-4 bg-primary hover:bg-primary/90">
            View My Rentals
          </Button>
        </div>
      </div>
    );
  }

  const gear = order.gearItem;
  const totalAmount = parseFloat(order.totalAmount);

  const startDate = new Date(order.startDate);
  const endDate = new Date(order.endDate);
  const days = Math.max(
    1,
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const pricePerDay = gear ? (totalAmount / days / order.quantity) : 0;

  return (
    <div className="p-6 sm:p-10">
      <PageHeading
        crumb={`Dashboard  ›  My Rentals  ›  Pay for #${orderId.slice(0, 8).toUpperCase()}`}
        title="Complete Payment"
      />

      <div className="grid gap-6 xl:grid-cols-[11fr_9fr]">
        {/* Order Summary Card */}
        <Card className="p-6">
          <h2 className="text-xl font-extrabold text-foreground">
            Order Summary
          </h2>

          <div className="mt-6 flex gap-4">
            {gear?.image ? (
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={gear.image}
                  alt={gear.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <Package className="size-8 text-slate-300" />
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-foreground">
                {gear?.name ?? "Gear Item"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{gear?.brand}</p>
              {gear?.address && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="size-3 text-primary" />
                  {gear.address}
                </p>
              )}
              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                <Calendar className="size-3.5 text-slate-400" />
                {formatDate(order.startDate)} – {formatDate(order.endDate)} · {days} day{days !== 1 ? "s" : ""}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Quantity: {order.quantity} unit{order.quantity !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="my-6 border-t border-slate-200" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>
                Gear rental ({days} day{days !== 1 ? "s" : ""} × ${pricePerDay.toFixed(2)} × {order.quantity})
              </span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between text-lg font-extrabold text-foreground">
              <span>Total</span>
              <span className="text-primary">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Badge
              size="statusLg"
              variant={statusBadgeVariants[order.status] ?? "colorSlate600"}
            >
              {order.status}
            </Badge>
            <Badge variant="colorSlate500" size="info">
              Powered by Stripe
            </Badge>
          </div>
        </Card>

        {/* Pay Now Card */}
        <Card className="p-6">
          <h2 className="text-xl font-extrabold text-foreground">
            💳 Complete Payment
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            You will be redirected to Stripe for secure payment.
          </p>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Order Total</span>
              <span className="text-2xl font-extrabold text-primary">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Secure payment processed by Stripe
            </p>
          </div>

          <Button
            onClick={() => payMutation.mutate()}
            disabled={payMutation.isPending || order.status === "CANCELLED"}
            className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-extrabold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {payMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              `🔒 Pay $${totalAmount.toFixed(2)} Securely`
            )}
          </Button>

          <p className="mt-5 text-center text-xs font-bold text-slate-500">
            <span className="text-[#635bff]">stripe</span> · 256-bit SSL Encryption
          </p>
          <div className="mt-4 flex justify-center gap-3 text-xs font-extrabold text-slate-400">
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>AMEX</span>
          </div>
          <p className="mt-6 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            Full refund if cancelled 24 hours before rental start.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CustomerPaymentPage;
