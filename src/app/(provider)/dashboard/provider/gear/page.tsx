"use client";
import { Suspense } from "react";
import { useMemo } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import GearTable, { GearItem } from "@/app/(provider)/_components/GearTable";
import PageHeading from "@/components/shared/PageHeading";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Availability from "@/components/shared/Availability";
import Link from "next/link";
import { useSearchAndSort } from "@/app/hooks/useSearchAndSort";
import { useQuery } from "@tanstack/react-query";
import { getProviderGearAction } from "@/app/(provider)/_actions/gearActions";
import { usePagination } from "@/app/hooks/usePagination";

const PAGE_SIZE = 5;

const ProviderGearContent = () => {
  const { data } = useQuery({
    queryKey: ["provider-gear"],
    queryFn: getProviderGearAction,
  });

  const {
    localSearch,
    handleSearchChange,
    searchTerm,
    handleFilterChange,
    searchParams,
  } = useSearchAndSort();

  const selectedCategory = searchParams.get("category") || "all";
  const selectedCondition = searchParams.get("condition") || "all";
  const availableOnly = searchParams.get("available") === "true";

  const gearData = useMemo(() => {
    let items: GearItem[] = [];
    if (Array.isArray((data as any)?.data?.gearItems)) items = (data as any).data.gearItems;
    else if (Array.isArray((data as any)?.data)) items = (data as any).data;
    else if (Array.isArray(data)) items = data as GearItem[];

    return items.filter((g: GearItem) => {
      const matchesSearch =
        g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryName = typeof g.category === 'string' ? g.category : g.category?.name;
      const matchesCategory =
        selectedCategory === "all" ||
        categoryName?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesCondition =
        selectedCondition === "all" || g.condition === selectedCondition;
      const matchesAvailable = !availableOnly || g.availability === true;

      return matchesSearch && matchesCategory && matchesCondition && matchesAvailable;
    });
  }, [data, searchTerm, selectedCategory, selectedCondition, availableOnly]);

  const { page, setPage, totalPages, paginatedData, startIndex } = usePagination(
    gearData,
    PAGE_SIZE,
    [searchTerm, selectedCategory, selectedCondition, availableOnly]
  );

  return (
    <div className="p-5 sm:p-8">
      <PageHeading
        title="My Gear Listings"
        action={
          <Button
            render={<Link href="/dashboard/provider/gear/new" />}
          >
            <Plus className="size-4" />
            Add New Gear
          </Button>
        }
      />
      <div className="mb-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:grid-cols-2 md:grid-cols-4">
        <label className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search your gear..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:border-primary focus:ring-2 focus:ring-red-100"
          />
        </label>
        {/* Two filter dropdowns in a 2-col grid on mobile */}
        <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:contents">
          <Select
            value={selectedCategory}
            onValueChange={(val) => handleFilterChange("category", val)}
          >
            <SelectTrigger className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-primary focus:ring-2 focus:ring-red-100">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="photography">Photography</SelectItem>
              <SelectItem value="cycling">Cycling</SelectItem>
              <SelectItem value="camping">Camping</SelectItem>
              <SelectItem value="hiking">Hiking</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedCondition}
            onValueChange={(val) => handleFilterChange("condition", val)}
          >
            <SelectTrigger className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-primary focus:ring-2 focus:ring-red-100">
              <SelectValue placeholder="Select Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="EXCELLENT">Excellent</SelectItem>
              <SelectItem value="GOOD">Good</SelectItem>
              <SelectItem value="FAIR">Fair</SelectItem>
              <SelectItem value="POOR">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={() =>
            handleFilterChange("available", availableOnly ? "all" : "true")
          }
          className="flex h-10 w-full md:w-auto items-center gap-3 text-sm font-bold text-foreground sm:col-span-2 md:col-span-1"
        >
          <Availability active={availableOnly} />
          Available only
        </button>
      </div>
      <GearTable items={paginatedData} startIndex={startIndex} />

      {/* Pagination — only render when more than 1 page exists */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

const ProviderGearPage = () => (
  <Suspense fallback={<DashboardPageFallback />}>
    <ProviderGearContent />
  </Suspense>
);

const DashboardPageFallback = () => (
  <div className="flex h-[60vh] items-center justify-center p-8">
    <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#e31824]" />
  </div>
);

export default ProviderGearPage;
