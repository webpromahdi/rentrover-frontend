"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Check, Circle, Package, PackageOpen } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import PageHeading from "@/components/shared/PageHeading";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCustomerRentalOrderByIdAction,
  getCustomerRentalOrdersAction,
} from "@/app/(customer)/_actions/rentalActions";
import Image from "next/image";

const ORDER_STEPS = [
  "PLACED",
  "CONFIRMED",
  "PAID",
  "PICKED_UP",
  "RETURNED",
  "CANCELLED",
] as const;

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

const CustomerRentalDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rental-order", orderId],
    queryFn: () => getCustomerRentalOrderByIdAction(orderId),
    retry: false,
  });

  const { data: allOrders = [] } = useQuery({
    queryKey: ["customer-rental-orders"],
    queryFn: getCustomerRentalOrdersAction,
  });

  const otherOrders = allOrders.filter((o) => o.id !== orderId);

  if (isLoading) {
    return (
      <div className="p-6 sm:p-10">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-[500px] w-full rounded-xl lg:col-span-2" />
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[280px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-6 sm:p-10">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <Package className="mb-4 size-12 text-slate-300" />
          <p className="text-lg font-bold text-slate-500">
            Rental order not found.
          </p>
          <Button
            onClick={() => router.push("/dashboard/customer/rentals")}
            variant="outline"
            className="mt-4"
          >
            Back to My Rentals
          </Button>
        </div>
      </div>
    );
  }

  const gear = order.gearItem;

  const currentStepIndex = (() => {
    if (order.status === "CANCELLED") return ORDER_STEPS.indexOf("CANCELLED");
    return ORDER_STEPS.indexOf(order.status as (typeof ORDER_STEPS)[number]);
  })();

  const isCancelled = order.status === "CANCELLED";
  const isPaid =
    order.status === "PAID" ||
    order.status === "PICKED_UP" ||
    order.status === "RETURNED";

  const startDate = new Date(order.startDate);
  const endDate = new Date(order.endDate);
  const days = Math.max(
    1,
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  const totalAmount = parseFloat(order.totalAmount);
  const pricePerDay = totalAmount / days / order.quantity;

  const steps = ORDER_STEPS.filter((s) => s !== "CANCELLED").map((step) => {
    const stepIndex = ORDER_STEPS.indexOf(step);
    return {
      label: step,
      completed: stepIndex <= currentStepIndex && !isCancelled,
      active: stepIndex === currentStepIndex && !isCancelled,
    };
  });

  return (
    <div className="p-6 sm:p-10">
      <PageHeading
        crumb={`Dashboard  ›  My Rentals  ›  #${orderId.slice(0, 8).toUpperCase()}`}
        title="Rental Details"
      />

      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        {/* Left: Gear Info */}
        <Card className="overflow-hidden p-0 border-none">
          {gear?.image ? (
            <div className="relative aspect-[21/9] w-full overflow-hidden">
              <Image
                src={gear.image}
                alt={gear.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[21/9] w-full items-center justify-center bg-slate-100">
              <Package className="size-16 text-slate-300" />
            </div>
          )}
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">
                  {gear?.name ?? "Gear Item"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{gear?.brand}</p>
                {gear?.address && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="size-3.5 text-primary" />
                    {gear.address}
                  </p>
                )}
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-y-5 border-t border-border pt-6 text-sm">
              <p className="text-slate-500">
                Rental period{" "}
                <strong className="block pt-1 text-foreground">
                  {formatDate(order.startDate)} — {formatDate(order.endDate)}
                </strong>
              </p>
              <p className="text-slate-500">
                Duration{" "}
                <strong className="block pt-1 text-foreground">
                  {days} day{days !== 1 ? "s" : ""} · {order.quantity} unit
                  {order.quantity !== 1 ? "s" : ""}
                </strong>
              </p>
              <p className="text-slate-500">
                Price per day{" "}
                <strong className="block pt-1 text-foreground">
                  ${pricePerDay.toFixed(2)}
                </strong>
              </p>
              <p className="text-slate-500">
                Total amount{" "}
                <strong className="block pt-1 text-xl text-primary">
                  ${totalAmount.toFixed(2)}
                </strong>
              </p>
            </div>
          </div>
        </Card>

        {/* Right: Order Summary + Pay Now */}
        <Card className="h-fit p-6">
          <h2 className="text-xl font-extrabold text-foreground">
            Order Summary
          </h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Order ID</dt>
              <dd className="font-bold">
                #{orderId.slice(0, 8).toUpperCase()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Placed on</dt>
              <dd className="font-bold">{formatDate(order.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Status</dt>
              <dd>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase ${statusBadgeColors[order.status] ?? "bg-slate-100 text-slate-600"}`}
                >
                  {order.status}
                </span>
              </dd>
            </div>
          </dl>
          <div className="my-6 border-t border-border" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">
              Payment status
            </span>
            <StatusBadge status={isPaid ? "PAID" : "PENDING"} />
          </div>

          {!isPaid && !isCancelled && (
            <Link
              href={`/dashboard/customer/payment/${order.id}`}
              className="mt-5 flex h-12 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-white transition hover:bg-primary/90"
            >
              Pay Now
            </Link>
          )}

          {isCancelled && (
            <div className="mt-5 rounded-lg bg-primary/10 p-3 text-center text-sm font-bold text-red-600">
              This order has been cancelled.
            </div>
          )}

          <p className="mt-4 text-center text-xs font-semibold text-slate-500">
            🔒 Payments secured by Stripe
          </p>
        </Card>
      </div>

      {/* Order Progress */}
      {!isCancelled && (
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-extrabold text-foreground">
            Order Progress
          </h2>
          <div className="mt-8 grid grid-cols-3 gap-y-7 md:grid-cols-5">
            {steps.map((step) => {
              const lineColor = step.completed
                ? "md:before:bg-emerald-500"
                : step.active
                  ? "md:before:bg-blue-500"
                  : "md:before:bg-slate-200";

              return (
                <div
                  key={step.label}
                  className={`relative text-center before:absolute before:top-5 before:right-1/2 before:hidden before:h-0.5 before:w-full md:before:block first:before:hidden ${lineColor}`}
                >
                  <span
                    className={`relative z-10 mx-auto flex size-10 items-center justify-center rounded-full transition-colors duration-300 ${
                      step.active
                        ? "border-4 border-blue-200 bg-blue-600 text-white"
                        : step.completed
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : "border-2 border-slate-300 bg-white text-slate-400"
                    }`}
                  >
                    {step.completed ? (
                      <Check className="size-5" />
                    ) : (
                      <Circle className="size-3" />
                    )}
                  </span>
                  <p className="mt-3 text-[11px] font-extrabold uppercase tracking-wider text-foreground">
                    {step.label.replaceAll("_", " ")}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Payment History */}
      <Card className="mt-8 p-6">
        <h2 className="mb-5 text-xl font-extrabold text-foreground">
          Payment History
        </h2>
        {order.payments && order.payments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-[600px] w-full text-left text-sm">
              <TableHeader className="border-b border-slate-200 text-xs uppercase tracking-[0.08em] text-slate-500">
                <TableRow>
                  {["TXN ID", "Amount", "Provider", "Status", "Date"].map(
                    (item) => (
                      <TableHead key={item} className="pb-3">
                        {item}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.payments.map(
                  (payment: {
                    id: string;
                    transactionId: string;
                    amount: string;
                    paymentProvider: string;
                    status: string;
                    paidAt?: string;
                    createdAt: string;
                  }) => (
                    <TableRow key={payment.id}>
                      <TableCell className="py-4 font-bold">
                        {payment.transactionId.slice(0, 12)}...
                      </TableCell>
                      <TableCell className="py-4">
                        ${parseFloat(payment.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="py-4">
                        {payment.paymentProvider}
                      </TableCell>
                      <TableCell className="py-4">
                        <StatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell className="py-4 text-slate-500">
                        {formatDate(payment.paidAt ?? payment.createdAt)}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-10 text-center">
            <PackageOpen className="mb-3 size-10 text-slate-300" />
            <p className="font-bold text-slate-500">No payments yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Complete your payment to see the history here.
            </p>
          </div>
        )}
      </Card>

      {/* Other Rentals */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-extrabold text-foreground">
          Other Rentals
        </h2>
        {otherOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <PackageOpen className="mb-3 size-12 text-slate-300" />
            <p className="font-bold text-slate-500">No other rentals found</p>
            <p className="mt-1 text-sm text-slate-400">
              Once you rent more gear, they will appear here.
            </p>
            <Link
              href="/dashboard/customer/rent"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary/90"
            >
              Browse Gear
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherOrders.map((rental) => (
              <Link
                key={rental.id}
                href={`/dashboard/customer/rentals/${rental.id}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col transition hover:shadow-md"
              >
                <div className="flex h-24 items-center border-b border-border">
                  {rental.gearItem?.image ? (
                    <div className="relative h-full w-24 shrink-0 overflow-hidden">
                      <Image
                        src={rental.gearItem.image}
                        alt={rental.gearItem.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-24 shrink-0 items-center justify-center bg-slate-100">
                      <Package className="size-7 text-slate-300" />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-bold text-foreground line-clamp-1">
                      {rental.gearItem?.name ?? "Gear Item"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(rental.startDate)} –{" "}
                      {formatDate(rental.endDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-slate-50 px-3 py-2.5">
                  <span className="text-xs font-medium text-slate-500">
                    #{rental.id.slice(0, 8).toUpperCase()}
                  </span>
                  <Badge
                    size="statusSm"
                    variant={statusBadgeVariants[rental.status] ?? "colorSlate600"}
                  >
                    {rental.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerRentalDetailsPage;
