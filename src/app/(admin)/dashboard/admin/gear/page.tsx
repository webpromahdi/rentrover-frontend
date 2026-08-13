"use client";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Mountain } from "lucide-react";
import Availability from "@/components/shared/Availability";
import ConditionBadge from "@/components/shared/ConditionBadge";
import PageHeading from "@/components/shared/PageHeading";
import { Input } from "@/components/ui/input";
import { useSearchAndSort } from "@/app/hooks/useSearchAndSort";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getAdminGearAction } from "@/app/(admin)/_actions/adminActions";
import Image from "next/image";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const AdminGearContent = () => {
  const {
    localSearch,
    handleSearchChange,
    searchTerm,
    handleFilterChange,
    searchParams,
  } = useSearchAndSort();
  const categoryFilter = searchParams.get("category") || "All";

  const { data: gearItems = [], isLoading } = useQuery({
    queryKey: ["admin-gear"],
    queryFn: getAdminGearAction,
  });

  const categories = [
    "All",
    ...Array.from(
      new Set(gearItems.map((g: any) => g.category?.name).filter(Boolean)),
    ),
  ] as string[];

  const filtered = gearItems.filter((g: any) => {
    const matchesSearch =
      g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || g.category?.name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-5 sm:p-8">
      <PageHeading title="Gear Moderation" />
      <p className="-mt-5 mb-6 text-sm text-slate-500">
        All gear listed across the platform
      </p>
      <div className="mb-6 grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-4">
        <label className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search gear..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm focus:border-primary focus:ring-2 focus:ring-red-100"
          />
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            handleSearchChange("");
            handleFilterChange("category", "All");
          }}
          className="h-10 w-auto rounded-lg border border-slate-200 px-4 text-sm font-bold text-primary hover:bg-primary/10 justify-self-start md:justify-self-auto"
        >
          Reset
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#e31824]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-sm">
          <Mountain className="mb-4 size-12 text-slate-300" />
          <p className="font-bold text-slate-500">No gear items found</p>
        </div>
      ) : (
        <ScrollArea className="h-full w-full overflow-x-auto rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,.06)]">
          <Table className="min-w-[1100px] w-full text-left text-sm">
            <TableHeader className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[.08em] text-slate-500">
              <TableRow>
                {[
                  "#",
                  "Image",
                  "Gear Name",
                  "Brand",
                  "Category",
                  "Provider",
                  "Price/Day",
                  "Stock",
                  "Condition",
                  "Available",
                  "Listed",
                ].map((x) => (
                  <TableHead key={x} className="px-4 py-4">
                    {x}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 bg-white">
              {filtered.map((gear: any, i: number) => (
                <TableRow
                  key={gear.id}
                  className="border-b border-border last:border-0"
                >
                  <TableCell className="px-4 py-3 text-slate-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {gear.image ? (
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={gear.image}
                          alt={gear.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100">
                        <Mountain className="size-5 text-slate-300" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-bold text-foreground">
                    {gear.name}
                  </TableCell>
                  <TableCell className="px-4 py-3">{gear.brand}</TableCell>
                  <TableCell className="px-4 py-3">
                    {gear.category?.name ?? "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-600">
                    {gear.provider?.name ?? "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-bold">
                    ${parseFloat(gear.pricePerDay).toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-3">{gear.stock}</TableCell>
                  <TableCell className="px-4 py-3">
                    <ConditionBadge condition={gear.condition} />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Availability active={gear.isAvailable} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-500">
                    {formatDate(gear.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};

const AdminGearPage = () => (
  <Suspense fallback={<DashboardPageFallback />}>
    <AdminGearContent />
  </Suspense>
);

const DashboardPageFallback = () => (
  <div className="flex h-[60vh] items-center justify-center p-8">
    <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#e31824]" />
  </div>
);

export default AdminGearPage;
