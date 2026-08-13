"use client";

import { X } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function ActiveFilters({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.replace(pathname + "?" + params.toString(), { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const selectedCategoriesIds = searchParams.get("categories")?.split(",") || [];
  const selectedConditions = searchParams.get("conditions")?.split(",") || [];
  const maxPrice = searchParams.get("maxPrice");

  const chips: { label: string; onRemove: () => void }[] = [];

  selectedCategoriesIds.forEach((id) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      chips.push({
        label: cat.name,
        onRemove: () => {
          const newCats = selectedCategoriesIds.filter((catId) => catId !== id);
          updateQueryParams({
            categories: newCats.length > 0 ? newCats.join(",") : null,
          });
        },
      });
    }
  });

  if (maxPrice && parseInt(maxPrice) < 1000) {
    chips.push({
      label: `Max: $${maxPrice}/day`,
      onRemove: () => {
        updateQueryParams({ maxPrice: null });
      },
    });
  }

  selectedConditions.forEach((cond) => {
    chips.push({
      label: cond,
      onRemove: () => {
        const newConds = selectedConditions.filter((c) => c !== cond);
        updateQueryParams({
          conditions: newConds.length > 0 ? newConds.join(",") : null,
        });
      },
    });
  });

  if (chips.length === 0) {
    return null; // Don't render anything if there are no active filters
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-700"
          >
            {chip.label}
            <button
              onClick={chip.onRemove}
              className="text-indigo-400 transition hover:text-indigo-700"
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
      </div>
      <button
        onClick={() => router.replace(pathname, { scroll: false })}
        className="ml-auto pr-2 text-xs font-bold text-primary hover:underline shrink-0"
      >
        Clear All
      </button>
    </>
  );
}
