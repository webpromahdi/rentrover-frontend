"use client";
import { useQuery } from "@tanstack/react-query";
import { Plus, RotateCw, DollarSign, ClipboardList, Boxes } from "lucide-react";
import GearTable from "@/app/(provider)/_components/GearTable";
import PageHeading from "@/components/shared/PageHeading";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { getProviderOrdersAction } from "@/app/(provider)/_actions/orderActions";
import { getProviderGearAction } from "@/app/(provider)/_actions/gearActions";
import Link from "next/link";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const ProviderDashboardPage = () => {
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ["provider-orders"],
    queryFn: getProviderOrdersAction,
  });

  const { data: gearRes, isLoading: isGearLoading } = useQuery({
    queryKey: ["provider-gear"],
    queryFn: getProviderGearAction,
  });

  const gearData = Array.isArray(gearRes?.data?.gearItems)
    ? gearRes.data.gearItems
    : Array.isArray(gearRes?.data)
      ? gearRes.data
      : Array.isArray(gearRes)
        ? gearRes
        : [];
  const totalGear = gearData.length;

  const isLoading = isOrdersLoading || isGearLoading;

  const activeRentals = orders.filter((o) =>
    ["CONFIRMED", "PICKED_UP"].includes(o.status),
  ).length;

  const pendingOrders = orders.filter((o) =>
    ["PLACED", "PAID"].includes(o.status),
  ).length;

  const totalEarnings = orders
    .filter((o) => ["PAID", "PICKED_UP", "RETURNED"].includes(o.status))
    .reduce((acc, o) => acc + parseFloat(o.totalAmount), 0);

  const recentOrders = orders
    .filter((o) => ["PLACED", "CONFIRMED", "PAID", "PICKED_UP"].includes(o.status))
    .slice(0, 5);

  const stats = [
    {
      Icon: Boxes,
      n: isLoading ? "…" : totalGear.toString(),
      label: "Total Gear Listed",
      c: "text-primary",
      b: "bg-primary/10",
    },
    {
      Icon: RotateCw,
      n: isLoading ? "…" : activeRentals.toString(),
      label: "Active Rentals",
      c: "text-emerald-600",
      b: "bg-emerald-50",
    },
    {
      Icon: ClipboardList,
      n: isLoading ? "…" : pendingOrders.toString(),
      label: "Pending Orders",
      c: "text-amber-600",
      b: "bg-amber-50",
    },
    {
      Icon: DollarSign,
      n: isLoading
        ? "…"
        : `$${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      label: "Total Earnings",
      c: "text-foreground",
      b: "bg-slate-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-10">
      <PageHeading
        title="Provider Dashboard"
        action={
            <Button
              render={<Link href="/dashboard/provider/gear/new" />}
            >
              <Plus className="size-4" />
              Add New Gear
            </Button>
            <Button
              render={<Link href="/dashboard/provider/orders" />}
              variant="outline"
              className="hidden sm:flex"
            >
              View All Orders
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        {stats.map(({ Icon, n, label, c, b }) => (
          <Card
            key={label}
            className="relative flex items-center gap-4 overflow-hidden p-6"
          >
            <span
              className={`flex size-11 items-center justify-center rounded-full ${b}`}
            >
              <Icon className={`size-6 ${c}`} />
            </span>
            <div>
              <p className="text-2xl font-extrabold tracking-tight text-foreground">
                {n}
              </p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-foreground">
            Gear Inventory
          </h2>
          <Link
            href="/dashboard/provider/gear"
            className="text-[13px] font-semibold text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <GearTable short />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-foreground">
            Pending Orders
          </h2>
          <Link
            href="/dashboard/provider/orders"
            className="text-[13px] font-semibold text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="size-7 animate-spin rounded-full border-4 border-slate-200 border-t-[#e31824]" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <p className="text-sm font-medium text-slate-400">
              No pending orders right now 🎉
            </p>
          </div>
        ) : (
          <ScrollArea className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <Table className="min-w-[760px] w-full text-left text-sm">
              <TableHeader className="border-b border-border bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <TableRow className="hover:bg-transparent">
                  {[
                    "Order ID",
                    "Customer",
                    "Gear Item",
                    "Dates",
                    "Amount",
                    "Status",
                  ].map((x) => (
                    <TableHead key={x} className="px-5 py-3.5">
                      {x}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-slate-50/50"
                  >
                    <TableCell className="px-5 py-4">
                      <Link
                        href={`/dashboard/provider/orders/${order.id}`}
                        className="font-bold text-primary"
                      >
                        #{order.id.slice(0, 8).toUpperCase()}
                      </Link>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] font-medium text-foreground">
                      {order.customer?.name ?? "—"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] text-slate-600">
                      {order.gearItem?.name ?? "—"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] text-slate-500">
                      {formatDate(order.startDate)} — {formatDate(order.endDate)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] font-bold text-foreground">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </section>
    </div>
  );
};

export default ProviderDashboardPage;
