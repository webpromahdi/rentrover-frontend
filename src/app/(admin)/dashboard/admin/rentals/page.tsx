"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, PackageOpen, CheckCircle2, XCircle, RotateCw } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import PageHeading from "@/components/shared/PageHeading";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getAdminRentalsAction } from "@/app/(admin)/_actions/adminActions";

const STATUS_TABS = [
  "All",
  "PLACED",
  "CONFIRMED",
  "PAID",
  "PICKED_UP",
  "RETURNED",
  "CANCELLED",
] as const;
type StatusTab = (typeof STATUS_TABS)[number];

// User-friendly display names
const STATUS_DISPLAY: Record<string, string> = {
  All: "All",
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  PICKED_UP: "Picked Up",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const AdminRentalsPage = () => {
  const [activeTab, setActiveTab] = useState<StatusTab>("All");

  const { data: rentals = [], isLoading } = useQuery({
    queryKey: ["admin-rentals"],
    queryFn: getAdminRentalsAction,
  });

  const filtered =
    activeTab === "All"
      ? rentals
      : rentals.filter((r: any) => r.status === activeTab);

  const statCards = [
    {
      label: "Total",
      value: rentals.length,
      icon: ClipboardList,
      iconBg: "bg-slate-100",
      iconColor: "text-foreground",
      accent: "bg-slate-900",
    },
    {
      label: "Active",
      value: rentals.filter((r: any) =>
        ["PLACED", "CONFIRMED", "PAID", "PICKED_UP"].includes(r.status),
      ).length,
      icon: RotateCw,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "bg-blue-600",
    },
    {
      label: "Completed",
      value: rentals.filter((r: any) => r.status === "RETURNED").length,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "bg-emerald-600",
    },
    {
      label: "Cancelled",
      value: rentals.filter((r: any) => r.status === "CANCELLED").length,
      icon: XCircle,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      accent: "bg-primary",
    },
  ];

  return (
    <div className="p-5 sm:p-8">
      <PageHeading title="Rental Management" />
      <div className="grid gap-4 sm:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, iconBg, iconColor, accent }) => (
          <Card key={label} className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
            <div className="flex items-center gap-4">
              <span className={`flex size-10 items-center justify-center rounded-full ${iconBg}`}>
                <Icon className={`size-5 ${iconColor}`} />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-foreground">{value}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* P3-1: Wrapped in relative container for gradient scroll-hint */}
      <div className="relative mt-8">
        <div className="flex gap-5 overflow-x-auto border-b border-slate-200 scrollbar-none">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 pb-3 text-sm font-bold ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-foreground"}`}
            >
              {STATUS_DISPLAY[tab]}
            </button>
          ))}
        </div>
        {/* Right gradient fade — hints more tabs off screen on mobile */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#f5f6fa] to-transparent sm:hidden" />
      </div>

      {isLoading ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-border bg-slate-50/50 p-4">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-sm">
          <PackageOpen className="mb-4 size-12 text-slate-300" />
          <p className="font-bold text-slate-500">No rentals found</p>
        </div>
      ) : (
        <ScrollArea className="mt-6 h-full w-full rounded-xl border border-slate-200 bg-white shadow-sm">
          <Table className="min-w-[1000px] w-full text-left text-sm">
            <TableHeader className="border-b border-border bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <TableRow className="hover:bg-transparent">
                {[
                  "ID",
                  "Customer",
                  "Gear Item",
                  "Provider",
                  "Period",
                  "Days",
                  "Amount",
                  "Status",
                ].map((h, i) => (
                  <TableHead key={i} className="px-5 py-3.5">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order: any) => {
                const startDate = new Date(order.startDate);
                const endDate = new Date(order.endDate);
                const days = Math.max(
                  1,
                  Math.ceil(
                    (endDate.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60 * 24),
                  ),
                );
                return (
                  <TableRow
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-slate-50/50"
                  >
                    <TableCell className="px-5 py-4 text-[13px] font-bold text-primary">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] font-medium text-foreground">
                      {order.customer?.name ?? "—"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] text-slate-600">
                      {order.gearItem?.name ?? "—"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] text-slate-600">
                      {order.gearItem?.provider?.name ?? "—"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] text-slate-500 whitespace-nowrap">
                      {formatDate(order.startDate)} – {formatDate(order.endDate)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] text-slate-500">
                      {days}d
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] font-bold text-foreground">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};

export default AdminRentalsPage;
