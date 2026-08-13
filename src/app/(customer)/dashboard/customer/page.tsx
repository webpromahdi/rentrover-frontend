"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Plus, Package, RotateCw, DollarSign, PackageOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import StatusBadge from "@/components/shared/StatusBadge";
import PageHeading from "@/components/shared/PageHeading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { getCustomerRentalOrdersAction } from "@/app/(customer)/_actions/rentalActions";
import { getCustomerPaymentsAction } from "@/app/(customer)/_actions/paymentActions";
import { getCustomerReviewsAction } from "@/app/(customer)/_actions/reviewActions";
import { getMyProfile } from "@/lib/api/auth.api";

type StatRow = [React.ElementType, string, string, string, string];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const CustomerDashboardPage = () => {
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["customer-rental-orders"],
    queryFn: getCustomerRentalOrdersAction,
  });

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ["customer-payments"],
    queryFn: getCustomerPaymentsAction,
  });

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["customer-reviews"],
    queryFn: getCustomerReviewsAction,
  });

  const { data: profileData } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  const userName = profileData?.data?.profile?.name ?? null;

  const isLoading = isLoadingOrders || isLoadingPayments || isLoadingReviews;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#e31824]" />
      </div>
    );
  }

  const activeRentals = orders.filter(
    (o: any) => o.status !== "RETURNED" && o.status !== "CANCELLED"
  ).length;

  const totalSpent = payments
    .filter((p: any) => p.status === "PAID")
    .reduce((acc: number, p: any) => acc + parseFloat(p.amount), 0);

  const stats: StatRow[] = [
    [Package, orders.length.toString(), "Total Rentals", "text-primary", "bg-primary/10"],
    [RotateCw, activeRentals.toString(), "Active Rentals", "text-emerald-600", "bg-emerald-50"],
    [DollarSign, `$${totalSpent.toFixed(2)}`, "Total Spent", "text-amber-600", "bg-amber-50"],
    [Star, reviews.length.toString(), "Reviews Given", "text-blue-600", "bg-blue-50"],
  ];

  const recentOrders = orders.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="p-6 sm:p-10">
      <PageHeading
        title={userName ? `Welcome back, ${userName.split(" ")[0]}! 👋` : "Welcome back! 👋"}
        subtitle="Here's an overview of your rental activity."
        action={
          <div className="flex flex-wrap gap-3">
            {/* P3-3: flex-wrap so both buttons appear on mobile */}
            <Link
              href="/dashboard/customer/rent"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Rent New Gear
            </Link>
            <Link
              href="/dashboard/customer/rentals"
              className="inline-flex h-10 items-center rounded-lg border border-primary px-4 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            >
              View All Rentals →
            </Link>
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([Icon, number, label, color, bg]) => (
          <Card
            key={label as string}
            className="flex items-center gap-4 p-5"
          >
            <span
              className={`flex size-11 items-center justify-center rounded-lg ${bg}`}
            >
              <Icon className={`size-6 ${color}`} />
            </span>
            <div>
              <p className="text-2xl font-extrabold text-foreground">{number}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label as string}</p>
            </div>
          </Card>
        ))}
      </div>
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-foreground">
            Recent Rentals
          </h2>
          <Link
            href="/dashboard/customer/rentals"
            className="text-sm font-bold text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <PackageOpen className="mb-4 size-12 text-slate-300" />
            <p className="font-bold text-slate-500">No recent rentals found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <Table className="min-w-[860px] w-full text-left text-sm">
              <TableHeader className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                <TableRow>
                  {[
                    "Gear Item",
                    "Rental Period",
                    "Days",
                    "Amount",
                    "Status",
                    "Action",
                  ].map((item) => (
                    <TableHead key={item} className="px-5 py-4 font-bold">
                      {item}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order: any) => {
                  const startDate = new Date(order.startDate);
                  const endDate = new Date(order.endDate);
                  const days = Math.max(
                    1,
                    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                  );

                  let actionComponent;
                  if (order.status === "PLACED" || order.status === "CONFIRMED") {
                    actionComponent = (
                      <Link
                        href={`/dashboard/customer/payment/${order.id}`}
                        className="inline-flex rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-primary/90"
                      >
                        Pay Now
                      </Link>
                    );
                  } else if (order.status === "RETURNED" && !order.review) {
                    actionComponent = (
                      <Link
                        href="/dashboard/customer/reviews"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Leave Review
                      </Link>
                    );
                  } else {
                    actionComponent = (
                      <Link
                        href={`/dashboard/customer/rentals/${order.id}`}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    );
                  }

                  return (
                    <TableRow
                      key={order.id}
                      className="border-b border-border last:border-0"
                    >
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {order.gearItem?.image ? (
                            <div className="relative size-10 shrink-0 rounded-lg overflow-hidden">
                              <Image
                                src={order.gearItem.image}
                                alt={order.gearItem.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100">
                              <Package className="size-5 text-slate-300" />
                            </div>
                          )}
                          <span className="font-bold text-foreground line-clamp-1">
                            {order.gearItem?.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-slate-600">
                        {formatDate(order.startDate)} – {formatDate(order.endDate)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-slate-600">
                        {days} day{days > 1 ? "s" : ""}
                      </TableCell>
                      <TableCell className="px-5 py-4 font-bold text-foreground">
                        ${parseFloat(order.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        {actionComponent}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
      
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-extrabold text-foreground">
          Recent Payments
        </h2>
        {recentPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <DollarSign className="mb-4 size-12 text-slate-300" />
            <p className="font-bold text-slate-500">No recent payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <Table className="min-w-[650px] w-full text-left text-sm">
              <TableHeader className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                <TableRow>
                  {[
                    "Transaction ID",
                    "Gear",
                    "Amount",
                    "Method",
                    "Status",
                    "Date",
                  ].map((item) => (
                    <TableHead key={item} className="px-5 py-4">
                      {item}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment: any) => (
                  <TableRow
                    key={payment.id}
                    className="border-b border-border last:border-0"
                  >
                    <TableCell className="px-5 py-4 font-bold text-foreground">
                      {payment.transactionId.slice(0, 12)}...
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      {payment.rentalOrder?.gearItem?.name ?? "Gear Item"}
                    </TableCell>
                    <TableCell className="px-5 py-4 font-bold">
                      ${parseFloat(payment.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      {payment.paymentProvider}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <StatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="px-5 py-4 text-slate-500">
                      {formatDate(payment.paidAt || payment.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerDashboardPage;
