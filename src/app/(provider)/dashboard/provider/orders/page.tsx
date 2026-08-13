"use client";
import { Suspense } from "react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, PackageOpen } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import PageHeading from "@/components/shared/PageHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchAndSort } from "@/app/hooks/useSearchAndSort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  getProviderOrdersAction,
  updateProviderOrderStatusAction,
  type ProviderOrder,
} from "@/app/(provider)/_actions/orderActions";

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

// User-friendly display names for status enum values
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

const getNextStatus = (
  status: ProviderOrder["status"],
): "CONFIRMED" | "PICKED_UP" | "RETURNED" | null => {
  if (status === "PLACED") return "CONFIRMED";
  if (status === "PAID") return "PICKED_UP";
  if (status === "PICKED_UP") return "RETURNED";
  return null;
};

const getActionLabel = (status: ProviderOrder["status"]) => {
  if (status === "PLACED") return "✓ Confirm";
  if (status === "PAID") return "Mark Picked Up";
  if (status === "PICKED_UP") return "Mark Returned";
  return "View";
};

const ProviderOrdersContent = () => {
  const {
    localSearch,
    handleSearchChange,
    searchTerm,
    handleFilterChange,
    searchParams,
  } = useSearchAndSort();

  const activeTab = (searchParams.get("tab") as StatusTab) || "All";

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["provider-orders"],
    queryFn: getProviderOrdersAction,
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "CONFIRMED" | "PICKED_UP" | "RETURNED";
    }) => updateProviderOrderStatusAction(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
    },
  });

  const filtered = orders.filter((o) => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const matchesSearch =
      o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.gearItem?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts = STATUS_TABS.reduce(
    (acc, tab) => {
      acc[tab] =
        tab === "All"
          ? orders.length
          : orders.filter((o) => o.status === tab).length;
      return acc;
    },
    {} as Record<StatusTab, number>,
  );

  return (
    <div className="p-5 sm:p-8">
      <PageHeading title="Incoming Orders" />

      {/* Search bar*/}
      <div className="mb-4">
        <label className="relative flex items-center">
          <Search className="absolute left-3 size-4 text-slate-400" />
          <Input
            placeholder="Search by customer, gear or order ID..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:border-primary focus:ring-2 focus:ring-red-100 focus-visible:ring-0 sm:max-w-sm"
          />
        </label>
      </div>

      {/* P3-1: Relative wrapper for gradient scroll-hint on mobile */}
      <div className="relative">
        <div className="flex gap-5 overflow-x-auto border-b border-border bg-white px-4 pt-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] scrollbar-none">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilterChange("tab", tab)}
              className={`h-auto whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-foreground"}`}
            >
              {STATUS_DISPLAY[tab]} ({tabCounts[tab]})
            </button>
          ))}
        </div>
        {/* Right gradient fade — hints more tabs off screen on mobile */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent sm:hidden" />
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
          <p className="font-bold text-slate-500">No orders found</p>
        </div>
      ) : (
        <ScrollArea className="mt-6 h-full w-full rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <Table className="min-w-[960px] w-full text-left text-sm">
            <TableHeader className="border-b border-border bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <TableRow className="hover:bg-transparent">
                {[
                  "Order ID",
                  "Customer",
                  "Gear Item",
                  "Start Date",
                  "End Date",
                  "Qty",
                  "Total",
                  "Status",
                  "Action",
                ].map((x) => (
                  <TableHead key={x} className="px-5 py-3.5">
                    {x}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const nextStatus = getNextStatus(order.status);
                const actionLabel = getActionLabel(order.status);
                return (
                  <TableRow
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-slate-50/50"
                  >
                    <TableCell className="px-4 py-4">
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
                      {formatDate(order.startDate)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] text-slate-500">
                      {formatDate(order.endDate)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] text-slate-500">
                      {order.quantity}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] font-bold text-foreground">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      {nextStatus ? (
                        <Button
                          disabled={isPending}
                          onClick={() =>
                            updateStatus({ id: order.id, status: nextStatus })
                          }
                          className={`h-8 rounded-lg px-3 text-xs font-bold transition-colors ${order.status === "PLACED" ? "bg-primary text-white hover:bg-primary/90" : order.status === "PAID" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                        >
                          {actionLabel}
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
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

const ProviderOrdersPage = () => (
  <Suspense fallback={<DashboardPageFallback />}>
    <ProviderOrdersContent />
  </Suspense>
);

const DashboardPageFallback = () => (
  <div className="flex h-[60vh] items-center justify-center p-8">
    <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#e31824]" />
  </div>
);

export default ProviderOrdersPage;
