"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, PackageOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PageHeading from "@/components/shared/PageHeading";
import StatusBadge from "@/components/shared/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomerRentalOrdersAction } from "@/app/(customer)/_actions/rentalActions";

type RentalStatus =
  | "ALL"
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

const STATUS_TABS: { key: RentalStatus; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PLACED", label: "Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PAID", label: "Paid" },
  { key: "PICKED_UP", label: "Picked Up" },
  { key: "RETURNED", label: "Returned" },
  { key: "CANCELLED", label: "Cancelled" },
];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const CustomerRentalsListPage = () => {
  const [activeTab, setActiveTab] = useState<RentalStatus>("ALL");

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customer-rental-orders"],
    queryFn: getCustomerRentalOrdersAction,
  });

  const filtered =
    activeTab === "ALL"
      ? orders
      : orders.filter((o: any) => o.status === activeTab);

  const tabCount = (key: RentalStatus) =>
    key === "ALL"
      ? orders.length
      : orders.filter((o: any) => o.status === key).length;

  return (
    <div className="p-6 sm:p-10">
      <PageHeading crumb="Dashboard › My Rentals" title="My Rentals" />

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-border bg-slate-50/50 p-4">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="flex h-[40vh] items-center justify-center text-red-500">
          Failed to load rentals.
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <PackageOpen className="mb-4 size-16 text-slate-300" />
          <p className="text-lg font-bold text-slate-500">
            You have no rentals yet.
          </p>
          <Link
            href="/dashboard/customer/rent"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary/90"
          >
            Rent New Gear
          </Link>
        </div>
      ) : (
        <>
          {/* Status filter tabs — with overflow-x-auto for mobile */}
          <div className="mb-6 flex gap-4 overflow-x-auto border-b border-slate-200 scrollbar-none">
            {STATUS_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition-colors ${
                  activeTab === key
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-foreground"
                }`}
              >
                {label}
                <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                  {tabCount(key)}
                </span>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 shadow-sm">
              <PackageOpen className="mb-4 size-12 text-slate-300" />
              <p className="font-bold text-slate-500">
                No {STATUS_TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} rentals found.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((rental: any) => (
                <Link
                  key={rental.id}
                  href={`/dashboard/customer/rentals/${rental.id}`}
                  className="group overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-28 items-center border-b border-border p-4">
                    {rental.gearItem?.image ? (
                      <div className="relative h-full w-24 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={rental.gearItem.image}
                          alt={rental.gearItem.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-24 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <Package className="size-8 text-slate-300" />
                      </div>
                    )}
                    <div className="ml-4 flex-1 min-w-0">
                      {/* P2-9: Removed line-clamp — show full name, title attr for tooltip */}
                      <h3
                        className="font-bold text-foreground group-hover:text-primary"
                        title={rental.gearItem?.name ?? "Gear Item"}
                      >
                        {rental.gearItem?.name ?? "Gear Item"}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {rental.gearItem?.brand}
                      </p>
                      <p className="mt-2 text-[11px] text-slate-400">
                        {formatDate(rental.startDate)} –{" "}
                        {formatDate(rental.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                    <span className="text-xs font-bold text-slate-500">
                      Total:{" "}
                      <span className="text-foreground">
                        ${parseFloat(rental.totalAmount).toFixed(2)}
                      </span>
                    </span>
                    <StatusBadge status={rental.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerRentalsListPage;
