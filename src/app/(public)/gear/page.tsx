import {
  ChevronRight,
  ChevronLeft,
  ListFilter,
  Filter,
  Search,
} from "lucide-react";
import { Suspense } from "react";
import GearCard, { type GearCardItem } from "@/components/shared/GearCard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPublicCategoriesAction } from "@/app/(public)/_actions/homeActions";
import { getPublicGearsAction } from "@/app/(customer)/_actions/gearActions";
import { filterGears } from "./_actions/filterGears";
import { sortGears } from "./_actions/sortGears";
import { GearFilters } from "./_components/GearFilters";
import { ActiveFilters } from "./_components/ActiveFilters";
import SortDropdown from "./_components/SortDropdown";
import Pagination from "@/components/shared/Pagination";

export default async function GearBrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const categories = await getPublicCategoriesAction();
  let gearItems = await getPublicGearsAction();

  // Parse filters
  const categoryFilters = query.categories
    ? (query.categories as string).split(",")
    : [];
  const maxPrice = query.maxPrice
    ? parseInt(query.maxPrice as string)
    : 1000;
  const conditionFilters = query.conditions
    ? (query.conditions as string).split(",")
    : [];
  const availableOnly = query.availableOnly === "true";
  const sortOption = (query.sort as string) || "newest";

  // Apply filters
  gearItems = filterGears(gearItems, {
    categories: categoryFilters,
    maxPrice,
    conditions: conditionFilters,
    availableOnly,
  });

  // Apply sorting
  gearItems = sortGears(gearItems, sortOption);

  // Formatting for GearCard compatibility
  const formattedItems: GearCardItem[] = gearItems.map((g) => {
    const reviews = g.reviews || [];
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;

    return {
      id: g.id,
      name: g.name,
      brand: g.brand,
      category: g.category?.name || "Uncategorized",
      pricePerDay: g.pricePerDay,
      avgRating,
      reviewCount: totalReviews,
      condition: g.condition,
      image: g.image,
      availability: g.availability,
    };
  });

  const PAGE_SIZE = 12;
  const currentPage = query.page ? parseInt(query.page as string) || 1 : 1;
  const totalPages = Math.ceil(formattedItems.length / PAGE_SIZE);
  const paginatedItems = formattedItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const activeFiltersCount =
    categoryFilters.length +
    conditionFilters.length +
    (maxPrice < 1000 ? 1 : 0) +
    (availableOnly ? 1 : 0);

  return (
    <>
      <section className="border-b border-slate-200 bg-white py-9">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            Gear rental marketplace
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.025em] text-foreground sm:text-4xl">
            Browse All Gear
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Desktop Sidebar */}
          <aside className="hidden h-fit rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] lg:sticky lg:top-24 lg:block">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
                <ListFilter className="size-5 text-primary" />
                Filters
              </h2>
            </div>
            <Suspense fallback={null}>
              <GearFilters categories={categories} />
            </Suspense>
          </aside>

          <section>
            {/* Mobile Top Bar (Row 1: Filters & Sort, Row 2: Results & Grid/List, Row 3: Filter Chips) */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:hidden">
              <div className="flex items-center justify-between gap-3">
                <Sheet>
                  <SheetTrigger className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-bold text-foreground transition-colors hover:bg-slate-50">
                    <ListFilter className="size-3.5 text-primary" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                        {activeFiltersCount}
                      </span>
                    )}
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="flex !h-[85vh] flex-col overflow-hidden rounded-t-2xl px-0 pb-0"
                  >
                    <SheetHeader className="flex-row items-center justify-between border-b border-border px-5 pb-4 pt-4 shrink-0">
                      <SheetTitle className="mt-0 flex items-center gap-2 text-lg font-extrabold text-foreground">
                        <ListFilter className="size-5 text-primary" />
                        Filters
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
                      <Suspense fallback={null}>
                        <GearFilters categories={categories} hideApplyButton />
                      </Suspense>
                    </div>
                    <div className="sticky bottom-0 z-10 w-full shrink-0 border-t border-border bg-white p-5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                      <SheetClose className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-white shadow-md transition hover:bg-primary/90">
                        <Filter className="size-4" />
                        View Results
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>

                <Suspense fallback={null}>
                  <SortDropdown className="flex-1 min-w-0" />
                </Suspense>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-600">
                  Showing <span className="font-bold text-primary">{formattedItems.length}</span>{" "}
                  results for{" "}
                  <span className="font-bold text-foreground">“All Gear”</span>
                </p>
              </div>

              {activeFiltersCount > 0 && (
                <div className="scrollbar-none flex items-center gap-2 overflow-x-auto border-t border-border pt-4">
                  <Suspense fallback={null}>
                    <ActiveFilters categories={categories} />
                  </Suspense>
                </div>
              )}
            </div>

            {/* Tablet Top Bar */}
            <div className="mb-7 hidden flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:flex xl:hidden">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">
                  Showing <span className="font-bold text-primary">{formattedItems.length}</span>{" "}
                  results for{" "}
                  <span className="font-bold text-foreground">“All Gear”</span>
                </p>
                <Suspense fallback={null}>
                  <SortDropdown className="w-48" />
                </Suspense>
              </div>

              {activeFiltersCount > 0 && (
                <div className="scrollbar-none flex items-center gap-2 overflow-x-auto border-t border-border pt-4">
                  <Suspense fallback={null}>
                    <ActiveFilters categories={categories} />
                  </Suspense>
                </div>
              )}
            </div>

            {/* Desktop Top Bar */}
            <div className="mb-7 hidden flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] xl:flex">
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <p className="shrink-0 whitespace-nowrap text-sm font-medium text-slate-600">
                  Showing <span className="font-bold text-primary">{formattedItems.length}</span>{" "}
                  results for{" "}
                  <span className="font-bold text-foreground">“All Gear”</span>
                </p>
                <Suspense fallback={null}>
                  <SortDropdown className="w-48" />
                </Suspense>
              </div>

              {/* Bottom Row */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center border-t border-border pt-4">
                  <Suspense fallback={null}>
                    <ActiveFilters categories={categories} />
                  </Suspense>
                </div>
              )}
            </div>

            {/* Content Grid */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedItems.map((item) => (
                <GearCard key={item.id} item={item} />
              ))}
              {paginatedItems.length === 0 && (
                <div className="col-span-full py-10">
                  <EmptyState 
                    icon={Search}
                    title="No gear found"
                    description="We couldn't find any gear matching your current filters. Try adjusting your search criteria."
                    action={
                      <Button render={<Link href="/gear" />} variant="outline">
                        Clear Filters
                      </Button>
                    }
                  />
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <Suspense fallback={null}>
                <Pagination page={currentPage} totalPages={totalPages} />
              </Suspense>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
